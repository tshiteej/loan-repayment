"use strict";

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { dbConnect } = require("./utils/InitApp");

// const profileRouters = require("./routes/profile");
// const commentsRouters = require("./routes/comments");
// console.log(profileRouters);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

(async () => {
  await dbConnect();
})();
// set the view engine to ejs
app.set("view engine", "ejs");

// routes
// app.use("/comments", commentsRouters);
// app.use("/", profileRouters);

// start server
const server = app.listen(port);
console.log("Express started. Listening on %s", port);