const BlogPostModel = require('./blog/blogPostModel')
const UserModel = require('./user/userModel')
const blogRouter = require('./blog/blogRouter')
const authRouter = require('./authenticate/authenticateRouter')

// this brings all routers and models into one object which is exposed with getConfig()
const apiConfig = {
    routers: {
        blog: blogRouter,
        authenticate: authRouter,
    },
    models: {
        BlogPostModel,
        UserModel,
    },

}


function setupRoutes(app) {
    // walk the apiConfig.routers object and setup routes 
    const routers = apiConfig.routers
    Object.keys(routers).forEach(routePrefix => {
        console.log(`SETUP /${routePrefix} ROUTE routePrefix`)
        const router = routers[routePrefix]
        app.use(`/${routePrefix}`, router)
    })

}

function getConfig() {
    return apiConfig
}

module.exports = {
    getConfig,
    setupRoutes,
}
