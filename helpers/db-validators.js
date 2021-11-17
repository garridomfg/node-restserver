const Role = require('../models/role');
const User = require('../models/user');

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
    const emailExists = await User.findOne({ email });
    if (emailExists) {
        throw new Error('The email already exists');
    }
}

// Validate if Id exists
const userExistsById = async( id = '') => {
    const userExists = await User.findById(id);
    if (!userExists) {
        throw new Error('The ID doesn´t exists');
    }
}

module.exports = {
    isValidRole,
    emailExists,
    userExistsById,
}