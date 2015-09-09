// ----------------------------------------------------------------------------
// modelPost
// ----------------------------------------------------------------------------
let mongoose = require("../../utils/MongooseUtil");
require("songbird"); // enable Model.promise

// Schema
var schema = mongoose.Schema({
  title: String,
  content: String,
  userId: Schema.objectId,
  createTime: {
    type: Date,
    default: Date.now
  },
  updateTime: {
    type: Date,
    default: Date.now
  }
});

// Middleware
schema.pre("save", (next) => {
  this.updateTime = Date.now();
  next();
});

module.exports = mongoose.model("Post", schema);
