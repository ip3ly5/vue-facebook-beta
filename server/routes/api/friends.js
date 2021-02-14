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
                if (fields.friend_id) {
                    users.findOne({"_id": ObjectId(req.decoded.user._id)}, {projection: { name: true, profileImage: true, friends:true }}, (err, jFriendSender)=>{
                        if(err){console.log('Not logged in' + err); return}
                        let friendReceiverId = fields.friend_id
                        var i = null;
                        for (i = 0; jFriendSender.friends.length > i; i += 1) {
                            if (jFriendSender.friends[i]._id == friendReceiverId) {
                                res.status(409).send('Already friends with this user')
                                console.log('Already friends with this user.'); return
                            }
                        }
                        delete jFriendSender['friends']

                        users.findOne({"_id": ObjectId(friendReceiverId)}, {projection: { name: true, profileImage: true }}, (err, jFriendReceiver)=>{
                            if(err){console.log('Could not find user receiving friend request' + err); return}
                            users.updateOne({_id:ObjectId(req.decoded.user._id)}, { $push: {"friends": jFriendReceiver}}, (err, jMongoResponse)=>{
                                if(err){console.log('Could not query database.' + err); return}
                                users.updateOne({_id:ObjectId(friendReceiverId)}, { $push: { "friends": jFriendSender}}, (err, jMongoResponse2)=>{
                                    if(err){console.log('Could not query database.' + err); return}
                                    res.status(200).send('Friend has been added!')
                                })
                            })
                        })
                    })
                }
            })
        }catch(err){
            console.log('error')
        }
    })

module.exports = router;