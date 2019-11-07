"use strict";

const express = require("express");
const app = express();
const serverless = require("serverless-http");
const router = require("./api/apis");

app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  });
  next();
});

app.use("/api", router);

module.exports.handler = serverless(app);
