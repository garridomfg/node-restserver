const { Router } = require('express');
const { check } = require('express-validator');

const { isValidRole,
    emailExists,
    userExistsById 
} = require('../helpers/db-validators');

const { validateInputs,
    validateJWT,
    isProfessionalRole,
} = require('../middlewares');

const { getUsers,
        getUsersByRole,
        newPatientUser,
        newProfessionalUser,
        updateUser,
        deleteUser 
    } = require('../controllers/user');
const router = Router();

// GET all patients users
router.get('/', getUsers);

// GET patients by role
router.get('/:role', [
    check('role').custom(isValidRole),
    validateInputs
], getUsersByRole);

// UPDATE a user
router.put('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    validateInputs
], updateUser);

// POST patient user to dB
router.post('/new-patient-user', [
    check('email', 'Invalid email').isEmail(),
    check('email').custom(emailExists),
    check('password', 'Password required').not().isEmpty(),
    check('password', 'Password must have at least 8 letters').isLength({ min: 8 }),
    check('role', 'Role required').not().isEmpty(),
    check('role').custom(isValidRole),
    check('name', 'Name required').not().isEmpty(),
    validateInputs,
], newPatientUser);

// POST professional user to DB
router.post('/new-professional-user', [
    check('email', 'Invalid email').isEmail(),
    check('email').custom(emailExists),
    check('password', 'Password required').not().isEmpty(),
    check('password', 'Password must have at least 8 letters').isLength({ min: 8 }),
    check('role', 'Role required').not().isEmpty(),
    check('role').custom(isValidRole),
    check('date', 'Date required').not().isEmpty(),
    check('name', 'Name required').not().isEmpty(),
    validateInputs,
], newProfessionalUser);

// DELETE a user from dB, for real do not delete a patient, just change de state to false
router.delete('/:id', [
    validateJWT,
    isProfessionalRole,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(userExistsById),
    validateInputs
], deleteUser);

module.exports = router;