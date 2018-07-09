const express = require('express');

const blogPostModel = require('./blogPostModel')
const tryCatch = require('../../helpers').expressTryCatchWrapper

// create a router, it will be plugged in the express app
// see server/api/api.js setupRoutes()
const router = express.Router();

//hardcoded limit for posts per page
const LIMIT = 10

//
// setup blog posts CRUD
//


async function createPost(req, res) {

    // whenever there's a promise involved we need to use 'await'
    const record = await blogPostModel.create({
        title: req.body.title || 'Untitled post'
    })

    res.json({ post: record.serialize() })
}

// Create
// NOTE if the promise fails the tryCatch will output a nice JSON message        
router.post('/post/create', tryCatch(createPost));

async function getPost(req, res) {
    const record = await blogPostModel.findById(req.params.id)
    if (record === null) {
        return res.status(404).json({ message: 'NOT_FOUND' })
    }
    res.json({ post: record.serialize() })
}

// Retrieve one
router.get('/post/:id', tryCatch(getPost));


async function getPosts(req, res) {

    // request parameters are always strings (or undefined)
    // for this reason we use parseInt to convert req.params.offset to an integer
    const offset = parseInt(req.params.offset || 0)

    // the [total] count is useful when implementing a paged navigation pattern, 
    // when we need to compute how many pages of [LIMIT] size are there 
    // and how to make an HTTP request for a specific page
    const total = await blogPostModel.count()


    if (offset > total || offset < 0) {
        throw new Error('OUT_OF_BOUNDS')
    }

    // order all posts from newest to oldest
    // then skip [offset] records
    // then take [LIMIT] records 

    const records = await blogPostModel
        .find({})
        .sort([['date', -1]])
        .skip(offset)
        .limit(LIMIT)

    // return the resulting posts as JSON  along with the [total] number of existing posts    
    res.json({
        pageSize: LIMIT,
        total, //same as writing total: total
        posts: records.map(record => record.serialize()),
    })
}

// Retrieve many
router.get('/posts', tryCatch(getPosts));

// the offset parameter makes it possible to split a large number of posts into chunks/pages
// for example /blog/posts/0 = the latest 10 posts, /blog/posts/10 = the next (older) 10 posts    
router.get('/posts/:offset', tryCatch(getPosts));


async function deletePost(req, res) {
    const record = await blogPostModel.findByIdAndRemove(req.params.id)
    res.json({ post: record.serialize() })
}

// Delete
router.delete('/post/:id', tryCatch(deletePost));

module.exports = router