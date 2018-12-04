const chai = require('chai')
const chaiHttp = require('chai-http')

const { closeServer, runServer, app } = require('../../server')
const { TEST_DATABASE_URL, TEST_PORT } = require('../../../config')
const { getConfig } = require('../../api/api')
const PostModel = getConfig().models.BlogPostModel

const { deleteCollections } = require('../../test-helpers')

const expect = chai.expect; //using the chai assertion library
const should = chai.should()
chai.use(chaiHttp)

const seedData = [
    { title: 'Post 1' },
    { title: 'Post 2' },
    { title: 'Post 3' },
]
const SEED_DATA_LENGTH = seedData.length

describe('authenticate API', function () {

    before(async () => {
        await runServer(TEST_DATABASE_URL, TEST_PORT)
    })

    after(async () => {
        await closeServer()
    })


    describe('auth /auth/login', () => {      

        it('should fail with invalid email', async () => {

            //make an API HTTP request with email and password
            const res = await chai
                .request(app)
                .post(`/authenticate/login/`)
                .set('Content-type', 'application/json')
                .send({ email: 'nx@example.com', password: '12345678`' })

            expect(res).to.have.status(401) // HTTP 401 unauthorized
        })
    })
})
