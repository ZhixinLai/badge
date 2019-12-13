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
      TableName: process.env.BADGE_DATA_TABLE_NAME
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
  var scanParams = {
    TableName: process.env.BADGE_DATA_TABLE_NAME
  };

  return new Promise((resolve, reject) => {
    docClient.scan(scanParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(data.Items);
      }
    });
  });
};

module.exports = {
  getBadgeMetaData: getBadgeMetaData,
  getAllBadgeMetaData: getAllBadgeMetaData
};
