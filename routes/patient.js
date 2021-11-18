const { Router } = require('express');
const { check } = require('express-validator');

const { validateInputs, validateJWT, isAdminRole } = require('../middlewares');

const { updatePatient,
        newPatient,
        deletePatient 
    } = require('../controllers/patient');
const router = Router();

// UPDATE a patient
router.put('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    validateInputs
], updatePatient);

// POST patient to dB
router.post('/', [
    check('address', 'Address required').not().isEmpty(),
    check('birthdate', 'Birthdate required').not().isEmpty(),
    check('dateOfAdmission', 'Date of admission required').not().isEmpty(),
    check('diagnosis', 'Diagnosis required').not().isEmpty(),
    check('healthInsurance', 'Health insurance required').not().isEmpty(),
    validateInputs,
], newPatient);

// DELETE a patient from dB, for real do not delete a patient, just change de state to false
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Invalid ID').isMongoId(),
    validateInputs
], deletePatient);

module.exports = router;