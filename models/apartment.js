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
        type: Boolean,
        default: false
    },
    movieRoom: {
        type: Boolean,
        default: false
    },
    laundryRoom: {
        type: Boolean,
        default: false
    },
    availableFlats: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    monthlyLeaseRate: {
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
        outDoorPool: Joi.boolean(),
        internetCafe: Joi.boolean(),
        fitnessCenter: Joi.boolean(),
        dogRun: Joi.boolean(),
        movieRoom: Joi.boolean(),
        laundryRoom: Joi.boolean(),
        availableFlats: Joi.number().min(0).required(),
        monthlyLeaseRate: Joi.number().min(1000).required()
    };

    return Joi.validate(apartment, schema);
};

exports.Apartment = Apartment;
exports.validate = validateApartment;