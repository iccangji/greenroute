const Tpa = require('../models/tpa.model');

exports.findAll = async (req, res) => {
    try {
        const data = await Tpa.findAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.name });
    }
};

exports.update = async (req, res) => {
    try {
        const [updated] = await Tpa.update(req.body, { where: { id: req.params.id } });
        if (!updated) return res.status(404).json({ error: 'Tpa not found' });
        res.json({ message: 'Updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.name });
    }
};