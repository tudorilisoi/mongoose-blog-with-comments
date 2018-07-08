
function expressTryCatchWrapper(fn) {
    return async function (req, resp) {
        try {
            await fn(req, resp)
        } catch (ex) {
            console.error('expressTryCatch ERROR', ex)
            resp.status(500).json({ 
                message: 'SERVER_ERROR', 
                info:ex.toString() 
            })
        }
    }
}

module.exports = {
    expressTryCatchWrapper
}
