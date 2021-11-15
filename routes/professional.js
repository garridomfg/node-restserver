const { Router } = require('express');
const { check } = require('express-validator');

const { isValidRole,
    professionalExistsById, 
    professionalEmailExists
} = require('../helpers/db-validators');

const { validateInputs,
    isAdminRole,
    validateJWT,
} = require('../middlewares');

const { professionalsGet, 
        professionalPut,
        professionalPost,
        professionalDelete 
    } = require('../controllers/professional');
const router = Router();

// GET all professionals
router.get('/', professionalsGet);

// UPDATE a professional
router.put('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(professionalExistsById),
    check('role').custom(isValidRole),
    validateInputs
], professionalPut);

// POST professional to dB
router.post('/', [
    check('email', 'Invalid email').isEmail(),
    check('email').custom(professionalEmailExists),
    check('password', 'Password required').not().isEmpty(),
    check('password', 'Password must have at least 8 letters').isLength({ min: 8 }),
    check('role', 'Role required').not().isEmpty(),
    check('role').custom(isValidRole),
    check('address', 'Address required').not().isEmpty(),
    check('birthdate', 'Birthdate required').not().isEmpty(),
    check('date', 'Date required').not().isEmpty(),
    check('name', 'Name required').not().isEmpty(),
    check('specialty', 'Specialty required').not().isEmpty(),
    check('phone', 'Phone required').not().isEmpty(),
    validateInputs,
], professionalPost);

// DELETE a professional from dB, for real do not delete a professional, just change de state to false
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(professionalExistsById),
    validateInputs
], professionalDelete);

module.exports = router;