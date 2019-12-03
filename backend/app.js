const express = require('express');
const bodyParser = require('body-parser');

const PostModel = require('./models/post');

const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://max:4iFFoB292kwe94h6@cluster0-9wlmc.mongodb.net/test?retryWrites=true&w=majority")
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
    console.log(post);
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
    const posts = [
        { id:"fasdjbklsd123asd", title: "Server side post1", content: "This is the first server side post1" },
        { id:"asddjbklsd123asd", title: "Server side post2", content: "This is the first server side post2" }
    ];
    res.status(200).json({
        message: 'fetch successful',
        posts: posts
    });
});

module.exports = app;