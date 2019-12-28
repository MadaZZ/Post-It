const PostModel = require('../models/post');

exports.getPosts = (req, res, next) => {
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
};

exports.getPostById = (req, res, next) => {
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
};

exports.createPost = (req, res, next) => {
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
};

exports.editPost = (req, res, next) => {
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
        if(result.n){
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
};

exports.deletePost = (req, res, next) => {
    const idToDelete = req.params.id;
    PostModel.deleteOne({_id: idToDelete, creator: req.userData.userID})
    .then(result => {
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
};

function getPathForImageStorage(req){
    let imagePath;
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + "/imageUploads/" + req.file.filename;
    return imagePath;
}