const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const getUsers = async (req = request, res = response, next) => {
    const { limit = '' } = req.query;
    const query = [];

    // Add query param to an array which is used later in the find method
    if (limit) query.push({ limit: { '$regex': limit, '$option': 'i' } });

    // Check if there is some query param
    const statement = (query.length === 0) ? { state: true } : { $and: query };

    // Get the user which states are true or active, and return them sorted alphabetically by name
    // also take a limit as parameter to define the number of users getted
    const [total, users] = await Promise.all([
        User.countDocuments({ state: true }),
        User.find(statement, null, { sort: { name: 1} })
        .limit(Number(limit))
        .populate('patient')
        .populate('professional')
    ]);

    res.json({
        total,
        users
    });
}

const getUsersByRole = async (req = request, res = response) => {
    const { limit = '' } = req.query;
    const { role } = req.params;
    const query = [];

    // Add query param to an array which is used later in the find method
    if (limit) query.push({ limit: { '$regex': limit, '$option': 'i' } });

    let statement;
    if (role === 'PATIENT_ROLE') statement = (query.length === 0) ? { state: true, role: 'PATIENT_ROLE' } : { $and: query };
    if (role === 'PROFESSIONAL_ROLE') statement = (query.length === 0) ? { state: true, role: 'PROFESSIONAL_ROLE' } : { $and: query };

    // Get the user which states are true or active, and return them sorted alphabetically by name
    // also take a limit as parameter to define the number of users getted
    const [total, users] = await Promise.all([
        User.countDocuments({ state: true, role }),
        User.find(statement, null, { sort: { name: 1} })
        .limit(Number(limit))
        .populate('patient')
        .populate('professional')
    ]);

    res.json({
        total,
        users
    });
}

const updateUser = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...rest } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest);

    res.json({
        user
    });
}

const newPatientUser = async (req = request, res = response) => {
    const body = req.body;
    const user = new User(body);
    
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(user.password, salt);
    
    user.date = new Date();

    // Save in dB
    await user.save();

    res.json({
        user
    });
}

const newProfessionalUser = async (req = request, res = response) => {
    const body = req.body;
    const user = new User(body);
    
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(user.password, salt);
    
    // Save in dB
    await user.save();

    res.json({
        user
    });
}

const deleteUser = async (req = request, res = response) => {
    const { id } = req.params;

    // The user are not deleted from de dB, otherwise the state is turned to false
    const user = await User.findByIdAndUpdate(id, { state: false });

    res.json({
        user,
    });
}



module.exports = {
    getUsers,
    getUsersByRole,
    newPatientUser,
    newProfessionalUser,
    updateUser,
    deleteUser,
}