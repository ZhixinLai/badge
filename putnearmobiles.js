const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});


// put al items
const PutNearMobiles = (data) => {

  var promiseList = [];
  // var UpdateExpression = 'SET record_time = :record_time, raw_x = :raw_x, ' +
  // 'raw_y = :raw_y, raw_z = :raw_z';


  var UpdateExpression = 'SET mac_address = :a, dataset_id = :dataset_id';

  var ExpressionAttributeValues = {
    ':a': data.a,
    ':dataset_id': data.dataset_id
  };
  
  console.log("ExpressionAttributeValues", ExpressionAttributeValues);

  var ddbparams = {
      TableName: process.env.NEAR_MOBILES_TABLE_NAME,
      Key: {
          'badge_id': data.badge_id,
          'time_stamp': data.time_stamp[0]
      },
      UpdateExpression: UpdateExpression,
      ExpressionAttributeValues: ExpressionAttributeValues
  };
  promiseList.push(docClient.update(ddbparams).promise());


  return Promise.all(promiseList);
};



module.exports.handler = (event, context, callback) => {
  console.log(event.toString());
  PutNearMobiles(event).then(result => {
    callback(null, {success:  true});
  }).catch(err => {
    callback(err);
  })
};
