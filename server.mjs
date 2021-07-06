import nodeFetch from "node-fetch";
import { createApi } from "unsplash-js";
// const Unsplash = require('unsplash-js').default; // There are multiple exports -- we want the default
// const toJson = require('unsplash-js').toJson;
import express from "express";

const unsplash = createApi({
  accessKey: "kYIKg9MQdMdZreBJpepbHmZsjG6zUfP7NWbi0zypCco",
  fetch: nodeFetch,
});

const app = express();

app.get("/api/photos/search", (req, res) => {
  unsplash.search
    .getPhotos({
      query: req.query.term,
      page: req.query.page,
      perPage: req.query.count,
    })
    // .then(toJson)
    .then((json) => res.json(json));
});

app.get("/api/photos/random", (req, res) => {
  unsplash.photos
    .getRandom()
    // .then(toJson)
    .then((json) => res.json(json));
});

app.get("/api/photos", (req, res) => {
  unsplash.photos
    // Using the URL /api/photos?start=1, req.query.start, a query parameter, will grab the 1 (in a URL, the query starts with a question mark - the question mark is used as a separator, and is not part of the query string)
    .list(req.query.page, req.query.perPage)
    // .then(toJson)
    .then((json) => res.json(json));
});

// Necessary for successful deploy to Heroku, along with adding the heroku-postbuild that goes into client, runs npm install and npm build, and adding config keys in Heroku project settings
if (process.env.NODE_ENV) {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
