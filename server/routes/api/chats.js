const express = require('express')
const router = express.Router();
const formidable = require('formidable')
var ObjectId = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken')
let loadCollection = require('../../common/loadCollection') 

//* middleware function to authorize user *//
router.use(function (req, res, next) {
    if(!req.headers.authorization) return res.status(500).send('Invalid request')
    
    let JWTheader = req.headers.authorization
    TokenArray = JWTheader.split(" ");
    jwt.verify(TokenArray[1], 'the jwt secret key', function(err, decoded) {
        if(err || decoded==undefined) {
            return res.status(500).send('Invalid request');
        }
         else {
             req.decoded = decoded
             next()
         }
    })
})


router.post('/', async (req, res) => {
    const form = formidable({ multiples: true });
    const users = await loadCollection.load('users');

    try {
        form.parse(req, (err, fields, files)=>{
            console.log(fields)
            users.updateOne({_id:ObjectId(req.decoded.user._id)}, { $push: {"chats": fields}}, (err, jMongoResponse)=>{
                if(jMongoResponse==null){console.log('Error updating name'); return}
                users.updateOne({_id:ObjectId(fields.sender)}, { $push: {"chats": fields}}, (err, jMongoResponse)=>{
                    if(err){console.log('That user doesnt exist'); return}
                    res.status(200).send('worked')
                })
            })
        })
    }catch(err){
        if(err){console.log('error'); return}
    }
})

module.exports = router;