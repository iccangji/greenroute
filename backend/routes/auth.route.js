const router = require('express').Router();
const { signup: signupValidator, signin: signinValidator } = require('../validators/auth');
const authController = require('../controllers/auth.controller');


router.route('/signup')
    .post(signupValidator, authController.signup);

router.route('/login')
    .post(signinValidator, authController.signin);

module.exports = router;