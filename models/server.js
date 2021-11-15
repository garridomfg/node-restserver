const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.authPath = '/api/auth';
        this.patientsPath = '/api/patients';
        this.professionalsPath = '/api/professionals';

        this.connectDB();

        this.middlewares();

        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        this.app.use( cors() );
        this.app.use( express.json() );
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use( this.authPath, require('../routes/auth'));
        this.app.use( this.patientsPath, require('../routes/patient'));
        this.app.use( this.professionalsPath, require('../routes/professional'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port:', this.port);
        });
    }
}

module.exports = Server;