const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Serie, validate} = require('../models/serie');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const series = await Serie.find().sort('name');
    res.send(series);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let serie = new Serie({ 
        name: req.body.name,
        numberOfFlats: req.body.numberOfFlats,
        amenities: req.body.amenities,
        smartLiving: req.body.smartLiving
    });
    serie = await serie.save();

    res.send(serie);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const serie = await Serie.findByIdAndUpdate(req.params.id, 
        { 
            name: req.body.name,
            numberOfFlats: req.body.numberOfFlats,
            amenities: req.body.amenities,
            smartLiving: req.body.smartLiving
        }, { new: true });

    if (!serie) return res.status(404).send('The series with the given id was not found.');

    res.send(serie);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
    const serie = await Serie.findByIdAndRemove(req.params.id);

    if (!serie) return res.status(404).send('The series with the given id was not found.');

    res.send(serie);
});

router.get('/:id', validateObjectId, async (req, res) => {
    const serie = await Serie.findById(req.params.id);

    if (!serie) return res.status(404).send('The series with the given id was not found.');

    res.send(serie);
});

module.exports = router;