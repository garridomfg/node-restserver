const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    email: {
        type: String,
        required: [true, 'Email required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password required'],
    },
    name: {
        type: String,
        required: [true, 'Name required'],
    },
    role: {
        type: String,
        required: [true, 'Role required'],
        enum: ['PROFESSIONAL_ROLE', 'PATIENT_ROLE'],
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
    date: {
        type: String,
        required: true,
    },
    description: {
        type: [String],
    },
    phone: {
        type: String,
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    },
    professional: {
        type: Schema.Types.ObjectId,
        ref: 'Professional'
    }
})

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);