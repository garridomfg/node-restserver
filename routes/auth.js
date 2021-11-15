const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validateInputs } = require('../middlewares/validate-inputs');
const router = Router();

router.post('/login', [
    check('email', 'Email required').isEmail(),
    check('password', 'Password required').not().isEmpty(),
    validateInputs,
], login);

module.exports = router;