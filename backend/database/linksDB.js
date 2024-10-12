const { model, models, Schema } = require("mongoose");
const { String, Number } = require("../schemaArguments");
const hostDB = require("./hostDB");

const linkSchema = new Schema({
  UUID: String,
  UserID: String,
  Slug: String,
  Redirect: String,
  URL: String,
  Host: String,
});

module.exports = models.link || model("link", linkSchema);
