const auth = require('../middleware/auth');
const {Apartment, validate} = require('../models/apartment');
const {Serie} = require('../models/serie');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const apartments = await Apartment.find().sort('name');
    res.send(apartments);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const serie = await Serie.findById(req.body.serieId);
    if (!serie) return res.status(400).send('Invalid series.');

    const apartment = new Apartment({
        name: req.body.name,
        serie: {
            _id: serie._id,
            name: serie.name
        },
        outDoorPool: req.body.outDoorPool,
        internetCafe: req.body.internetCafe,
        fitnessCenter: req.body.fitnessCenter,
        dogRun: req.body.dogRun,
        movieRoom: req.body.movieRoom,
        laundryRoom: req.body.laundryRoom,
        availableFlats: req.body.availableFlats,
        monthlyLeaseRate: req.body.monthlyLeaseRate
    });
    await apartment.save();

    res.send(apartment);
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const serie = await Serie.findById(req.params.serieId);
    if (!serie) return res.status(400).send('Invalid series.');

    const apartment = await Apartment.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            serie: {
                _id: serie._id,
                name: serie.name
            },
            outDoorPool: req.body.outDoorPool,
            internetCafe: req.body.internetCafe,
            fitnessCenter: req.body.fitnessCenter,
            dogRun: req.body.dogRun,
            movieRoom: req.body.movieRoom,
            laundryRoom: req.body.laundryRoom,
            availableFlats: req.body.availableFlats,
            monthlyLeaseRate: req.body.monthlyLeaseRate
        }, { new: true });

    if (!apartment) return res.status(404).send('The apartment with the given ID was not found');

    res.send(apartment);
});

router.delete('/:id', auth, async (req, res) => {
    const apartment = await Apartment.findByIdAndRemove(req.params.id);

    if (!apartment) return res.status(404).send('The apartment with the given ID was not found.');

    res.send(apartment);
});

router.get('/:id', async (req, res) => {
    const apartment = await Apartment.findById(req.params.id);

    if (!apartment) return res.status(404).send('The apartment with the given ID was not found.');

    res.send(apartment);
});

module.exports = router;