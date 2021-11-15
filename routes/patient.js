const { Router } = require('express');
const { check } = require('express-validator');

const { isValidRole,
    emailExists,
    patientExistsById 
} = require('../helpers/db-validators');

const { validateInputs,
    validateJWT,
    isAdminRole,
} = require('../middlewares');

const { patientsGet, 
        patientsPut,
        patientsPost,
        patientsDelete 
    } = require('../controllers/patient');
const router = Router();

// GET all patients
router.get('/', patientsGet);

// UPDATE a patient
router.put('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(patientExistsById),
    check('role').custom(isValidRole),
    validateInputs
], patientsPut);

// POST patient to dB
router.post('/', [
    check('email', 'Invalid email').isEmail(),
    check('email').custom(emailExists),
    check('password', 'Password required').not().isEmpty(),
    check('password', 'Password must have at least 8 letters').isLength({ min: 8 }),
    check('role', 'Role required').not().isEmpty(),
    check('role').custom(isValidRole),
    check('address', 'Address required').not().isEmpty(),
    check('birthdate', 'Birthdate required').not().isEmpty(),
    check('date', 'Date required').not().isEmpty(),
    check('dateOfAdmission', 'Date of admission required').not().isEmpty(),
    check('diagnosis', 'Diagnosis required').not().isEmpty(),
    check('healthInsurance', 'Health insurance required').not().isEmpty(),
    check('name', 'Name required').not().isEmpty(),
    check('phone', 'Phone required').not().isEmpty(),
    validateInputs,
], patientsPost);

// DELETE a patient from dB, for real do not delete a patient, just change de state to false
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(patientExistsById),
    validateInputs
], patientsDelete);

module.exports = router;