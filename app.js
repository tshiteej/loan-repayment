"use strict";

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { dbConnect } = require("./utils/InitApp");

const authRoute = require("./routes/auth");
const loanRoute = require("./routes/loan");
const adminRoute = require("./routes/admin");
const index = require("./routes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

(async () => {
  await dbConnect();
})();

// routes

app.use("/auth", authRoute);
app.use("/loan", loanRoute);
app.use("/admin", adminRoute);
app.use("/", index);

// start server
const server = app.listen(port);
console.log("Express started. Listening on %s", port);
