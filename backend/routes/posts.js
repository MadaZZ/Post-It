const express = require('express');
const multer = require('multer');
const router = express.Router();

const authCheck = require('../middleware/auth-check');

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
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = PostModel.find();

    let fetchedPostes;

    if (pageSize && currentPage) {
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize)
    }
    postQuery
    .then((documents) => {
        fetchedPostes = documents;
        return PostModel.countDocuments();
    }).then( count => {
        res.status(200).json({
            message: 'fetch successful.',
            posts: fetchedPostes,
            maxPosts: count
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Failed to fetch posts.'
        });
    });
});

router.get("/:id" , (req, res, next) => {
    PostModel.findById(req.params.id).then((result) => {
        if(result){
            res.status(200).json({
                message: 'Post fetch Successful.',
                postFound: result 
            });   
        } else {
            res.status(404).json({
                message: 'Post not found.',
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Failed to fetch post.'
        });
    });
});

router.post("", authCheck, multer({storage: storageConfig}).single("image"), (req, res, next) => {
    const path = getPathForImageStorage(req);
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        imagePath: path,
        creator: req.userData.userID
    });
    post.save().then((result) =>{
        res.status(201).json({
            message: 'Post created Successfully.',
            postedResult: {
                ...result,
                id: result._id
            }
        });
    }).catch(err => {
        res.status(500).json({
            message: 'Failed to create post.'
        });
    });
});

router.put("/:id", authCheck, multer({storage: storageConfig}).single("image"), (req, res, next) => {
    let imagePathFromRequest = req.body.imagePath;
    if(req.file){
        imagePathFromRequest = getPathForImageStorage(req);
    }
    const post = new PostModel({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePathFromRequest
    })
    PostModel.updateOne({_id: req.params.id, creator: req.userData.userID}, post).then((result) => {
        if(result.nModified){
            res.status(201).json({
                message: 'Update Successful.',
            });
        } else {
            res.status(401).json({
                message: 'Unauthorized to Edit.',
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Failed to update post.'
        });
    });;
});

router.delete("/:id", authCheck, (req, res, next) => {
    const idToDelete = req.params.id;
    PostModel.deleteOne({_id: idToDelete, creator: req.userData.userID})
    .then(result => {
        console.log(result);
        if(result.deletedCount > 0){
            res.status(200).json({
                message: 'Post Deleted.',
            });
        } else {
            res.status(401).json({
                message: 'Unauthorized to Delete.',
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Failed to delete post.'
        });
    });
});

function getPathForImageStorage(req){
    let imagePath;
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + "/imageUploads/" + req.file.filename;
    return imagePath;
}

module.exports = router;
