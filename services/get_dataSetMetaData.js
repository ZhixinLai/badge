const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});

const getDataSetMetaData = dataset_id => {
  return new Promise((resolve, reject) => {
    var getParams = {
      Key: {
        dataset_id: dataset_id
      },
      TableName: process.env.DATA_SET_META_DATA_TABLE_NAME
    };
    docClient
      .get(getParams)
      .promise()
      .then(data => {
        console.log(data.Item);
        resolve(data.Item);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const getAllDataSetMetaData = query => {
  var scanParams = {
    TableName: process.env.DATA_SET_META_DATA_TABLE_NAME
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
  getDataSetMetaData: getDataSetMetaData,
  getAllDataSetMetaData: getAllDataSetMetaData
};
