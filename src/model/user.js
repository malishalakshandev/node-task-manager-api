const mongoose = require('mongoose');
const validator = require('validator');
const bycrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }

    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain password');
            }
        }

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer // store binary data of images
    }
}, {
    timestamps: true
});

// To find task created by the user, via user side -> we implement virtual property. 
// Vitual property -> virtual propert not a actual data stored in the database, But it is a relationship between two entities
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // 'user id' in User Model
    foreignField: 'owner' // 'user id' in Task Model
}) 

userSchema.methods.toJSON = function () {

    const user = this
    const userObject = user.toObject()

    delete userObject.password // remove password object from json array when show user details
    delete userObject.tokens // remove tokens object array from json array when show user details
    delete userObject.avatar // remove avatar object from json array when show user details

    return userObject
} 

// 'methods' use to access instances or instance methods
userSchema.methods.generateAuthToken = async function () {
    
    const user = this
    const token = jwt.sign({ _id:user._id.toString() }, process.env.JWT_SECRET)
    
    // Generatingn & save multiple tokens( sub documents ) for one user, to track the user when login with different devices for same account ( via same username )
    // In each time of user login for the same account (  via same username ), there will be creating a new token object inside the 'object array'
    // Using this, can easy track user login sessions and logout sessions by different devices for same account ( via same user username )
    user.tokens = user.tokens.concat({ token }) // Concat new token obejct to the tokens 'object array' tokens: [ {token: fdjfjdfkdsf}, {token: gaejkguegug} ]
    await user.save()
    
    return token // here returns the new token to the calling point to send both user object & token object to the client
}

// 'static' method use to access MODEL methods things
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bycrpt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before the saving
userSchema.pre('save', async function (next) { // pre(Save) = BEFORE EXECUTES save() LINE
    
    const user = this // this == OBJECT COME FROM USER REQUEST PARAMETER. HERE "this" INCLUDES ALL THE DATA IN REQUEST PARAMETER (INCLUDING CHANGES TO THE VALUE) BEFORE save() LINE EXECUTES

    if (user.isModified('password')) {
        user.password = await bycrpt.hash(user.password, 8)
    }
    next()
})

// Delete user's tasks when user is removed thier profile
userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})


// CREATING A User MODEL
const User = mongoose.model('User', userSchema);

module.exports = User; // EXPORT User MODEL TO index.js file