const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});



// put al items
const PutMovementState = (data) => {

  var promiseList = [];
  var sitstate = 0;
  var movestate = 0;
  var moveNum = 0;
  var sitflag = 0;
  var sit = 0;
  var standflag = 0;
  var stand = 0;
  var counter = 0;


  for(var i = 0; i < (data.time_stamp.length); i++) 
  { 

    if((data.a[i] >= 2.5 || data.a[i] <= -2.5) 
    || (data.c[i] >= 2.5 || data.c[i] <= -2.5) 
    || (data.b[i] >= 9.8 + 2.5 || data.b[i] <= 9.8 - 2.5)) {
      moveNum = moveNum + 1;
    }

    if(data.b[i] < 9.8 - 3.2) {
      sitflag = 1;
    }
    if(sitflag == 1 && data.b[i] > 9.8 + 3.2){
      sit = 1;
      //counter++;
    }

    if(data.b[i] > 9.8 + 3) {
      standflag = 1;
    }
    if(standflag == 1 && data.b[i] < 9.8 - 3){
      stand = 1;
      //counter++;
    }
  }

  if(moveNum >= 4 * 4) {
    movestate = 4;
  } else {
    movestate = 3;
  }

  if(sit == 1 && counter <= 1) {
    sitstate = 0;
  } else if (stand == 1 && counter <= 1) {
    sitstate = 2;
  }else{
    sitstate = 1;
  }

  for(var i = 0; i < (data.time_stamp.length); i++) 
  { 
    var UpdateExpression = 'SET raw_x = :a, raw_y = :b, dataset_id = :dataset_id';

    var ExpressionAttributeValues = {
      ':a': sitstate,
      ':b': movestate,
      ':dataset_id': data.dataset_id
    };
    
    console.log("ExpressionAttributeValues", ExpressionAttributeValues);
  
    var ddbparams = {
        TableName: process.env.MOVEMENT_STATE_TABLE_NAME,
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
  PutMovementState(event).then(result => {
    callback(null, {success:  true});
  }).catch(err => {
    callback(err);
  })
};
