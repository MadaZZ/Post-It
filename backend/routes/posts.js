const express = require('express');

const router = express.Router();

const PostModel = require('../models/post');


router.get("", (req, res, next) => {
    PostModel.find()
    .then((documents) => {
        // console.log(documents);
        res.status(200).json({
            message: 'fetch successful',
            posts: documents
        });
    });
});

router.get("/:id" , (req, res, next) => {
    PostModel.findById(req.params.id).then((result) => {
        res.status(200).json({
            message: 'Post fetch Successful',
            postFound: result 
        });
    });
});

router.post("",(req, res, next) => {
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content
    });
    post.save(post).then((result) =>{
        res.status(201).json({
            message: 'Post Successful',
            postedResult: result
        });
    });
});

router.put("/:id", (req, res, next) =>{
    const post = new PostModel({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    })
    PostModel.updateOne({_id: req.params.id}, post).then((result) => {
        res.status(201).json({
            message: 'Update Successful',
        });
    });
});

router.delete("/:id", (req, res, next) => {
    const idToDelete = req.params.id;
    PostModel.deleteOne({_id: idToDelete})
    .then(result => {
        // console.log("DELETE = "+JSON.stringify(result));
    });
    res.status(200).json({
        message: 'Post Deleted',
    });  
});

module.exports = router;
