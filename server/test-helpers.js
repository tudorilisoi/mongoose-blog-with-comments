
const mongoose = require('mongoose')

async function deleteCollections(namesArr) {
    // get existing collections
    const collections = await mongoose.connection.db.collections()

    // filter existing collections by name  
    const filteredCollections = collections.filter(item => namesArr.includes(item.collectionName))

    //drop the collections so we can start fresh every time this test runs
    return await Promise.all(filteredCollections.map(c => c.remove()))
}

module.exports = {
    deleteCollections,
}
