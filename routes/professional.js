const { Router } = require('express');
const { check } = require('express-validator');

const { validateInputs, validateJWT, isProfessionalRole } = require('../middlewares');

const { updateProfessional,
        newProfessional,
        deleteProfessional 
    } = require('../controllers/professional');
const router = Router();

// UPDATE a professional
router.put('/:id', [
    check('id', 'Invalid ID').isMongoId(),
    validateInputs
], updateProfessional);

// POST professional to dB
router.post('/', [
    check('specialty', 'Specialty required').not().isEmpty(),
    validateInputs,
], newProfessional);

// DELETE a professional from dB, for real do not delete a professional, just change de state to false
router.delete('/:id', [
    validateJWT,
    isProfessionalRole,
    check('id', 'Invalid ID').isMongoId(),
    validateInputs
], deleteProfessional);

module.exports = router;