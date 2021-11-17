const { Schema, model } = require('mongoose');

const ProfessionalSchema = Schema({
    specialty: {
        type: String,
        required: true,
    },
    patient: [{
        name: String,
        diagnosis: String,
    }],
})

ProfessionalSchema.methods.toJSON = function () {
    const { __v, ...professional } = this.toObject();
    return professional;
}

module.exports = model('Professional', ProfessionalSchema);