const express = require('express');
const app = express();
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