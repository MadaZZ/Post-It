const express = require('express');
const router = express.Router();

const postsController = require('../controllers/postsController');
const extractFile = require('../middleware/file');
const authCheck = require('../middleware/auth-check');

router.get("", postsController.getPosts);

router.get("/:id" , postsController.getPostById);

router.post("", authCheck, extractFile, postsController.createPost);

router.put("/:id", authCheck, extractFile, postsController.editPost);

router.delete("/:id", authCheck, postsController.deletePost);

module.exports = router;
