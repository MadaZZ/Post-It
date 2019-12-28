const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user');
const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then((hash) => {
        const user = new  userModel({
            email: req.body.email,
            password: hash
        });
        
        user.save()
        .then( (result) => {
            res.status(201).json({
                message: 'User Created.',
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Email already in use.'
            });
        });
    
    }).catch( err => {
        res.status(500).json({
            message: 'Unable to signup.'
        });
    });

});

router.post("/login", (req, res, next) => {
    let fetchedUser;
    userModel.findOne({ email: req.body.email })
    .then( user => {
        if(!user){
            return res.status(401).json({
                message: 'Invalid auth credentials.'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if(!result){
            return res.status(401).json({
                message: 'Auth failed.'
            });
        }

        const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            'secret_this_should_be_longer',
            { expiresIn: '1h' }
        );
        res.status(201).json({
            token: token,
            expiresIn: 3600,
            userID: fetchedUser._id
        });
    }).catch(err => {
        res.status(401).json({
            message: 'Invalid auth credentials.'
        });
    });
});

module.exports = router;