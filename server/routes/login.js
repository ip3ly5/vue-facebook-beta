const express = require('express')
const mongodb = require('mongodb')
const router = express.Router();
const path = require('path')
const formidable = require('formidable')
var jwt = require('jsonwebtoken')

async function loadUsersCollection() {
    const client = await mongodb.MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
    return client.db('company').collection('users');
}

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..','views','login.html'))
})

router.post('/', async (req, res) => {
    const form = formidable({ multiples: true });
    const users = await loadUsersCollection();
    try {
        form.parse(req, (err, fields, files)=>{
            let username = fields.username
            let password = fields.password
            users.findOne({"name":username, "password":password}, (err, jMongoResponse)=>{
                if(jMongoResponse==null){console.log('That user doesnt exist'); return}
                delete jMongoResponse['password']
                var token = jwt.sign({ user: jMongoResponse }, 'the jwt secret key');
                console.log(token)
                res.send(token)
            })
        })
        // usersCollection.find().toArray( (err, data) => {
        //     res.send(data)
        // })
    }catch(err){
        console.log('error')
    }
})

module.exports = router;