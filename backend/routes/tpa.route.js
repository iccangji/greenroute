const router = require('express').Router();
const tpaController = require('../controllers/tpa.controller');
const verifyToken = require('../middlewares/verifiyToken');

router.route('/tpa')
    .get(tpaController.findAll);;

router.route('/tpa/:id')
    .put(verifyToken, tpaController.update);

module.exports = router;