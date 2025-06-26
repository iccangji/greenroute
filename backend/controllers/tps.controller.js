const Tps = require('../models/tps.model');

// Create Tps
exports.create = async (req, res) => {
    try {
        const tps = await Tps.create(req.body);
        res.status(201).json(tps);
    } catch (err) {
        res.status(500).json({ error: err.name });
    }
};

// Get all Tps
exports.findAll = async (req, res) => {
    try {
        const data = await Tps.findAll({
            order: [['updatedAt', 'DESC']],
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.name });
    }
};

// Get one Tps
exports.findOne = async (req, res) => {
    try {
        const tps = await Tps.findByPk(req.params.id);
        if (!tps) return res.status(404).json({ error: 'Tps not found' });
        res.json(tps);
    } catch (err) {
        res.status(500).json({ error: err.name });
    }
};

// Update Tps
exports.update = async (req, res) => {
    try {
        const [updated] = await Tps.update(req.body, { where: { id: req.params.id } });
        if (!updated) return res.status(404).json({ error: 'Tps not found' });
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.name });
    }
};

// Delete Tps
exports.delete = async (req, res) => {
    try {
        const deleted = await Tps.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ error: 'Tps not found' });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.name });
    }
};
