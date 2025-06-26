const Rute = require('../models/rute.model');
const Tps = require('../models/tps.model');
const Tpa = require('../models/tpa.model');
const { optimizeRoute } = require('../utils/route_optimize/optimize');

// Create Tps
// exports.create = async (req, res) => {
//     try {
//         const tps = await Tps.create(req.body);
//         res.status(201).json(tps);
//     } catch (err) {
//         res.status(500).json({ error: err.name });
//     }
// };

// Get all rutes
exports.findAll = async (req, res) => {
    try {
        const data = await Rute.findAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.name });
    }
};

// Get one rutes
exports.findOne = async (req, res) => {
    try {
        const tps = await Rute.findByPk(req.params.id);
        if (!tps) return res.status(404).json({ error: 'Rute not found' });
        res.json(tps);
    } catch (err) {
        res.status(500).json({ error: err.name });
    }
};

exports.optimize = async (req, res) => {
    try {
        const dataTps = await Tps.findAll();
        const dataTpa = await Tpa.findByPk(1);
        const result = optimizeRoute(dataTps, dataTpa, req.body, true);
        res.json({
            message: 'Optimization successful',
            data: result,

        });
    } catch (err) {
        res.status(500).json({ error: err.name });
    }
};

exports.save = async (req, res) => {
    const routes = req.body; // array of route objects
    try {
        await Rute.destroy({ where: {}, truncate: true });
        for (const route of routes.route) {

            await Rute.create({
                armada: route.armada,
                rute_tps: route.names.join(';'),
                rute_koordinat: route.loc.join(';'),
                jarak_tempuh: route.distance,
                muatan: route.load
            });
        }
        res.status(201).json({ message: 'Routes saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.name });
    }
};

// Update Tps
// exports.update = async (req, res) => {
//     try {
//         const [updated] = await Tps.update(req.body, { where: { id: req.params.id } });
//         if (!updated) return res.status(404).json({ error: 'Tps not found' });
//         res.json({ message: 'Updated successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.name });
//     }
// };

// Delete Tps
// exports.delete = async (req, res) => {
//     try {
//         const deleted = await Tps.destroy({ where: { id: req.params.id } });
//         if (!deleted) return res.status(404).json({ error: 'Tps not found' });
//         res.json({ message: 'Deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.name });
//     }
// };
