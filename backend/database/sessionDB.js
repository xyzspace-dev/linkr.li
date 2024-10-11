const { model, models, Schema } = require("mongoose");
const { String, Number } = require("../schemaArguments");

const sessionSchema = new Schema({
  UUID: String,
  UserID: String,
});

module.exports = models.session || model("session", sessionSchema);
