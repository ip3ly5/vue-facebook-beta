const express = require("express")
const app = express()
const ObjectId = require('mongodb').ObjectId

const MongoClient = require('mongodb').MongoClient;
// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'hippo';
let db = ''
// Use connect method to connect to the server
MongoClient.connect(url, {useUnifiedTopology: true }, function(err, client) {
  console.log("Connected successfully to server")
  db = client.db(dbName) // connection pool
});

// ##############################
app.post('/posts', (req,res) => {

    const userId = '5eb3d917a580662e043ae4a5';
    const message = 'What is up?';
    const collection = db.collection('users');
    
    // Insert in the user with id 5eb3d6c4a8f5795ba8946014 in the posts array
    collection.findOneAndUpdate({ 
    _id: new ObjectId(userId) 
    }, { 
    $push: { posts: { _id: new ObjectId(), message } } 
    }, (err, result) => err ? res.json(err) : res.json(result.value.posts[result.value.posts.length - 1]._id)
    );
    
   });

// ##############################


// ##############################
app.listen(80, err => {
	if(err){console.log('server cannot listen...'); return}
	console.log('server listening...')
})
