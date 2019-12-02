const express = require('express');
const app = express();
app.use((req, res, next) => {
    console.log('HIT');
    next();
});
app.use((req, res, next) => {
    res.send('You will get data from here');
});

module.exports = app;