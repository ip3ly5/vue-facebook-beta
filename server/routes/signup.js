const express = require('express')
const mongodb = require('mongodb')
const router = express.Router();
const path = require('path')
const formidable = require('formidable')


async function loadUsersCollection() {
    const client = await mongodb.MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
    return client.db('company').collection('users');
}

router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname,'..','views','signup.html'))
})

router.post('/', async (req, res) => {
    const users = await loadUsersCollection();
    try {
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files)=>{
            let username = fields.username
            let password = fields.password
            let email = fields.email
            let birthdate = fields.birthdate
            users.insertOne({"name":username, "password":password, "email":email, "birthdate":birthdate, "friends": []}, (err, jMongoResponse)=>{
                if(err){console.log('There was an error creating user'); return}
                res.send('user created')
            })
        })
        // usersCollection.find().toArray( (err, data) => {
        //     res.send(data)
        // })
    }catch(err){
        console.log(err)
    }
})

module.exports = router;