const jwt = require('jsonwebtoken')
const User = require('../model/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id,  'tokens.token': token})

        if (!user) {
            throw new Error()
        }

        req.token = token // CURRENTLY LOGGED DEVICE TOKEN FOR THE PERSON, THIS HELPS TO LOGOUT ONLY FROM DEVICE THE PERSON LOGGED
        req.user = user // AUTHORIZED PERSON USER OBJECT, HELPS TO GET CURRENTLY LOGGED USER OBJECT
        next()

    } catch (e) {
        res.status(401).send({error: "Please authenticate."})
    }
}

module.exports = auth