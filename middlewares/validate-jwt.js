const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({
        msg: 'There is no token in te request',
    })

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({
                msg: 'Invalid token',
            })
        }

        // Verify if uid has state = true
        if (!user.state) {
            return res.status(401).json({
                msg: 'Invalid token',
            })
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token',
        })
    }
}



module.exports = {
    validateJWT,
}