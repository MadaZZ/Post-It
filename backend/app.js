const express = require('express');
const bodyParser = require('body-parser');

const PostModel = require('./models/post');

const mongoose = require('mongoose');

const app = express();
const baseAddress = '/api/posts';

mongoose.connect("mongodb+srv://max:4iFFoB292kwe94h6@cluster0-9wlmc.mongodb.net/Post-it?retryWrites=true&w=majority")
.then(() => {
    console.log('connected to DB')
})
.catch(() => {
    console.log('Connection Failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, XMLHttpRequest");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.get(baseAddress , (req, res, next) => {
    PostModel.find()
    .then((documents) => {
        // console.log(documents);
        res.status(200).json({
            message: 'fetch successful',
            posts: documents
        });
    });
});

app.get(baseAddress+"/:id" , (req, res, next) => {
    PostModel.findById(req.params.id).then((result) => {
        res.status(200).json({
            message: 'Post fetch Successful',
            postFound: result 
        });
    });
});

app.post(baseAddress, (req, res, next) => {
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

app.put(baseAddress+"/:id", (req, res, next) =>{
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

app.delete(baseAddress+"/:id", (req, res, next) => {
    const idToDelete = req.params.id;
    PostModel.deleteOne({_id: idToDelete})
    .then(result => {
        // console.log("DELETE = "+JSON.stringify(result));
    });
    res.status(200).json({
        message: 'Post Deleted',
    });  
});

module.exports = app;