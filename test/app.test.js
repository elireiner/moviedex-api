require('dotenv').config();
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('app', () => {
    it('returns an error when no Auth header', () => {
        return supertest(app)
            .get('/movie')
            .expect(401)
    })
    
    let wrong = ' ';

    it('returns an error when Auth key not correct', () => {
        return supertest(app)
            .get('/movie')
            .set('Authorization', 'bearer ' + wrong)
            .expect(401)
    })

    let auth = process.env.API_TOKEN;

    it('returns an array', () => {
        return supertest(app)
            .get('/movie')
            .set('Authorization', 'bearer ' + auth)
            .expect(200)
            .then(res => {
                expect(res.body).to.be.an('array')
            })
    })

})