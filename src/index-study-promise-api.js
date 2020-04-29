const express = require('express');
require('./db/mongoose'); // TO ACCESS THE DATABASE
const User = require('./model/user')
const Task = require('./model/task')

const app = express();
const port = process.env.PORT || 3000;

// ALLOW ACCESS TO OUR INCOMING REQUEST TO SERVER AS JSON OBJECT
app.use(express.json());

app.post('/users', (req, res)=> {
    
    //CREATING A NEW USER FROM MODEL
    const user = new User(req.body)
    
    user.save().then(() => {
        res.status(201).send(user);
    }).catch((e) => {
        res.status(400); // THIS STATUS MUST SET HERE BEFORE SEND THE RESPONSE TO CLIENT, OTHERWISE IT SHOWS AS 200 SUCCESS STATUS. FIND STATUS CODE FROM: https://httpstatuses.com/
        res.send(e)
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((e) => {
        res.status(500).send(e)
    });
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.send(user)

    }).catch((e) => {
        res.status(500).send(e)
    })
})





app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    
    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id

    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)

    }).catch((e) => {
        res.status(500).send(e)
    })
})



app.listen((port), () => {
    console.log(`Server is up on port ${port}.`);
});