const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});


// put al items
const PutDatasetMeta = (data) => {


  var UpdateExpression = 'SET dataset_name = :a, time_stamp = :b, description = :c, numberofBadges = :d, admin = :e';

  var ExpressionAttributeValues = {
    ':a': data.a,
    ':b': data.b,
    ':c': data.c,
    ':d': data.d,
    ':e': data.e,
  };
  
  console.log("ExpressionAttributeValues", ExpressionAttributeValues);

  var ddbparams = {
      TableName: process.env.DATA_SET_META_DATA_TABLE_NAME,
      Key: {
          'dataset_id': data.dataset_id
      },
      UpdateExpression: UpdateExpression,
      ExpressionAttributeValues: ExpressionAttributeValues
  };
  return docClient.update(ddbparams).promise();

};



module.exports.handler = (event, context, callback) => {
  console.log(event.toString());
  PutDatasetMeta(event).then(result => {
    callback(null, {success:  true});
  }).catch(err => {
    callback(err);
  })
};
