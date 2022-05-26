const moment = require('moment');
const request = require('supertest');
const {Lease} = require('../../models/lease');
const {Apartment} = require('../../models/apartment');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/lesapartupdates', () => {
    let server;
    let lesseeId;
    let apartmentId;
    let lease;
    let apartment;
    let token;

    const exec = () => {
        return request(server)
            .post('/api/lesapartupdates')
            .set('x-auth-token', token)
            .send({ lesseeId, apartmentId });
    };

    beforeEach(async () => {
        server = require('../../index');

        lesseeId = mongoose.Types.ObjectId();
        apartmentId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        apartment = new Apartment({
            _id: apartmentId,
            name: '12345',
            monthlyLeaseRate: 1000,
            serie: { name: 'Series One' },
            availableFlats: 10
        });
        await apartment.save();

        lease = new Lease({
            lessee: {
                _id: lesseeId,
                name: '12345',
                phone: '12345'
            },
            apartment: {
                _id: apartmentId,
                name: '12345',
                monthlyLeaseRate: 1000
            }
        });
        await lease.save();
    }, 10000);

    afterEach(async () => {
        server.close();
        await Lease.remove({});
        await Apartment.remove({});
    });

    it('should return 401 if client is not logged in', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if lesseeId is not provided', async () => {
        lesseeId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if apartmentId is not provided', async () => {
        apartmentId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no lease found for the lessee/apartment', async () => {
        await Lease.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if lease tenure is already processed', async () => {
        lease.leaseExpiration = new Date();
        await lease.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if we have a valid request', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the lease expiration date if input is valid', async () => {
        const res = await exec();

        const leaseInDb = await Lease.findById(lease._id);
        const diff = new Date() - leaseInDb.leaseExpiration;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set the leaseFee if input is valid', async () => {
        lease.moveInDate = moment().add(-7, 'days').toDate();
        await lease.save();

        const res = await exec();

        const leaseInDb = await Lease.findById(lease._id);
        expect(leaseInDb.leaseFee).toBe(7000);
    });

    it('should increase the apartment stock if input is valid', async () => {
        const res = await exec();

        const apartmentInDb = await Apartment.findById(apartmentId);
        expect(apartmentInDb.availableFlats).toBe(apartment.availableFlats + 1);
    });

    it('should return the lease if input is valid', async () => {
        const res = await exec();

        const leaseInDb = await Lease.findById(lease._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['moveInDate', 'leaseExpiration', 'leaseFee',
                'lessee', 'apartment']));
    });
});