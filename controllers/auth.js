const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");
const User = require("../models/user");
const jwt = require('jsonwebtoken');

const login = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {

        // Check if email exists
        let user = await User.findOne({ email });

        if (!user) return res.status(400).json({
            msg: 'Invalid credentials',
        });

        // Check if user state is active
        if (!user.state) return res.status(400).json({
            msg: 'User is no longer active',
        });

        // Check password
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) return res.status(400).json({
            msg: 'Invalid credentials',
        });

        // Generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Something went wrong'
        })
    }
};

const googleSignIn = async (req = request, res = response, next) => {
    const { id_token } = req.body;

    try {
        const { email, name, avatar } = await googleVerify(id_token);

        let user = await User.findOne({ email });
        
        // Create user if doesn´t exists
        const date = new Date();
        if (!user) {
            const data = {
                email,
                password: 'XD',
                name,
                role: 'PATIENT_ROLE',
                state: true,
                google: true,
                avatar,
                date,
                phone: 'Complete',
            };
            user = new User(data);
            await user.save();
        };

        // If user state === false, reject login
        if (!user.state) return res.status(401).json({
            msg: 'User blocked, contact us',
        });

        // Generate JWT
        const token = await generateJWT(user.id);
    
        res.json({
            user,
            token
        });
    } catch (error) {
       console.log(error);
       res.status(400).status({
           msg: 'Invalid Google token',
       })
    }
}

const lookup = async (req = request, res = response, next) => {
    const { token } = req.body;

    try {
        const { uid } = jwt.verify(token, process.env.PRIVATEKEY);
        
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

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Invalid token',
        })
    }
}

module.exports = {
    login,
    googleSignIn,
    lookup,
}