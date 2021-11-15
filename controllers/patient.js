const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Patient = require('../models/patient');

const patientsGet = async (req = request, res = response) => {
    const { limit = '' } = req.query;
    const query = [];

    // Add query param to an array which is used later in the find method
    if (limit) query.push({ limit: { '$regex': limit, '$option': 'i' } });

    // Check if there is some query param
    const statement = (query.length === 0) ? { state: true } : { $and: query };

    // Get the patient which states are true or active, and return them sorted alphabetically by name
    // also take a limit as parameter to define the number of patient getted
    const [total, patients] = await Promise.all([
        Patient.countDocuments({ state: true }),
        Patient.find(statement, null, { sort: { name: 1} })
        .limit(Number(limit))
    ]);

    res.json({
        total,
        patients
    });
}

const patientsPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...rest } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const patient = await Patient.findByIdAndUpdate(id, rest);

    res.json({
        patient
    });
}

const patientsPost = async (req = request, res = response) => {
    const body = req.body;
    const patient = new Patient(body);
    
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    patient.password = bcryptjs.hashSync(patient.password, salt);
    
    // Save in dB
    await patient.save();

    res.json({
        patient
    });
}

const patientsDelete = async (req = request, res = response) => {
    const { id } = req.params;

    // The patient are not deleted from de dB, otherwise the state is turned to false
    const patient = await Patient.findByIdAndUpdate(id, { state: false });

    res.json({
        patient,
    });
}



module.exports = {
    patientsGet,
    patientsPut,
    patientsPost,
    patientsDelete,
}