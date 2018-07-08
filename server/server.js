//node/npm imports
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//app-specific imports
const { DATABASE_URL, TEST_DATABASE_URL, PORT } = require('../config.js');
const { setupRoutes } = require('./api/api.js')


//initialize the express app
const app = express();
app.use(bodyParser.json()); // support JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(morgan('common')); //do request logging in the console
app.use(express.json());

//setup API routes
setupRoutes(app)

//setup a handler for unknown/malformed routes
app.use('*', function (req, res) {
    res.status(404).json({ message: 'Route not handled: malformed URL or non-existing static resource' });
});


let server //keep a reference to the running express server so we can close it later

function runHttpServer(port) {
    let resolved = false
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            console.log(`EXPRESS HTTP(S) SERVER STARTED ON PORT ${port}`);
            console.log(`base URL for localhost development: http://localhost:${port}`);
            resolved = true
            resolve(server)
        }).on('error', err => {
            console.error('SERVER ERROR', err)
            if (!resolved) {
                reject(err)
            }
        });
    })
}

async function runServer(databaseUrl, port) {
    try {
        await mongoose.connect(databaseUrl, { useNewUrlParser: false })
        const dbMode = databaseUrl === TEST_DATABASE_URL ? 'TEST MODE' : 'PRODUCTION MODE'
        console.log(`MONGOOSE CONNECTED [${dbMode}]`);
        server = await runHttpServer(port)
        return server
    } catch (ex) {
        mongoose.disconnect();
        console.error('CANNOT START SERVER', ex)
        return false
    }
}


async function closeServer() {
    try {
        await mongoose.disconnect()
        await new Promise((resolve, reject) => {
            if (!server) {
                return resolve(true)
            }
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    throw err;
                }
                return resolve(true);
            });
        });
    } catch (ex) {
        console.error('CANNOT STOP SERVER', ex)
    }

}

if (require.main === module) {
    runServer(DATABASE_URL, PORT).catch(err => console.error('CANNOT START SERVER', err));
}

// export an object containing some functions and object so the test suite can access them
module.exports = { app, runServer, closeServer };
