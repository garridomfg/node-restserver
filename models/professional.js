const { Schema, model } = require('mongoose');

const ProfessionalSchema = Schema({
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
        default: 'ADMIN_ROLE',
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
    specialty: {
        type: String,
    },
    address: {
        type: String,
    },
    birthdate: {
        type: String,
    },
    date: {
        type: Date,
    },
    name: {
        type: String,
        required: [true, 'Name required'],
    },
    phone: {
        type: String,
        required: true,
    },
})

ProfessionalSchema.methods.toJSON = function () {
    const { __v, password, _id, ...professional } = this.toObject();
    professional.uid = _id;
    return professional;
}

module.exports = model('Professional', ProfessionalSchema);