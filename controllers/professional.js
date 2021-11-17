const { response, request } = require('express');
const Professional = require('../models/professional');

const getProfessionals = async (req = request, res = response) => {
    const { limit = '' } = req.query;
    const query = [];

    // Add query param to an array which is used later in the find method
    if (limit) query.push({ limit: { '$regex': limit, '$option': 'i' } });

    // Check if there is some query param
    const statement = (query.length === 0) ? { state: true } : { $and: query };

    // Get the professional which states are true or active, and return them sorted alphabetically by name
    // also take a limit as parameter to define the number of professional getted
    const [total, professionals] = await Promise.all([
        Professional.countDocuments({ state: true }),
        Professional.find(statement, null, { sort: { name: 1} })
        .limit(Number(limit))
        .populate('patient')
    ]);

    res.json({
        total,
        professionals
    });
}

const updateProfessional = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, ...rest } = req.body;

    const professional = await Professional.findByIdAndUpdate(id, rest);

    res.json({
        professional
    });
}

const newProfessional = async (req = request, res = response) => {
    const body = req.body;
    const professional = new Professional(body);
    
    // Save in dB
    await professional.save();

    res.json({
        professional
    });
}

const deleteProfessional = async (req = request, res = response) => {
    const { id } = req.params;

    // The professional are not deleted from de dB, otherwise the state is turned to false
    const professional = await Professional.findByIdAndUpdate(id, { state: false });

    res.json({
        professional,
    });
}



module.exports = {
    getProfessionals,
    updateProfessional,
    newProfessional,
    deleteProfessional,
}