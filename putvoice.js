const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});


// put al items
const PutVoice = (data) => {

  var promiseList = [];
  // var UpdateExpression = 'SET record_time = :record_time, raw_x = :raw_x, ' +
  // 'raw_y = :raw_y, raw_z = :raw_z';

  for(var i = 0; i < data.time_stamp.length; i++) 
  { 
    var UpdateExpression = 'SET raw_f = :a, raw_m = :b, dataset_id = :dataset_id';

    var ExpressionAttributeValues = {
      ':a': data.a[i],
      ':b': data.b[i],
      ':dataset_id': data.dataset_id
    };
    
    console.log("ExpressionAttributeValues", ExpressionAttributeValues);
  
    var ddbparams = {
        TableName: process.env.VOICE_TABLE_NAME,
        Key: {
            'badge_id': data.badge_id,
            'time_stamp': data.time_stamp[i]
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
  PutVoice(event).then(result => {
    callback(null, {success:  true});
  }).catch(err => {
    callback(err);
  })
};
