const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
}); // 这两部分的关系？

// lambda function 语法

const PutItem = (data) => {
  // var UpdateExpression = 'SET record_time = :record_time, raw_x = :raw_x, ' +
        // 'raw_y = :raw_y, raw_z = :raw_z';
  var UpdateExpression = 'SET raw_x = :raw_x, raw_y = :raw_y, raw_z = :raw_z, dataset_id = :dataset_id';


  var ExpressionAttributeValues = {
    // ':record_time': data.timestamp,
    ':raw_x': data.x,
    ':raw_y': data.y,
    ':raw_z': data.z,
    ':dataset_id': data.dataset_id
  };

  console.log("ExpressionAttributeValues", ExpressionAttributeValues);

  var ddbparams = {
      TableName: process.env.TABLE_NAME,
      Key: {
          'badge_id': data.badge_id,
          'time_stamp': data.time_stamp
      },
      UpdateExpression: UpdateExpression,
      ExpressionAttributeValues: ExpressionAttributeValues
  };

  return docClient.update(ddbparams).promise() ;
};

module.exports.handler = (event, context, callback) => {
  console.log(event.toString());
  PutItem(event).then(result => {
    callback(null, {success:  true});
  }).catch(err => {
    callback(err);
  })
};
