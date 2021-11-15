const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validateInputs } = require('../middlewares/validate-inputs');
const router = Router();

router.post('/login', [
    check('email', 'Email required').isEmail(),
    check('password', 'Password required').not().isEmpty(),
    validateInputs,
], login);

router.post('/google', [
    check('id_token', 'ID_Token required').not().isEmpty(),
    validateInputs,
], googleSignIn);

module.exports = router;