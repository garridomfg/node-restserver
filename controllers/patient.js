const { response, request } = require('express');
const Patient = require('../models/patient');

const updatePatient = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, ...rest } = req.body;

    const patient = await Patient.findByIdAndUpdate(id, rest);

    res.json({
        patient
    });
}

const newPatient = async (req = request, res = response) => {
    const body = req.body;
    const patient = new Patient(body);
    
    // Save in dB
    await patient.save();

    res.json({
        patient
    });
}

const deletePatient = async (req = request, res = response) => {
    const { id } = req.params;

    // The patient are not deleted from de dB, otherwise the state is turned to false
    const patient = await Patient.findByIdAndUpdate(id, { state: false });

    res.json({
        patient,
    });
}



module.exports = {
    updatePatient,
    newPatient,
    deletePatient,
}