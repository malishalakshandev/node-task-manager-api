const mongoose = require('mongoose');

// CONNECTING THE SERVER & DATABASE
mongoose.connect( process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false // TO DISABLE OR AVOID DEPRECATED ERROR LOG
    
})
