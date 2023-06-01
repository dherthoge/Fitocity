const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

const connectionOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

// Creates a mongoose connection for data objects
const createMongooseConnection = async () => {
  try {
      const conn = await new mongoose.connect(process.env.DB, connectionOptions);
      console.log(`MongoDB Cloud Connected: ${conn.connection.host}`);

  } catch (error) {
      console.log(error);
      process.exit(1);
  }
}
// Creates a MongoStore for storing sessions then calls the callback
const createMongoStore = async (next) => {
    try {
        let secondsInDay = 24*60*60;
        const mongoStore = MongoStore.create({
            mongoUrl: process.env.DB,
            mongoOptions: connectionOptions,
            collectionName: 'sessions',
            ttl: secondsInDay
        });
        console.log(`MongoStore Created: ${JSON.stringify(mongoStore)}`);
        next(mongoStore);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = { createMongooseConnection, createMongoStore };