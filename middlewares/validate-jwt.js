const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patient');
const Professional = require('../models/professional');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({
        msg: 'There is no token in te request',
    })

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        let user = await Promise.all([
            Patient.findById(uid),
            Professional.findById(uid),
        ]);

        if (user[0] === null) {
            user = user[1];
        } else {
            user = user[0];
        }
        console.log(user);


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