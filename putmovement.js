const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});



// put al items
const PutMovement = (data) => {

  var promiseList = [];

  for(var i = 0; i < data.time_stamp.length; i++) 
  { 
    var UpdateExpression = 'SET raw_x = :raw_x, raw_y = :raw_y, raw_z = :raw_z, dataset_id = :dataset_id';

    var ExpressionAttributeValues = {
      ':raw_x': data.x[i],
      ':raw_y': data.y[i],
      ':raw_z': data.z[i],
      ':dataset_id': data.dataset_id
    };
    
    console.log("ExpressionAttributeValues", ExpressionAttributeValues);
  
    var ddbparams = {
        TableName: process.env.MOVEMENT_TABLE_NAME,
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

const speed_get = (data) => {

  var a_stride = new Array();

  a_stride = [1, 1, 1, 1];


  var fft = require('fft-js').fft,
  fftUtil = require('fft-js').util;


  var phasors= fft(a_stride);

  var frequencies = fftUtil.fftFreq(phasors, 80), // Sample rate and coef is just used for length, and frequency step
    magnitudes = fftUtil.fftMag(phasors);

  var fre_mag = frequencies.map(function (f, ix) {
    return {frequency: f, magnitude: magnitudes[ix]};
  });
  return fre_mag;

}


module.exports.handler = (event, context, callback) => {
  console.log(event.toString());
  PutMovement(event).then(result => {
    callback(null, {success:  true});
  }).catch(err => {
    callback(err);
  })
};
