const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});


// put al items
const PutMeta = (data) => {

  var promiseList = [];
  // var UpdateExpression = 'SET record_time = :record_time, raw_x = :raw_x, ' +
  // 'raw_y = :raw_y, raw_z = :raw_z';

  for(var i = 0; i < data.time_stamp.length; i++) 
  { 
    var UpdateExpression = 'SET mac_id = :a, user_name = :b, user_id = :c, time_stamp = :time_stamp';

    var ExpressionAttributeValues = {
      ':a': data.a[i],
      ':b': data.b[i],
      ':c': data.c[i],
      ':time_stamp': data.time_stamp[i]
    };
    
    console.log("ExpressionAttributeValues", ExpressionAttributeValues);
  
    var ddbparams = {
        TableName: process.env.META_TABLE_NAME,
        Key: {
            'badge_id': data.badge_id,
            'dataset_id': data.dataset_id
        },
        UpdateExpression: UpdateExpression,
        ExpressionAttributeValues: ExpressionAttributeValues
    };
    promiseList.push(docClient.update(ddbparams).promise());
  }

  return Promise.all(promiseList);
};



module.exports.handler = (event, context, callback) => {
  console.log(event.toString());
  PutMeta(event).then(result => {
    callback(null, {success:  true});
  }).catch(err => {
    callback(err);
  })
};
