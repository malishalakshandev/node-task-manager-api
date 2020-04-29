// CRUD WITH MONGO DB
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require('mongodb');


//CONFIGURE CONNECTION URL & DATABASE
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
 

//CONNECT TO THE SERVER
MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database');
  }

  console.log('Connected correctly..!');
  const db = client.db(databaseName);

  db.collection('tasks').deleteOne({
    description: 'Go to gym'
  }).then((result) => {
    console.log(result.deletedCount);
  }).catch((error) => {
    console.log(error);
  });
  

});




/* INSERT */

/* FOR INSERT ONE DOCUMENT
db.collection('users').insertOne({
      name: 'Landy',
      age: 28
    }, (error, result) => {
      if (error) {
        return console.log('ERROR: Unable to insert user');
      }
    
      console.log('RESULT: ', result.ops);
    
    });
*/

/* FOR INSERT MANY DOCUMENTS
    db.collection('users').insertMany([
      { 
        name:'Jane',
        age: 20
      },
      {
        name: 'Katy',
        age: 24
      }
    ], (error, result) => {
      if (error) {
        return console.log('ERROR: Unable to insert documents');
      }
    
      console.log(result.ops);
    })
*/

/* FOR INSERT MANY DOCUMENTS WITH A BOOLEAN FIELD
    db.collection('tasks').insertMany([
      {
        description: 'Buy foods',
        completed: true
      },
      {
        description: 'Go to gym',
        completed: true
      },
      {
        description: 'Go to office',
        completed: false
      }
    ], (error, result) => {
      if (error) {
        return console.log('ERROR: Unable to insert documents');
      }

      console.log(result.ops);
    });
*/







/* READ */

/* READ ONE DOCUMENT BY IT'S ID FIELD
 db.collection('users').findOne({ _id: new ObjectID("5e9f0807faec611a8880e41b") }, (error, user) => {
    if (error) {
      return console.log('ERROR: Unable to fetch');
    }

    console.log('Result: ',user);

   });
*/

/* READ MANY DOCUMENTS BY A ONE FIELD
 db.collection('users').find({ age: 23 }).toArray((error, users) => {
     console.log('FIND: ', users);
   })
*/

/* READ AND GET COUNT OF MANY DOCUMENT BY A FIELD
  db.collection('users').find({ age: 23 }).count((error, countUsers) => {
    console.log('COUNT USERS: ', countUsers);
  })
*/

/* READ MANY DOCUMENTS WHICH FIELD NAME IS BOOLEAN WITH FALSE VALUE
  // FIND RETURN A CURSOR VALUE, SO WE CANNOT RETREIVE IN CALLBACK FUNCTION DIRECTLY LIKE "findOne()"
  // THERE'RE SOME METHODS TO ACCESS CURSOR ONE OF THEM IS "toArray()". SO WE CAN RETRIEVE THEM AS AN ERROR ALSO CAN USE CALLBACK FUNCTION INSIDE "toArray()" FUNCTION
   db.collection('tasks').find({ completed: false }).toArray((error, res) => {
    console.log('Uncompleted tasks: ', res);
   });
*/







/* UPDATE - WITH PROMISE */

/* UPDATE A FILED BY _id
    db.collection('users').updateOne({
    _id: new ObjectID("5e9eaee682ba1275e592ee4f")
  }, {
    $set: {
      name: 'Mike' // UPDATE TO MIKE 
    }

    // $inc: {
    //   age: 2 // INCREMENTS BY 2
    // }

  }).then((result) => { // PROMISE CALLBACK
    console.log(result);
    
  }).catch((error) => {
    console.log(error);
    
  })
*/

/* UPDATE MANY BY BOOLEANS

db.collection('tasks').updateMany({
    completed: false
  }, {
    $set: {
      completed: true
    }
  }).then((result) => {
    console.log(result.modifiedCount);

  }).catch((error) => {
    return console.log(error);
    
  });

*/







/* DELETE MANY - PROMISE */

/* DELETE MANY DOCUMENTS BY A FIELD
  db.collection('users').deleteMany({
    age: 25
  }).then((result) => {
    console.log(result.deletedCount);
  }).catch((error) => {
    console.log(error);
  });
*/

/* DELETE ONE DOCUMENT BY A FILED
db.collection('tasks').deleteOne({
    description: 'Go to gym'
  }).then((result) => {
    console.log(result.deletedCount);
  }).catch((error) => {
    console.log(error);
  });
*/

//useNewUrlParser: true
