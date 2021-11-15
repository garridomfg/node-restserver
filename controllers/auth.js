const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Patient = require('../models/patient');
const Professional = require('../models/professional');
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {

        // Check if email exists
        let user = await Promise.all([
            Patient.findOne({ email }),
            Professional.findOne({ email }),
        ]);

        if (user[0] === null) {
            user = user[1];
        } else {
            user = user[0];
        }

        if (!user) return res.status(400).json({
            msg: 'Invalid credentials',
        });

        // Check if user state is active
        if (!user.state) return res.status(400).json({
            msg: 'Patient is no longer active',
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

        let patient = await Patient.findOne({ email });
        
        // Create user if doesn´t exists
        const date = new Date();
        if (!patient) {
            const data = {
                name,
                email,
                password: 'XD',
                avatar,
                google: true,
                address: 'Complete',
                birthdate: '15/11/2021',
                date,
                dateOfAdmission: '15/11/2021',
                diagnosis: 'Complete',
                healthInsurance: 'Complete',
                phone: 'Complete',
            };
            patient = new Patient(data);
            await patient.save();
        };

        // If user state === false, reject login
        if (!patient.state) return res.status(401).json({
            msg: 'User blocked, contact us',
        });

        // Generate JWT
        const token = await generateJWT(patient.id);
    
        res.json({
            patient,
            token
        });
    } catch (error) {
       console.log(error);
       res.status(400).status({
           msg: 'Invalid Google token',
       })
    }
}

module.exports = {
    login,
    googleSignIn
}