const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/generate-jwt");
const Patient = require('../models/patient');

const login = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {

        // Check if email exists
        const patient = await Patient.findOne({ email });
        if (!patient) return res.status(400).json({
            msg: 'Invalid credentials',
        });

        // Check if user state is active
        if (!patient.state) return res.status(400).json({
            msg: 'Patient is no longer active',
        });

        // Check password
        const validPassword = bcryptjs.compareSync(password, patient.password);
        if (!validPassword) return res.status(400).json({
            msg: 'Invalid credentials',
        });

        // Generate JWT
        const token = await generateJWT(patient.id);

        res.json({
            patient,
            token
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Something went wrong'
        })
    }
};

module.exports = {
    login
}