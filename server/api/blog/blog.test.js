const chai = require('chai')
const chaiHttp = require('chai-http')

const mongoose = require('mongoose')
const { closeServer, runServer, app } = require('../../server')
const { TEST_DATABASE_URL, PORT } = require('../../../config')
const { getConfig } = require('../../api/api')
const PostModel = getConfig('blog').models.post

const expect = chai.expect; //using the chai assertion library
const should = chai.should()
chai.use(chaiHttp)

const mockData = [
    { title: 'Post 1' },
    { title: 'Post 2' },
    { title: 'Post 3' },
]


async function deleteCollections(namesArr) {
    // get existing collections
    const collections = await mongoose.connection.db.collections()

    // filter existing collections by name  
    const filteredCollections = collections.filter(item => namesArr.includes(item.collectionName))

    //drop the collections so we can start fresh every time this test runs
    return await Promise.all(filteredCollections.map(c => c.remove()))
}

describe('blog API routes', function () {

    before(async () => {
        await runServer(TEST_DATABASE_URL, PORT)
        // await deleteCollections(['blogpostmodels'])
    })

    after(async () => {
        await closeServer()
    })


    describe('CRUD /blog/post', () => {

        let createdPost, deletedPost

        it('should update a post by id (PUT)', async () => {
            const title = 'A post with an akward title: ' + Math.random()
            const newTitle = 'Hey! I changed the title!'

            //create a post directly in the db
            const record = await PostModel.create({ title })
            
            //make an API HTTP request with an updated title
            const res = await chai
                .request(app)
                .put(`/blog/post/${record._id}`)
                .send({ title: newTitle })
            expect(res).to.have.status(200)
            expect(res).to.be.json;
            const { post } = res.body
            expect(post.title).to.equal(newTitle)
        })


        it('should create a new post (POST)', async () => {
            const title = 'A post with an akward title: ' + Math.random()
            const res = await chai
                .request(app)
                .post('/blog/post/create')
                .send({ title })
            expect(res).to.have.status(200)
            expect(res).to.be.json;

            // object destructuring: the next line is equivalent to const post = res.body.post
            const { post } = res.body
            createdPost = post
            expect(post).to.be.an('object');
            expect(post.title).to.equal(title)
            expect(post.id).to.be.a('string')
            expect(post.createdAt).to.be.a('string')
            const createdAt = new Date(post.createdAt)
            expect(createdAt).to.be.a('date')
            expect(createdAt.toDateString()).to.not.equal('Invalid Date')

        })

        //NOTE this depends on the previous it() being sucessful
        it('should retrieve a post by id (GET)', async () => {
            const res = await chai.request(app).get(`/blog/post/${createdPost.id}`)
            expect(res).to.have.status(200)
            expect(res).to.be.json;
            const { post: retrievedPost } = res.body
            expect(retrievedPost).to.deep.equal(createdPost)
        })

        //NOTE this depends on the previous it() being sucessful
        it('should delete a post by id (DELETE)', async () => {
            const res = await chai.request(app).delete(`/blog/post/${createdPost.id}`)
            expect(res).to.have.status(200)
            expect(res).to.be.json;
            const { post } = res.body
            deletedPost = post
            expect(post).to.deep.equal(createdPost)
        })

        //NOTE this depends on the previous it() being sucessful
        it('should return a 404 for non-existent post', async () => {
            const nxID = deletedPost.id
            const res = await chai.request(app).get(`/blog/post/${nxID}`)
            expect(res).to.have.status(404)
            expect(res).to.be.json;
        })


    })

    describe('GET /blog/posts (no records)', () => {
        it('should respond with JSON', async () => {
            await deleteCollections(['blogpostmodels'])
            const res = await chai.request(app).get('/blog/posts')
            expect(res).to.have.status(200)
            expect(res).to.be.json;

            //perform a deep comparison 'deep.equal' because arrays are not equal by reference
            expect(res.body.posts).to.deep.equal([])
        })

        it('should fail when the offset param is out of bounds', async () => {
            const res = await chai.request(app).get('/blog/posts/10')
            expect(res).to.be.json;
            expect(res).to.have.status(500)
        })


    })

    describe('GET /blog/posts (some records)', () => {
        it('should respond with JSON', async () => {

            //start fresh by deleting all posts
            await deleteCollections(['blogpostmodels'])

            //create 3 posts using the model (not the API)
            await Promise.all(mockData.map(item => PostModel.create(item)))
            const res = await chai.request(app).get('/blog/posts')
            expect(res).to.have.status(200)
            expect(res).to.be.json;
            expect(res.body.posts).to.be.an('array');
            expect(res.body.posts).to.have.lengthOf(3)
            expect(res.body.total).to.equal(3)
        })

        it('should account for the offset param', async () => {
            const res = await chai.request(app).get('/blog/posts/2')
            expect(res).to.be.json;
            expect(res).to.have.status(200)
            expect(res.body.posts).to.be.an('array');
            expect(res.body.posts).to.have.lengthOf(1)
            expect(res.body.total).to.equal(3)
        })


    })


})
