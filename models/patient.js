const { Schema, model } = require('mongoose');

const PatientSchema = Schema({
    address: {
        type: String,
        required: true,
    },
    birthdate: {
        type: String,
        required: true,
    },
    dateOfAdmission: {
        type: String,
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    healthInsurance: {
        type: String,
        required: true,
    },
    referringPhysician: {
        type: String
    },
    clinicalHistory: [{
        date: String,
        description: String,
    }],
    professional: [{
        name: String,
        specialty: String,
    }]
})

PatientSchema.methods.toJSON = function () {
    const { __v, ...patient } = this.toObject();
    return patient;
}

module.exports = model('Patient', PatientSchema);