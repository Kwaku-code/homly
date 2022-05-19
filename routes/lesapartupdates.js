const Joi = require('joi');
const validate = require('../middleware/validate');
const {Lease} = require('../models/lease');
const {Apartment} = require('../models/apartment');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', [auth, validate(validateLeaseTenure)], async (req, res) => {
    const lease = await Lease.lookup(req.body.lesseeId, req.body.apartmentId);

    if (!lessee) return res.status(404).send('Lease not found.');

    if (lease.leaseExpiration) return res.status(400).send('Lease tenure already processed.');

    lease.return();
    await lease.save();

    await Apartment.updateOne({ _id: lease.apartment._id }, {
        $inc: { availableFlats: 1 }
    });

    return res.send(lease);
});

function validateLeaseTenure(req) {
    const schema = {
        lesseeId: Joi.objectId().required(),
        apartmentId: Joi.objectId().required()
    };

    return Joi.validate(req, schema);
};

module.exports = router;
