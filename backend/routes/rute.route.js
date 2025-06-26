const router = require('express').Router();
const ruteController = require('../controllers/rute.controller');
const verifyToken = require('../middlewares/verifiyToken');

router.route('/rute')
    .get(ruteController.findAll);

router.route('/rute/optimize')
    .post(verifyToken, ruteController.optimize);

router.route('/rute/save')
    .post(verifyToken, ruteController.save);

router.route('/rute/:id')
    .put(verifyToken, ruteController.findOne);

module.exports = router;