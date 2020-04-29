const mongoose = require('mongoose');
const validator = require('validator');

// CONNECTING THE SERVER & DATABASE
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
    
})

// CREATING A User MODEL
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
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
    }
});

// CREATE AN INSTANSE FROM User MODEL
const me = new User({
    name: 'Malisha  ',
    email: 'malishalakshan@malisha.com  ',
    password: 'PASSWORd',
    age: 23
})

// SAVE DOCUMENT TO THE DATABASE & GET RETURN VALUES WITH PROMISES
me.save().then(() => {
    console.log(me);
}).catch((error) => {
    console.log('ERROR! ', error);
})


const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const task = new Task({
    description: 'Go to office    '
    //completed: false
});

task.save().then(() => {
    console.log(task);
}).catch((error) => {
    console.log('ERROR.!', error);
});