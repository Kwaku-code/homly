const Joi = require('joi');
const mongoose = require('mongoose');

const Lessee = mongoose.model('Lessee', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    leaseTerm: {
        type: Number,
        min: 1,
        max: 60
    },
    numOfLeaseFlats: {
        type: Number,
        min: 1,
        max: 5
    },
    phone: {
        type: String,
        required: true,
        minlenght: 5,
        maxlength: 50
    }
}));

function validateLessee(lessee) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        leaseTerm: Joi.number().min(1).max(60).required(),
        numOfLeaseFlats: Joi.number().min(1).max(5).required(),
        phone: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(lessee, schema);
};

exports.Lessee = Lessee;
exports.validate = validateLessee;