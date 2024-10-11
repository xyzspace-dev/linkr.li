const { model, models, Schema } = require("mongoose");
const { String, Number } = require("../schemaArguments");

const hostSchema = new Schema({
  UUID: String,
  URL: String,
  APIKey: String,
});

module.exports = models.host || model("host", hostSchema);
