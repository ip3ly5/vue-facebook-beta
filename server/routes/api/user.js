const express = require('express')
const router = express.Router();
const formidable = require('formidable')
var ObjectId = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken')
let loadCollection = require('../../common/loadCollection') 
const detect = require('detect-file-type')
const {v1: uuidv1} = require('uuid')
const fs = require('fs')
const path = require('path')


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
        users.findOne({_id:ObjectId(req.decoded.user._id)}, (err, jMongoResponse)=>{
            if(err){console.log('That user doesnt exist'); return}
            res.status(200).send(jMongoResponse)
        })
    });

router.put('/', async (req, res) => {
    const form = formidable({ multiples: true });
    const users = await loadCollection.load('users');
    const posts = await loadCollection.load('posts');
        try {
            form.parse(req, (err, fields, files)=>{
                if (fields.name) {
                    let name = fields.name
                    posts.updateMany({user_id:ObjectId(req.decoded.user._id)}, { $set: { "name": name}}, (err, jMongoResponse)=>{
                        if(jMongoResponse==null){console.log('Error updating name'); return}
                    })
                    
                    users.updateMany({friends: { $elemMatch: { _id: ObjectId(req.decoded.user._id) }}}, { $set: { "friends.$.name" : name }}, (err, jMongoResponse)=>{
                        if(jMongoResponse==null){console.log('Error updating name'); return}
                        console.log(jMongoResponse)
                    })

                    users.updateOne({_id:ObjectId(req.decoded.user._id)}, { $set: { "name": name}}, (err, jMongoResponse)=>{
                        if(jMongoResponse==null){console.log('Error updating name'); return}
                        users.findOne({_id:ObjectId(req.decoded.user._id)}, (err, jUserObject)=>{
                            if(err){console.log('That user doesnt exist'); return}
                            res.status(200).send(jUserObject)
                        })
                    })
                }
                if (fields.bio) {
                    let bio = fields.bio
                    users.updateOne({_id:ObjectId(req.decoded.user._id)}, { $set: { "bio": bio}}, (err, jMongoResponse)=>{
                            if(jMongoResponse==null){console.log('Error updating bio'); return}
                        users.findOne({_id:ObjectId(req.decoded.user._id)}, (err, jUserObject)=>{
                            if(err){console.log('That user doesnt exist'); return}
                            res.status(200).send(jUserObject)
                        })
                    })
                }
                if (files.profilePicture){
                    if(err){console.log('error in file'); return}
                    detect.fromFile(files.profilePicture.path, (err, result) => {
                        const pictureName = uuidv1()+"."+result.ext
                        const allowedImageTypes = ["jpg", "jpeg", "png", "gif"]
                        if(!allowedImageTypes.includes(result.ext)) {
                            return res.send("File type not supported")
                        }
                        const oldPath = files.profilePicture.path
                        const newPath = path.join(__dirname + '..','..','..','..','client','static', pictureName)
                        fs.rename(oldPath, newPath, err =>{
                            if(err){console.log('cannot move file' + err); return}
                        })
                        posts.updateMany({user_id:ObjectId(req.decoded.user._id)}, { $set: { "profileImage": pictureName}}, (err, jMongoResponse)=>{
                            if(jMongoResponse==null){console.log('Error updating Image in posts'); return}
                        })
                        
                        users.updateMany({friends: { $elemMatch: { _id: ObjectId(req.decoded.user._id) }}}, { $set: { "friends.$.profileImage" : pictureName }}, (err, jMongoResponse)=>{
                            if(jMongoResponse==null){console.log('Error updating name'); return}
                            console.log(jMongoResponse)
                        })

                        users.updateOne({_id:ObjectId(req.decoded.user._id)}, { $set: { "profileImage": pictureName}}), (err, jMongoResponse)=>{
                            if(jMongoResponse==null){console.log('Error updating Image'); return}
                            users.findOne({_id:ObjectId(req.decoded.user._id)}, (err, jUserObject)=>{
                                if(err){console.log('That user doesnt exist'); return}
                                res.status(200).send(jUserObject)
                            })
                        }
                    })
                }
            })
        }catch(err){
            console.log('error')
        }
    })

module.exports = router;