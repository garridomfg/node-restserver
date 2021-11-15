const Role = require('../models/role');
const Patient = require('../models/patient');
const Professional = require('../models/professional');

// Custom validations

// Validate if is a valid role
const isValidRole = async (role = '') => {
    const rolExists = await Role.findOne({ role });
    if (!rolExists) {
        throw new Error(`Rol: ${role} doesn´t exist in dB`);
    }
}

// Validate if email exists
const emailExists = async( email = '') => {
    const emailExists = await Patient.findOne({ email });
    if (emailExists) {
        throw new Error('The email already exists');
    }
}

// Validate if Id exists
const patientExistsById = async( id = '') => {
    const patientExists = await Patient.findById(id);
    if (!patientExists) {
        throw new Error('The ID doesn´t exists');
    }
}

const professionalExistsById = async( id = '') => {
    const professionalExists = await Professional.findById(id);
    if (!professionalExists) {
        throw new Error('The ID doesn´t exists');
    }
}

// Validate if email exists
const professionalEmailExists = async( email = '') => {
    const emailExists = await professional.findOne({ email });
    if (emailExists) {
        throw new Error('The email already exists');
    }
}

module.exports = {
    isValidRole,
    emailExists,
    patientExistsById,
    professionalExistsById,
    professionalEmailExists
}