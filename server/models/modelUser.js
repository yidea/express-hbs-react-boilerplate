// ----------------------------------------------------------------------------
// modelUser
// ----------------------------------------------------------------------------
let bcrypt = require("bcrypt");
require("songbird"); // enable User.promise
let mongoose = require("../../utils/MongooseUtil");

// Schema
var schema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  blogTitle: String,
  blogDescription: String
});

// Method
schema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.equalPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", schema);
