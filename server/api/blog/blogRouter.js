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

    // whenever there's a promise returned we need to use 'await'
    // so the next line retrieves the actual record, not the promise
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
    const total = await blogPostModel.countDocuments()

    if (offset > total || offset < 0) {

        //HTTP 400 = bad request
        return res.status(400).json({
            message: 'OUT_OF_BOUNDS'
        })
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


async function updatePost(req, res) {
    const existingRecord = await blogPostModel.findById(req.params.id)
    if (existingRecord === null) {
        return res.status(404).json({ message: 'NOT_FOUND' })
    }

    // if adding more updatable fields to the model schema later on, just change this line
    // for example, if adding 'postBody' the next line will become 
    // const fieldNamesArr = 'title postBody'.split(' ')
    const fieldNamesArr = 'title'.split(' ') //an array of updatable field names

    const requestFieldNames = Object.keys(req.body)

    // new to reduce? 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce    
    const newFieldValues = fieldNamesArr.reduce((acc, fieldName) => {

        if (requestFieldNames.includes(fieldName)) { // is this field name present in the request?
            const value = req.body[fieldName]

            // is there an usable value? 
            // if so, add it to the reduce() return object
            if (value !== undefined) {
                acc[fieldName] = value
            }
        }
        return acc
    }, {})

    const updatedRecord = await blogPostModel.findByIdAndUpdate(
        { '_id': req.params.id },
        { $set: newFieldValues },
        { new: true } //tell mongoose to return the updated document 
    )
    res.json({ post: updatedRecord.serialize() })
}

// Update
router.put('/post/:id', tryCatch(updatePost));


async function deletePost(req, res) {
    const record = await blogPostModel.findByIdAndRemove(req.params.id)
    if (record === null) {
        return res.status(404).json({ message: 'NOT_FOUND' })
    }
    res.json({ post: record.serialize() })
}

// Delete
router.delete('/post/:id', tryCatch(deletePost));

module.exports = router