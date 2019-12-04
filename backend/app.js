const express = require('express');
const bodyParser = require('body-parser');

const PostModel = require('./models/post');

const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://max:4iFFoB292kwe94h6@cluster0-9wlmc.mongodb.net/Post-it?retryWrites=true&w=majority")
.then(() => {
    console.log('connected to DB')
})
.catch(() => {
    console.log('Connection Failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post("/api/posts", (req, res, next) => {
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content
    });
    post.save(post);
    res.status(201).json({
        message: 'Post Successful',
    });
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, XMLHttpRequest");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/api/posts" , (req, res, next) => {
    PostModel.find()
    .then((documents) => {
        console.log(documents);
        res.status(200).json({
            message: 'fetch successful',
            posts: documents
        });
    });
});

module.exports = app;