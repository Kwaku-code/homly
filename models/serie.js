const Joi = require('joi');
const mongoose = require('mongoose');

const serieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    numberOfFlats: {
        type: Number,
        required: true,
        min: 1,
        max: 50
    },
    amenities: {
        type: Number,
        required: true,
        min: 5,
        max: 20
    },
    smartLiving: {
        type: Boolean,
        default: false
    }
});

const Serie = mongoose.model('Serie', serieSchema);

function validateSerie(serie) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        numberOfFlats: Joi.string().min(1).max(50).required(),
        amenities: Joi.string().min(5).max(20).required(),
        smartLiving: Joi.boolean()
    };

    return Joi.validate(serie, schema);
};

exports.serieSchema = serieSchema;
exports.Serie = Serie;
exports.validate = validateSerie;