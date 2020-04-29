const express = require('express');
require('./db/mongoose'); // TO ACCESS THE DATABASE
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT;

app.use(express.json()); // ALLOW ACCESS TO INCOMING REQUEST TO SERVER AS JSON OBJECT
app.use(userRouter) // REGISTERING USER'S ROUTES
app.use(taskRouter) // REGISTERING TASK'S ROUTES

app.listen((port), () => {
    console.log(`Server is up on port ${port}.`);
});


/* BELOW LINKS PROVIDE HOW TO WORKS WITH LATEST env-cmd nmp package if it version is higher than 9.0.0
https://stackoverflow.com/questions/56301852/env-cmd-error-failed-to-locate-env-file-in-gatsby */