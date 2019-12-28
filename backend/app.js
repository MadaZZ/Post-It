const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const postAddress = '/api/posts';
const userAddress = '/api/user';
const app = express();

mongoose.connect("mongodb+srv://max:" + process.env.MONGO_ATLAS_PW + "@cluster0-9wlmc.mongodb.net/Post-it?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })
.then(() => {
    console.log('Connected to DB')
})
.catch(() => {
    console.log('Connection Failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/imageUploads", express.static(path.join("backend/imageUploads"))); //To parse images

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, XMLHttpRequest, authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use(postAddress, postsRoutes);
app.use(userAddress, userRoutes);

module.exports = app;