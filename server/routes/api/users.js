const express = require('express')
const mongodb = require('mongodb')
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

router.get('/', async (req, res) => {
    const users = await loadCollection.load('users');
        users.find().toArray((err, jMongoResponse)=>{
            if(err){console.log('Could not query database.'); return}
            res.status(200).send(jMongoResponse)
        })
    });

router.get('/:id', async (req, res) => {
    const users = await loadCollection.load('users');
        users.findOne({_id:ObjectId(req.params.id)}, (err, jMongoResponse)=>{
            if(err){console.log('That user doesnt exist'); return}
            res.status(200).send(jMongoResponse)
        })
    });
    

module.exports = router;