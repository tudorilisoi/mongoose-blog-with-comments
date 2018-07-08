const blogPostModel = require('./blog/blogPostModel')
const blogRouter = require('./blog/blogRouter')

// an object whose keys are route prefixes for express
// add more keys(prefixes) here as you develop more routes and models
const apiConfig = {
    blog: {
        router: blogRouter,
        models: {
            post: blogPostModel,
        },
    }
}


function setupRoutes(app) {
    // walk the apiConfig object and setup routes 
    const prefixes = Object.keys(apiConfig)
    prefixes.forEach(prefix => {
        console.log(`SETUP /${prefix} ROUTE PREFIX`)
        const router = apiConfig[prefix].router
        app.use(`/${prefix}`, router)
    })

}

function getConfig(prefix) {
    return apiConfig[prefix]
}

module.exports = {
    getConfig,
    setupRoutes,
}
