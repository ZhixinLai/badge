const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});

const getBadgeMetaData = (dataset_id, badge_id) => {
  return new Promise((resolve, reject) => {
    var getParams = {
      Key: {
        badge_id: badge_id,
        dataset_id: dataset_id
      },
      TableName: process.env.BADGE_META_DATA_TABLE_NAME
    };
    docClient
      .get(getParams)
      .promise()
      .then(data => {
        resolve(data.Item);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getAllBadgeMetaData = query => {
  var dataset_id = query.dataset_id;
  var mac_address = query.mac_address;
  var expressionAttributeValues = {};
  expressionAttributeValues[":dataset_id"] = dataset_id;
  if (mac_address !== undefined && mac_address !== null) {
    expressionAttributeValues[":mac_address"] = mac_address;
  }
  var filterExpression = ["(dataset_id = :dataset_id)"];
  if (mac_address !== undefined && mac_address !== null) {
    filterExpression.push("(mac_address = :mac_address)");
  }
  console.log("ExpressionAttributeValues", expressionAttributeValues);
  var scanParams = {
    ExpressionAttributeValues: expressionAttributeValues,
    FilterExpression: filterExpression.join(" AND "),
    TableName: process.env.BADGE_META_DATA_TABLE_NAME
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

// const getAllBadgeMetaData = query => {
//   let dataset_id = query.dataset_id;
//   var scanParams = {
//     TableName: process.env.BADGE_META_DATA_TABLE_NAME,
//     FilterExpression: "dataset_id = :dataset_id",
//     ExpressionAttributeValues: { ":dataset_id": dataset_id }
//   };

//   return new Promise((resolve, reject) => {
//     docClient.scan(scanParams, (err, data) => {
//       if (err) {
//         console.log(err);
//         reject(err);
//       } else {
//         resolve(data.Items);
//       }
//     });
//   });
// };

module.exports = {
  getBadgeMetaData: getBadgeMetaData,
  getAllBadgeMetaData: getAllBadgeMetaData
  //getBadgeIDBasedOnMac: getBadgeIDBasedOnMac
};
