const express = require("express");
const axios = require("axios");
const { URL_SERVER_PORT, API_KEY } = require("../config");

const app = express();
const PORT = URL_SERVER_PORT || 3001;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "No slug found" });
});

app.get("/:slug", (req, res) => {
  const slug = req.url.split("/")[1];
  const apiKey = API_KEY;

  if (!slug) {
    return res.status(400).json({ error: "No slug provided" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
