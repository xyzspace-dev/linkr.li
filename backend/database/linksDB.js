const { model, models, Schema } = require("mongoose");
const { String, Number } = require("../schemaArguments");

const linkSchema = new Schema({
  UUID: String,
  UserID: String,
  Slug: String,
  Redirect: String,
  URL: String,
});

module.exports = models.link || model("link", linkSchema);
