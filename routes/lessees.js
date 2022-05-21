const auth = require('../middleware/auth');
const {Lessee, validate} = require('../models/lessee');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const lessees = await Lessee.find().sort('name');
    res.send(lessees);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let lessee = new Lessee({
        name: req.body.name,
        leaseTerm: req.body.leaseTerm,
        numOfLeaseFlats: req.body.numOfLeaseFlats,
        phone: req.body.phone
    });
    lessee = await lessee.save();

    res.send(lessee);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const lessee = await Lessee.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            leaseTerm: req.body.leaseTerm,
            numOfLeaseFlats: req.body.numOfLeaseFlats,
            phone: req.body.phone
        }, { new: true });

    if (!lessee) return res.status(404).send('The lessee with the given ID was not found.');

    res.send(lessee);
});

router.delete('/:id', auth, async (req, res) => {
    const lessee = await Lessee.findByIdAndRemove(req.params.id)

    if (!lessee) return res.status(404).send('The lessee with the given ID was not found.');

    res.send(lessee);
});

router.get('/:id', async (req, res) => {
    const lessee = await Lessee.findById(req.params.id);

    if (!lessee) return res.status(404).send('The lessee with the given ID was not found.');

    res.send(lessee);
});

module.exports = router;