/**
 * MongooseUtil
 */
let mongoose = require("mongoose"),
  Config = require("../configs/MongoConfig"),
  Logger = require("./Logger");

let dbConnection = `mongodb://${Config.host}:${Config.port}/${Config.db}`;
let db = mongoose.connection;
db.on("error", (err) => {
  Logger.error(`MongoDB error: ${err}`);
});

db.once("open", () => {
  Logger.info(`MongoDB is running at ${dbConnection}`);
});

mongoose.connect(dbConnection);

module.exports = mongoose;
