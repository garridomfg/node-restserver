const { Schema, model } = require('mongoose');

const PatientSchema = Schema({
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password required'],
    },
    role: {
        type: String,
        required: [true, 'Role required'],
        default: 'PATIENT_ROLE',
        enum: ['ADMIN_ROLE', 'PATIENT_ROLE'],
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    birthdate: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
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
    name: {
        type: String,
        required: [true, 'Name required'],
    },
    phone: {
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
})

PatientSchema.methods.toJSON = function () {
    const { __v, password, _id, ...patient } = this.toObject();
    patient.uid = _id;
    return patient;
}

module.exports = model('Patient', PatientSchema);