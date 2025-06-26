const router = require('express').Router();
const tpsController = require('../controllers/tps.controller');
const verifyToken = require('../middlewares/verifiyToken');

router.route('/tps')
    .get(tpsController.findAll);

router.route('/tps')
    .post(verifyToken, tpsController.create);

router.route('/tps/:id')
    .get(verifyToken, tpsController.findOne);

router.route('/tps/:id')
    .put(verifyToken, tpsController.update);

router.route('/tps/:id')
    .delete(verifyToken, tpsController.delete);

module.exports = router;