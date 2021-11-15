const validateInputs = require('./validate-inputs');
const validateJWT = require('./validate-jwt');
const isAdminRole = require('./validate-roles');

module.exports = {
    ...validateInputs,
    ...validateJWT,
    ...isAdminRole,
}