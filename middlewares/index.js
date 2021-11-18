const validateInputs = require('./validate-inputs');
const validateJWT = require('./validate-jwt');
const isProfessionalRole = require('./validate-roles');

module.exports = {
    ...validateInputs,
    ...validateJWT,
    ...isProfessionalRole,
}