const express = require('express');

const userModel = require('../user/userModel')
const { localAuthMiddleware } = require('./strategies')
const tryCatch = require('../../helpers').expressTryCatchWrapper

// create a router, it will be plugged in the express app
// see server/api/api.js setupRoutes()
const router = express.Router();


async function login(req, res) {
    const user = req.user
    res.json(req.user)
}

router.post('/login', localAuthMiddleware, tryCatch(login))

module.exports = router