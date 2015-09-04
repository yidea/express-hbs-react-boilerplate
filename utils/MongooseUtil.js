// ----------------------------------------------------------------------------
// MongooseUtil
// ----------------------------------------------------------------------------
let mongoose = require("mongoose"),
  config = require("../configs/MongoConfig");

//connect to mongodb
var dbConnection = "mongodb://" + config.host + ":" + config.port + "/" + config.db;
mongoose.connection.on("error", function (err) {
  console.log("MongoDB error:", err);
});
mongoose.connect(dbConnection);

module.exports = mongoose;
