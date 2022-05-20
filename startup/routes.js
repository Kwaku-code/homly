const express = require('express');
const series = require('../routes/series');
const lessees = require('../routes/lessees');
const leases = require('../routes/leases');
const apartments = require('../routes/apartments');
const users = require('../routes/users');
const auth = require('../routes/auth');
const lesapartupdates = require('../routes/lesapartupdates');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/series', series);
    app.use('/api/lessees', lessees);
    app.use('/api/apartments', apartments);
    app.use('/api/leases', leases);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/lesapartupdates', lesapartupdates);
    app.use(error);
}