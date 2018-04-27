const express = require("express");
const mongoose = require("mongoose");
const apiRouter = require("./routes/api");
const { DB } = require("./config");
const bodyParser = require("body-parser");
const apiPage = require("./utils/api.json");
const app = express();
app.use(bodyParser());

mongoose.connect(DB).then(() => {
  console.log(`connected to ${DB}`);
});

app.get("/", (req, res, next) => {
  res.send(apiPage);
});

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  next({ status: 404, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err.status === 404) res.status(404).send({ message: err.message });
  else if (err.status === 400) res.status(400).send({ message: err.message });
  else res.status(500).send({ message: err.message });
});

module.exports = app;
