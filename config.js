require("dotenv").config();
module.exports = {
  MONGODBURL: process.env.MONGODBURL,
  APP_URL: process.env.APP_URL,
  DISCORD_CLIENTID: process.env.DISCORD_CLIENTID,
  DISCORD_CLIENTSECRET: process.env.DISCORD_CLIENTSECRET,
  DISCORD_REDIRECTURI: process.env.DISCORD_REDIRECTURI,
  AUTHURL: process.env.AUTHURL,
  ADMINID: process.env.ADMINID,
  URL_SERVER_PORT: process.env.URL_SERVER_PORT,
  API_KEY: process.env.API_KEY,
  LOGINOPEN: process.env.LOGINOPEN,
};
