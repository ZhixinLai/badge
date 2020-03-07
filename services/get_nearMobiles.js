const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});

const getNearMobiles = (badge_id, query) => {
  var dataFrom = query.dataFrom;
  var dataTo = query.dataTo;
  var filterExpression =
    "(time_stamp >= :dateFrom) AND (time_stamp <= :dateTo) AND (badge_id = :badge_id)";
  var expressionAttributeValues = {};
  expressionAttributeValues[":badge_id"] = badge_id;
  expressionAttributeValues[":dateFrom"] =
    dataFrom !== undefined && dataFrom !== null ? Number.parseInt(dataFrom) : 0;
  expressionAttributeValues[":dateTo"] =
    dataTo !== undefined && dataTo !== null
      ? Number.parseInt(dataTo)
      : new Date().getTime();
  var scanParams = {
    FilterExpression: filterExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    TableName: process.env.NEAR_MOBILES_TABLE_NAME
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
module.exports = getNearMobiles;
