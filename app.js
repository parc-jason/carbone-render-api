const bodyParser = require('body-parser');
const express = require('express');
const Problem = require('api-problem');

const carboneCopyApi = require('carbone-copy-api');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', carboneCopyApi.routes());

// Handle 500
app.use((err, _req, res, _next) => {
    if (err.stack) {
        console.log(err.stack);
    }

    if (err instanceof Problem) {
        err.send(res);
    } else {
        new Problem(500, {details: (err.message) ? err.message : err}).send(res);
    }
});

// Handle 404
app.use((_req, res) => {
    new Problem(404).send(res);
});

// Prevent unhandled errors from crashing application
process.on('unhandledRejection', err => {
    if (err && err.stack) {
        console.log(err.stack);
    }
});

// Graceful shutdown support
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
    console.log('Received kill signal. Shutting down...');
    // Wait 3 seconds before hard exiting
    setTimeout(() => process.exit(), 3000);
}

module.exports = app;

