const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../model/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')

const router = new express.Router() 

router.post('/users', async (req, res)=> {
    
    //CREATING A NEW USER FROM MODEL
    const user = new User(req.body)
    
    try {

        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })

    }catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        //filter() returns, create new array with only the condition is true from the array. if condition is false that array not return to the new created array
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        
        req.user.tokens = []
        await req.user.save()
        res.status(200).send(req.user)

    } catch (e) {
        res.status(500).send()
    }
})

// request -> MIDDLEWARE(auth) -> run route handler
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body) // GETTING ONLY THE KEY FROM A KEY VALUE PAIR OBJECT LIKE { 'KEY': 'VALUE' }
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({'error': 'Invalid updates!'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

// registering the middleware for upload images in 'avatar' folder
const upload = multer({
    //dest: 'avatars',  // here removed the destination for add image to folder, instead of saving image in a folder, save it directly into the database as in the route handle section
    limits: {
        fileSize: 1000000 // 1MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)

    }
})

// Below function uses two middleware functions called 'auth' and 'upload.single('upload')'
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer // assign image binary(buffer) data to req.user.avatar (in auth middleware) 
    await req.user.save() // then save the avatar binary data into the user document in database (collection)
    res.send()

}, (error,req, res, next) => {
    res.status(400).send({ error: error.message }) // error message from multer
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined // when equal undefined to the field, binary data will removed
    await req.user.save()
    res.send()
})

//<img src="http://localhost:3000/users/5ea67f7a3313512094488a95/avatar" >
//<img src="data:image/jpg;base64,PASTE YOUR LARGE IMAGE BINARY VALUES HERE
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png') // set header to response
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router