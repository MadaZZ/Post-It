const express = require('express');
const multer = require('multer');
const router = express.Router();

const PostModel = require('../models/post');

MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
};

const storageConfig = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid){
            error = null;
        }
        cb(error, 'backend/imageUploads')
    },
    filename: function (req, file, cb) {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
})

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

router.post("", multer({storage: storageConfig}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/image/" + req.file.filename,
    });
    post.save().then((result) =>{
        res.status(201).json({
            message: 'Post Successful',
            postedResult: {
                ...result,
                id: result._id
            }
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
