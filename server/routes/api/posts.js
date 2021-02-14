const express = require('express')
const mongodb = require('mongodb')
const router = express.Router();
const formidable = require('formidable')
var ObjectId = require('mongodb').ObjectID;
var jwt = require('jsonwebtoken');
const { response } = require('express');
const detect = require('detect-file-type')
const {v1: uuidv1} = require('uuid')
const fs = require('fs')
const path = require('path')

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
    const posts = await loadCollection.load('posts');
    const users = await loadCollection.load('users');

    users.findOne({"_id": ObjectId(req.decoded.user._id)}, (err, jUser)=>{
        idsForSearching = [];

        jUser.friends.forEach((friend) => {
            idsForSearching.push(ObjectId(friend._id))
        });
        
        idsForSearching.push(ObjectId(req.decoded.user._id))
        
        posts.find({ user_id: { "$in" : idsForSearching}}).toArray((err, jPost)=>{
            if(err){console.log('Could not query database.'); return}
            res.status(200).send(jPost)
        })
    })
})

router.get('/user/:id', async (req, res) => {
    const posts = await loadCollection.load('posts');
        posts.find({"user_id": ObjectId(req.params.id)}).toArray((err, jPost)=>{
            if(err){console.log('Could not query database.'); return}
            res.status(200).send(jPost)
        })
})

router.post('/', async (req, res) => {
    const form = formidable({ multiples: true });
    const posts = await loadCollection.load('posts');
    const users = await loadCollection.load('users');
        try {
            form.parse(req, (err, fields, files)=>{
                if (fields.newPost || files.newImage) {
                    users.findOne({"_id": ObjectId(req.decoded.user._id)}, (err, jUser)=>{
                        if(err){console.log('Not logged in' + err); return}

                        if(fields.newPost && files.newImage){

                            let post = fields.newPost
                            let image = files.newImage.path

                            detect.fromFile(files.newImage.path, (err, result) => {
                                const pictureName = uuidv1()+"."+result.ext
                                const allowedImageTypes = ["jpg", "jpeg", "png", "gif"]
                                if(!allowedImageTypes.includes(result.ext)) {
                                    return res.send("File type not supported")
                                }
                                const oldPath = files.newImage.path
                                const newPath = path.join(__dirname + '..','..','..','..','client','static', pictureName)
                                fs.rename(oldPath, newPath, err =>{
                                    if(err){console.log('cannot move file' + err); return}
                                })

                                posts.insertOne({"user_id":ObjectId(req.decoded.user._id), "body":post, "image":pictureName, "name": jUser.name, "profileImage": jUser.profileImage, "likes":[]}, (err, jMongoResponse)=>{
                                    if(err){console.log('Could not query database.' + err); return}
                                    res.status(200).send(jMongoResponse.ops[0])
                                })
                            })
                        } else {

                            if(fields.newPost){
                                let post = fields.newPost
                                posts.insertOne({"user_id":ObjectId(req.decoded.user._id), "body":post, "name": jUser.name, "profileImage": jUser.profileImage, "likes": []}, (err, jMongoResponse)=>{
                                    if(err){console.log('Could not query database.' + err); return}
                                    res.status(200).send(jMongoResponse.ops[0])
                                })
                            }
    
                            if(files.newImage){
                                let image = files.newImage.path

                                detect.fromFile(files.newImage.path, (err, result) => {
                                    const pictureName = uuidv1()+"."+result.ext
                                    const allowedImageTypes = ["jpg", "jpeg", "png", "gif"]
                                    if(!allowedImageTypes.includes(result.ext)) {
                                        return res.send("File type not supported")
                                    }
                                    const oldPath = files.newImage.path
                                    const newPath = path.join(__dirname + '..','..','..','..','client','static', pictureName)
                                    fs.rename(oldPath, newPath, err =>{
                                        if(err){console.log('cannot move file' + err); return}
                                    })

                                    posts.insertOne({"user_id":ObjectId(req.decoded.user._id), "image":pictureName, "name": jUser.name, "profileImage": jUser.profileImage, "likes":[]}, (err, jMongoResponse)=>{
                                        if(err){console.log('Could not query database.' + err); return}
                                        res.status(200).send(jMongoResponse.ops[0])
                                    })
                                })
                            }
                        }
                    })
                }
            })
        }catch(err){
            console.log('error')
        }
    })

router.delete('/:id', async (req, res) => {
    const posts = await loadCollection.load('posts');

    posts.deleteOne({"_id":ObjectId(req.params.id), "user_id":ObjectId(req.decoded.user._id)}, (err, jMongoResponse)=>{
        if(err){console.log('You are not logged in, or post does not exist.' + err); return}
        res.status(200).send('Post deleted.')
    })
})

router.put('/:id', async (req, res) => {
    const form = formidable({ multiples: true });
    const posts = await loadCollection.load('posts');

     try {
            form.parse(req, (err, fields, files)=>{
                if (fields.changedBody || files.changedImage) {
                    if(err){console.log('Not logged in' + err); return}

                    if(fields.changedBody && files.changedImage){

                        let post = fields.changedBody
                        let image = files.changedImage.path

                        detect.fromFile(image, (err, result) => {
                            const pictureName = uuidv1()+"."+result.ext
                            const allowedImageTypes = ["jpg", "jpeg", "png", "gif"]
                            if(!allowedImageTypes.includes(result.ext)) {
                                return res.send("File type not supported")
                            }
                            const oldPath = image
                            const newPath = path.join(__dirname + '..','..','..','..','client','static', pictureName)
                            fs.rename(oldPath, newPath, err =>{
                                if(err){console.log('cannot move file' + err); return}
                            })

                            posts.updateOne({"_id":ObjectId(req.params.id), "user_id":ObjectId(req.decoded.user._id)}, { $set: {"body": post, "image": pictureName}}), (err, jMongoResponse)=>{
                                if(err){console.log('Could not query database.' + err); return}
                                console.log(jMongoResponse)

                                res.status(200).send(jMongoResponse)
                            }
                        })
                    } else {

                        if(fields.changedBody){
                            let post = fields.changedBody
                            posts.updateOne({"_id":ObjectId(req.params.id), "user_id":ObjectId(req.decoded.user._id)}, { $set: {"body": post}}), (err, jMongoResponse)=>{
                                if(err){console.log('Could not query database.' + err); return}
                                console.log(jMongoResponse)
                                res.status(200).send(jMongoResponse)
                            }
                        }

                        if(files.changedImage){
                            let image = files.changedImage.path

                            detect.fromFile(image, (err, result) => {
                                const pictureName = uuidv1()+"."+result.ext
                                const allowedImageTypes = ["jpg", "jpeg", "png", "gif"]
                                if(!allowedImageTypes.includes(result.ext)) {
                                    return res.send("File type not supported")
                                }
                                const oldPath = image
                                const newPath = path.join(__dirname + '..','..','..','..','client','static', pictureName)
                                fs.rename(oldPath, newPath, err =>{
                                    if(err){console.log('cannot move file' + err); return}
                                })

                                posts.updateOne({"_id":ObjectId(req.params.id), "user_id":ObjectId(req.decoded.user._id)}, { $set: {"image": pictureName}}), (err, jMongoResponse)=>{
                                    if(err){console.log('Could not query database.' + err); return}
                                    console.log(jMongoResponse)
                                    console.log('wahey');

                                    res.status(200).send('jMongoResponse')
                                }
                            })
                        }
                    }
                }
            })
        }catch(err){
            console.log(err)
        }
})

router.put('/:id/like', async (req, res) => {
    const posts = await loadCollection.load('posts');

    posts.findOne({"_id": ObjectId(req.params.id)}, {projection: {likes: true }}, (err, jPostLikes)=>{
        if(err){console.log('Not logged in' + err); return}
        if(jPostLikes.likes.includes(req.decoded.user._id)){
            res.status(200).send('You have already liked this post.')
        } else {
            posts.updateOne({"_id":ObjectId(req.params.id)}, { $push: {"likes": req.decoded.user._id}}, (err, jMongoResponse)=>{
                if(err){console.log('Could not query database.' + err); return}
                res.status(200).send(jMongoResponse)
            })
        }
    })
})

router.delete('/:id/like', async (req, res) => {
    const posts = await loadCollection.load('posts');
    posts.updateOne( {'_id':ObjectId(req.params.id)}, { $pull: {"likes": req.decoded.user._id}}, (err, jMongoResponse)=>{
        if(err){console.log('Could not query database.' + err); return}
        res.status(200).send(jMongoResponse)
    })

})

module.exports = router;