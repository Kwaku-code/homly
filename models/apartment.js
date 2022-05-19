const Joi = require('joi');
const mongoose = require('mongoose');
const {serieSchema} = require('./serie');

const Apartment = mongoose.model('Apartment', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    serie: {
        type: serieSchema,
        required: true
    },
    outDoorPool: {
        type: Boolean,
        default: false
    },
    internetCafe: {
        type: Boolean,
        default: false
    },
    fitnessCenter: {
        type: Boolean,
        default: false
    },
    dogRun: {
        type: String,
        default: false
    },
    movieRoom: {
        type: String,
        default: false
    },
    laundryRoom: {
        type: String,
        default: false
    },
    availableFlats: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    monthlyRentalRate: {
        type: Number,
        required: true,
        min: 1000,
        max: 10000
    }
}));

function validateApartment(apartment) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        serieId: Joi.objectId().required(),
        availableFlats: Joi.number().min(0).required(),
        monthlyRentalRate: Joi.number().min(0).required()
    };

    return Joi.validate(apartment, schema);
};

exports.Apartment = Apartment;
exports.validate = validateApartment;