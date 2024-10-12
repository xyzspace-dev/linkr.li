const { model, models, Schema } = require("mongoose");
const { String, Number } = require("../schemaArguments");

const userSchema = new Schema({
  UUID: String,
  UserID: String,
  Email: String,
  Links: [String],
  RefreshToken: String,
  AccessToken: String,
  Admin: Boolean,
});

module.exports = models.user || model("user", userSchema);
