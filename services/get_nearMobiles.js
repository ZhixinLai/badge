const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});

const getNearMobiles = (dataset_id, query) => {
  var badge_id = query.badge_id;
  var dataFrom = query.dataFrom;
  var dataTo = query.dataTo;
  var filterExpression = [
    "(time_stamp >= :dateFrom) AND (time_stamp <= :dateTo) AND (dataset_id = :dataset_id)"
  ];

  if (badge_id !== undefined && badge_id !== null) {
    filterExpression.push("(badge_id = :badge_id)");
  }
  var expressionAttributeValues = {};
  if (badge_id !== undefined && badge_id !== null) {
    expressionAttributeValues[":badge_id"] = badge_id;
  }
  expressionAttributeValues[":dataset_id"] = dataset_id;
  expressionAttributeValues[":dateFrom"] =
    dataFrom !== undefined && dataFrom !== null ? Number.parseInt(dataFrom) : 0;
  expressionAttributeValues[":dateTo"] =
    dataTo !== undefined && dataTo !== null
      ? Number.parseInt(dataTo)
      : new Date().getTime();
  console.log("ExpressionAttributeValues", expressionAttributeValues);
  console.log("FilterExpression", filterExpression);
  var scanParams = {
    FilterExpression: filterExpression.join(" AND "),
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
