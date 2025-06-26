const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authRoute = require('./routes/auth.route');
const tpsRoute = require('./routes/tps.route');
const tpaRoute = require('./routes/tpa.route');
const ruteRoute = require('./routes/rute.route');

const { httpLogStream } = require('./utils/logger');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(morgan('combined', { stream: httpLogStream }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use('/api/', authRoute);
app.use('/api/', tpsRoute);
app.use('/api/', tpaRoute);
app.use('/api/', ruteRoute);

app.get('/', (req, res) => {
    res.status(200).send({
        status: "success",
        data: {
            message: "API working fine"
        }
    });
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        status: "error",
        message: err.message
    });
    next();
});

module.exports = app;