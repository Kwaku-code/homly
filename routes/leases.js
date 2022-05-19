const auth = require('../middleware/auth');
const {Lease, validate} = require('../models/lease');
const {Apartment} = require('../models/apartment');
const {Lessee} = require('../models/lessee');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const leases = await Lease.find().sort('-moveInDate');
    res.send(leases);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const lessee = await Lessee.findById(req.body.lesseeId);
    if (!lessee) return res.status(400).send('Invalid lessee.');

    const apartment = await Apartment.findById(req.body.apartmentId);
    if (!apartment) return res.status(400).send('Invalid apartment.');

    if (apartment.availableFlats === 0) return res.status(400).send('Apartment not available.');

    let lease = new Lease({
        lessee: {
            _id: lessee._id,
            name: lessee.name,
            leaseTerm: lessee.leaseTerm,
            numOfLeaseFlats: lessee.numOfLeaseFlats,
            phone: customer.phone
        },
        apartment: {
            _id: apartment._id,
            name: apartment.name,
            monthlyLeaseRate: apartment.monthlyLeaseRate
        }
    });
    lease = await lease.save();

    apartment.numOfLeaseFlats--;
    apartment.save();

    res.send(lease);
});

router.get('/:id', async (req, res) => {
    const lease = await Lease.findById(req.params.id);

    if (!lease) return res.status(404).send('The lease with the given ID was not found.');

    res.send(lease);
});

module.exports = router;