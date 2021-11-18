const { response, request } = require('express');
const Professional = require('../models/professional');

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
    updateProfessional,
    newProfessional,
    deleteProfessional,
}