const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose');
//const faker = require('faker');
const { closeServer, runServer, app } = require('../../server');
const { TEST_DATABASE_URL } = require('../../../config');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('blog API', function () {

    before(function () {
        return runServer(TEST_DATABASE_URL);
    });

    after(function () {
        return closeServer();
    });

    describe('Root URL', function () {

        it('should respond with a status of 200 and HTML', function () {
            return chai.request(app)
                .get('/blog/posts')
                .then(function (res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.html;
                });
        });
    });

});
