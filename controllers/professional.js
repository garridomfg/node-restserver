const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Professional = require('../models/professional');

const professionalsGet = async (req = request, res = response) => {
    const { limit = '' } = req.query;
    const query = [];

    // Add query param to an array which is used later in the find method
    if (limit) query.push({ limit: { '$regex': limit, '$option': 'i' } });

    // Check if there is some query param
    const statement = (query.length === 0) ? { state: true } : { $and: query };

    // Get the professional which states are true or active, and return them sorted alphabetically by name
    // also take a limit as parameter to define the number of patient getted
    const [total, professional] = await Promise.all([
        Professional.countDocuments({ state: true }),
        Professional.find(statement, null, { sort: { name: 1} })
        .limit(Number(limit))
    ]);

    res.json({
        total,
        professional
    });
}

const professionalPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, ...rest } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const professional = await Professional.findByIdAndUpdate(id, rest);

    res.json({
        professional
    });
}

const professionalPost = async (req = request, res = response) => {
    const body = req.body;
    const professional = new Professional(body);
    
    // Encrypt password
    const salt = bcryptjs.genSaltSync();
    professional.password = bcryptjs.hashSync(professional.password, salt);
    
    // Save in dB
    await professional.save();

    res.json({
        professional
    });
}

const professionalDelete = async (req = request, res = response) => {
    const { id } = req.params;

    // The professional are not deleted from de dB, otherwise the state is turned to false
    const professional = await Professional.findByIdAndUpdate(id, { state: false });
    res.json({
        professional,
    });
}



module.exports = {
    professionalsGet,
    professionalPut,
    professionalPost,
    professionalDelete,
}