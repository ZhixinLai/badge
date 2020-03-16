const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});


// put al items
const PutBadgeMeta = (data) => {

    var UpdateExpression = 'SET mac_address = :a, user_name = :b, user_id = :c, password= :d, time_stamp = :time_stamp';

    var ExpressionAttributeValues = {
      ':a': data.a,
      ':b': data.b,
      ':c': data.c,
      ':d': data.d,
      ':time_stamp': data.time_stamp
    };
    
    console.log("ExpressionAttributeValues", ExpressionAttributeValues);
  
    var ddbparams = {
        TableName: process.env.BADGE_META_DATA_TABLE_NAME,
        Key: {
            'badge_id': data.badge_id,
            'dataset_id': data.dataset_id
        },
        UpdateExpression: UpdateExpression,
        ExpressionAttributeValues: ExpressionAttributeValues
    };
    return docClient.update(ddbparams).promise();
};




module.exports.handler = (event, context, callback) => {
  console.log(event.toString());
  PutBadgeMeta(event).then(result => {
    callback(null, {success:  true});
  }).catch(err => {
    callback(err);
  })
};
