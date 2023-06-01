const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, './config/.env') }); // Load env variables;
const morgan = require("morgan");
const connectDB = require("./DB/connectDB");
const passport = require('passport');
require('./config/passport')(passport); // Passport config

// Multi-process to utilize all CPU cores.
const cluster = require('cluster');
const numCPUs = 1;//require('os').cpus().length;
const isDev = process.env.NODE_ENV !== 'prod';
if (!isDev && cluster.isMaster) {
    console.error(`Node cluster master ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) 
        cluster.fork();
  
    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });
} else {
    const PORT = process.env.PORT || 5000;
    const app = express();

    // If the app is in development use Morgan to log requests to the app
    if (process.env.NODE_ENV === 'dev')
        app.use(morgan('dev'));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
    app.use(cors({
        origin: [ 'http://localhost:3000' ],
        credentials: true
    }));

    connectDB.createMongooseConnection(); // Connect mongoose to the DB

    app.use(passport.initialize()); // Passport middleware

    // Routes
    app.use('/auth', require(path.resolve(__dirname, './Routes/auth')));
    app.use('/api/users', require(path.resolve(__dirname, './Routes/api/users')));
    app.use('/api/users/log', require(path.resolve(__dirname, './Routes/api/log')));
    app.use('/api/users/profile', require(path.resolve(__dirname, './Routes/api/profile')));
    app.use('/api/trainer', require(path.resolve(__dirname, './Routes/api/trainer')));
    // app.use('/api/users', require(path.resolve(__dirname, './Routes/routes')));
    // app.use('/api/users/profile', require(path.resolve(__dirname, './Routes/profile')));
    // app.use('/api/trainer', require(path.resolve(__dirname, './Routes/trainer')));
    app.use('/api/search', require(path.resolve(__dirname, './Routes/search')));
    app.use('/api/scheduling', require(path.resolve(__dirname, './Routes/scheduling')));
    app.use('/api/chat', require(path.resolve(__dirname, './Routes/chat')));
    app.use('/api/message', require(path.resolve(__dirname, './Routes/message')));
    app.use('/api/admin', require(path.resolve(__dirname, './Routes/admin')))


    app.get('*', function(req, res) {
        console.log(path.resolve(__dirname, '../react-ui/build', 'index.html'));
        res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
    });

    app.listen(PORT, () => {
        console.log(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: ` + 
                    `listening at ${isDev ? `http://localhost:${PORT}` : `${PORT}`}`);
    });
}