const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user');

exports.createUser = (req, res, next) => {
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
};

exports.loginUser = (req, res, next) => {
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
            process.env.JWT_SECRET_KEY,
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
}