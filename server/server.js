const express = require("express");
const axios = require("axios");
const { URL_SERVER_PORT, API_KEY } = require("../config");
const { headers } = require("next/headers");

const app = express();
const PORT = URL_SERVER_PORT || 3001;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "No slug found" });
});

app.get("/:slug", async (req, res) => {
  const slug = req.url.split("/")[1];
  const apiKey = API_KEY;

  if (!slug) {
    return res.status(400).json({ error: "No slug provided" });
  }

  if (!apiKey) {
    return res.status(400).json({ error: "No API Key provided" });
  }

  try {
    const response = await axios.get(
      `${process.env.LINKHOSTURL}/api/v1/getlink`,
      {
        headers: {
          Authorization: apiKey,
          Slug: slug,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log(response.data.data);

      res.redirect(response.data.data.Redirect);
    } else {
      res.status(404).json({ error: "Slug not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
