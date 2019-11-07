const express = require("express");
const AWS = require("aws-sdk");
const serverless = require("serverless-http");
const getrawdatafrommobile = require('./function')
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});
const app = express();

const getTask = badge_id => {
  var scanParams = {
    FilterExpression: "(badge_id = :badge_id)",
    ExpressionAttributeValues: {
      ":badge_id": badge_id
    },
    TableName: process.env.TABLE_NAME
  };

  
  return new Promise((resolve, reject) => {
    docClient
      .scan(scanParams)
      .promise()
      .then(data => {
        resolve(data.Items);
      })
      .catch(err => {
        reject(err);
      });
  });
};

app.get("/movement/:badge_id", (req, res) => {
  var badge_id = req.params.badge_id;
  getTask(badge_id)
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.status(502).json({ msg: "Could not get tasks", err: err });
    });
});

module.exports.handler = serverless(app);
