const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
}); // 这两部分的关系？

// lambda function 语法
const PutPath = (path_data) => {
  // var UpdateExpression = 'SET record_time = :record_time, raw_x = :raw_x, ' +
  // 'raw_y = :raw_y, raw_z = :raw_z';

  var UpdateExpression = 'SET raw_x = :raw_x, raw_y = :raw_y, raw_z = :raw_z, dataset_id = :dataset_id';

  var ExpressionAttributeValues = {
    // ':record_time': data.timestamp,
    ':raw_x': path_data.x,
    ':raw_y': path_data.y,
    ':raw_z': path_data.z,
    ':dataset_id': path_data.dataset_id
  };

  console.log("ExpressionAttributeValues", ExpressionAttributeValues);

  var ddbparams = {
      TableName: process.env.MOVEMENT_TABLE_NAME,
      Key: {
          'badge_id': path_data.badge_id,
          'time_stamp': path_data.time_stamp
      },
      UpdateExpression: UpdateExpression,
      ExpressionAttributeValues: ExpressionAttributeValues
  };
  return docClient.update(ddbparams).promise() ;  

}

// put Voice data into the database
const PutVoice = (voice_data) => {
  // var UpdateExpression = 'SET record_time = :record_time, raw_x = :raw_x, ' +
  // 'raw_f = :raw_f, raw_m = :raw_m';

  var UpdateExpression = 'SET raw_f = :raw_f, raw_m = :raw_m, dataset_id = :dataset_id';

  var ExpressionAttributeValues = {
    // ':record_time': data.timestamp,
    ':raw_f': voice_data.f,
    ':raw_m': voice_data.m,
    ':dataset_id': voice_data.dataset_id
  };

  console.log("ExpressionAttributeValues", ExpressionAttributeValues);

  var ddbparams = {
      TableName: process.env.VOICE_TABLE_NAME,
      Key: {
          'badge_id': voice_data.badge_id,
          'time_stamp': voice_data.time_stamp
      },
      UpdateExpression: UpdateExpression,
      ExpressionAttributeValues: ExpressionAttributeValues
  };
  return docClient.update(ddbparams).promise();
}

// put al items
const PutItem = (data) => {
  // var UpdateExpression = 'SET record_time = :record_time, raw_x = :raw_x, ' +
  // 'raw_y = :raw_y, raw_z = :raw_z';

  for(var i=0; i < data.path_data.time_stamp.length(); i++) 
  { 
    var path_d = {
      ':x': data.path_data.x[i],
      ':y': data.path_data.y[i],
      ':z': data.path_data.z[i],
      ':dataset_id': data.path_data.dataset_id,
      ':badge_id': data.path_data.badge_id,
      ':time_stamp': data.path_data.time_stamp[i]
    }

    PutPath(path_d);
  }

  for(var i=0; i < data.voice_data.time_stamp.length(); i++) 
  { 
    var voice_d = {
      ':f': data.voice_data.f[i],
      ':m': data.voice_data.m[i],
      ':dataset_id': data.voice_data.dataset_id,
      ':badge_id': data.voice_data.badge_id,
      ':time_stamp': data.voice_data.time_stamp[i]
    }
    PutVoice(voice_d);
  }
  return docClient.update(ddbparams).promise() ;
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
  PutItem(event).then(result => {
    callback(null, {success:  true});
  }).catch(err => {
    callback(err);
  })
};
