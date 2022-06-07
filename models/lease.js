const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const leaseSchema = new mongoose.Schema({
    lessee: {
        type: new mongoose.Schema({
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
        }),
        required: true
    },
    apartment: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            monthlyLeaseRate: {
                type: Number,
                required: true,
                min: 1000,
                max: 10000
            }
        }),
        required: true
    },
    moveInDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    leaseExpiration: {
        type: Date
    },
    leaseFee: {
        type: Number,
        min: 1000
    }
});

leaseSchema.statics.lookup = function (lesseeId, apartmentId) {
    return this.findOne({
        'lessee._id': lesseeId,
        'apartment._id': apartmentId
    });
}

leaseSchema.methods.return = function() {
    this.leaseExpiration = new Date(); 

    const leaseMonths = moment().diff(this.moveInDate, 'days');
    this.leaseFee = leaseMonths * this.apartment.monthlyLeaseRate;
}

const Lease = mongoose.model('Lease', leaseSchema);

function validateLease(lease) {
    const schema = {
        lesseeId: Joi.objectId().required(),
        apartmentId: Joi.objectId().required(),
        moveInDate: Joi.date(),
        leaseExpiration: Joi.date()
        // leaseFee: Joi.number().min(1000).required(),
    };

    return Joi.validate(lease, schema);
};

exports.Lease = Lease;
exports.validate = validateLease;