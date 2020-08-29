const expect = require('expect');
const request = require('supertest');

const app = require('./index.js');
const Ticket = require('./models/Ticket.js');

describe('Route: /bookticket        (Type: POST)', () => {
    let ticket = {
        mobileNumber: "8949570963",
        name: "Jai Parakh",
        timmings: "Sat Aug 29 2020 10:13:18 GMT+0530 (India Standard Time)"
    };

    it('Should add a new ticket.', (done) => {
        request(app).post('/bookticket').send(ticket).expect(200).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        })
    });

    it('Should not add a duplicate ticket.', (done) => {
        request(app).post('/bookticket').send(ticket).expect(400).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        })
    });

    it('Should throw an error if slot is booked, i.e 20 tickets', (done) => {
        ticket = {
            mobileNumber: "7845126487",
            name: "Kenobi",
            timmings: "Sat Aug 29 2020 10:13:18 GMT+0530 (India Standard Time)"
        }
        request(app).post('/bookticket').send(ticket).expect(200).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        })
    });
});

describe('Route: /updateticket      (Type: PATCH)', () => {
    it('Should update the ticket.', (done) => {
        request(app).patch('/updateticket/5f4a3b54dad27b29d072fdb7').send({timmings: "Sat Aug 29 2020 21:13:18 GMT+0530 (India Standard Time)"}).expect(200).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        });
    });

    it('Should throw error as ticket is not in the db.', (done) => {
        request(app).patch('/updateticket/5f4a1c9fed03721820e37f67').send({timmings: "Sat Aug 29 2020 21:13:18 GMT+0530 (India Standard Time)"}).expect(404).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        });
    });

    it('Should throw an error as passed id is invalid', (done) => {
        request(app).patch('/updateticket/5721820e37f67').send({timmings: "Sat Aug 29 2020 21:13:18 GMT+0530 (India Standard Time)"}).expect(400).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        });
    });
});

describe('Route: /alltickets        (Type: GET)', () => {
    it('Should list all tickets at the specified time', (done) => {
        request(app).get('/alltickets/2020-08-29T12:43:18.000+00:00').expect(200).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        });
    });

    it('Should throw 404 as no tickets are booked at the specified time', (done) => {
        request(app).get('/alltickets/2020-07-29T12:43:18.000+00:00').expect(404).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        });
    });
});

describe('Route: /deleteticket      (Type: DELETE)', () => {
    it('Should delete the ticket.', (done) => {
        request(app).delete('/deleteticket/5f4a3b54dad27b29d072fdb7').expect(200).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        });
    });

    it('Should throw an error as passed id is invalid', (done) => {
        request(app).delete('/deleteticket/5721820e37f67').send({timmings: "Sat Aug 29 2020 21:13:18 GMT+0530 (India Standard Time)"}).expect(400).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        });
    });
});

describe('Route: /userdetails        (Type: GET)', () => {
    it('Should fetch user details by ticketId', (done) => {
        request(app).get('/userdetails/5f4a3b7fda4a952688ebeda5').expect(200).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        });
    });

    it('Should throw 404 as user is not in the collection.', (done) => {
        request(app).get('/userdetails/5f4a3b54dad27b29d072fdb7').expect(404).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        });
    });

    it('Should throw an error as passed id is invalid', (done) => {
        request(app).get('/userdetails/5721820e37f67').send({timmings: "Sat Aug 29 2020 21:13:18 GMT+0530 (India Standard Time)"}).expect(400).end((err, res) => {
            if(err){
                return done(err);
            }
            done();
        });
    });
});