const express = require('express');
// const {getConfig} = require('../api.js')
const blogPostModel = require('./blogPostModel')
const tryCatch = require('../../helpers').expressTryCatchWrapper
//create a router
const router = express.Router();

//hardcoded limit for posts per page
const LIMIT = 10

// setup blog posts CRUD
async function createPost(req, res) {
    const record = await blogPostModel.create({
        date: new Date(),
        title: req.body.title || 'Untitled post'
    })
    res.json({ post: record.serialize() })
}
router.post('/post/create', tryCatch(createPost));


async function getPosts(req, res) {
    const offset = parseInt(req.params.offset || 0)
    const total = await blogPostModel.count()
    if (offset > total) {
        throw new Error('OUT_OF_BOUNDS')
    }
    const records = await blogPostModel
        .find({})
        .sort([['date', -1]])
        .limit(LIMIT)
        .skip(offset)

    res.json({
        total, //same as writing total: total
        posts: records.map(record => record.serialize()),
    })
}
router.get('/posts', tryCatch(getPosts));
router.get('/posts/:offset', tryCatch(getPosts));


module.exports = router