const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
});

const getMovementStateLastSecond = (dataset_id, badge_id, dateFrom, dateTo) => {
  var filterExpression = [
    "(time_stamp >= :dateFrom) AND (time_stamp <= :dateTo) AND (dataset_id = :dataset_id) AND (badge_id = :badge_id)"
  ];
  var expressionAttributeValues = {};
  expressionAttributeValues[":badge_id"] = badge_id;
  expressionAttributeValues[":dataset_id"] = dataset_id;
  expressionAttributeValues[":dateFrom"] = dateFrom;
  expressionAttributeValues[":dateTo"] = dateTo;

  var scanParams = {
    FilterExpression: filterExpression.join(" AND "),
    ExpressionAttributeValues: expressionAttributeValues,
    TableName: process.env.MOVEMENT_STATE_TABLE_NAME
  };  

  return new Promise((resolve, reject) => {
    docClient
      .scan(scanParams)
      .promise()
      .then(data => {
        resolve(data.Items);
      })
      .catch(err => {
        reject(err);
      });
  });
};

// put al items
const PutMovementState = (data) => {

  var promiseList = [];
  var sitstate = 0;
  var movestate = 0;
  var moveNum = 0;
  var moveNumAfterSit = 0;
  var sitflag1 = 0;
  var sitflag2 = 0;
  var sitflag3 = 0;
  var sit = 0;
  var standflag = 0;
  var stand = 0;
  var counter = 0;
  var sitstandPre = 0;

  var stateLastSecond = getMovementStateLastSecond(data.dataset_id, data.badge_id, data.time_stamp[0]-145, data.time_stamp[0]-120);
  
  return new Promise((resolve, reject) => {
    stateLastSecond
      .then(value => {
        if(value.length == 0) sitstandPre = 1;
        else sitstandPre = value[0].raw_x;
        for(var i = 0; i < (data.time_stamp.length); i++) 
        { 
          if((data.a[i] >= 2.5 || data.a[i] <= -2.5) 
          || (data.c[i] >= 2.5 || data.c[i] <= -2.5) 
          || (data.b[i] >= 9.8 + 2.5 || data.b[i] <= 9.8 - 2.5)) {
            moveNum = moveNum + 1;
          }
      
          if(data.b[i] < 9.8 - 4) {
            sitflag1 = 1;
          }
          if(sitflag1 == 1 && data.b[i] > 9.8 + 4.5){
            sitflag2 = 1;
          }
          if(sitflag2 == 1){
            if(data.b[i] >= 9.8 + 2.5 || data.b[i] <= 9.8 - 2.5) {
              moveNumAfterSit ++;
            }
          }
          
          if(moveNumAfterSit >= 8) {
            moveNumAfterSit = 0;
            sitflag1 = 0;
            sitflag2 = 0;
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
        
        if(sitflag2 == 1 && moveNumAfterSit < 8) {
          sit = 1;
        }
        
        if(sit == 1) {
          sitstate = 0;
        }else if(movestate == 4){
          sitstate = 1;
        }else{
          sitstate = sitstandPre;
        }
        
        // if(sit == 1 && counter <= 1) {
        //   sitstate = 0;
        // } else if (stand == 1 && counter <= 1) {
        //   sitstate = 2;
        // }else{
        //   sitstate = 1;
        // }
      
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
          
        Promise.all(promiseList)
          .then(function (results) {
            console.log("all promise has been successful!"); 
            resolve(results);
            
        })
          .catch(function (err){
            console.log(err);
        });          
      })
      .catch(err => {
        reject(err);
      });
  });
};  


const getMovementState = (dataset_id, query) => {
  var badge_id = query.badge_id;
  var dataFrom = query.dataFrom;
  var dataTo = query.dataTo;
  var filterExpression = [
    "(time_stamp >= :dateFrom) AND (time_stamp <= :dateTo) AND (dataset_id = :dataset_id)"
  ];

  if (badge_id !== undefined && badge_id !== null) {
    filterExpression.push("(badge_id = :badge_id)");
  }
  var expressionAttributeValues = {};
  if (badge_id !== undefined && badge_id !== null) {
    expressionAttributeValues[":badge_id"] = badge_id;
  }
  expressionAttributeValues[":dataset_id"] = dataset_id;
  expressionAttributeValues[":dateFrom"] =
    dataFrom !== undefined && dataFrom !== null ? Number.parseInt(dataFrom) : 0;
  expressionAttributeValues[":dateTo"] =
    dataTo !== undefined && dataTo !== null
      ? Number.parseInt(dataTo)
      : new Date().getTime();
  console.log("ExpressionAttributeValues", expressionAttributeValues);
  console.log("FilterExpression", filterExpression);
  var scanParams = {
    FilterExpression: filterExpression.join(" AND "),
    ExpressionAttributeValues: expressionAttributeValues,
    TableName: process.env.MOVEMENT_STATE_TABLE_NAME
  };

  return new Promise((resolve, reject) => {
    docClient
      .scan(scanParams)
      .promise()
      .then(data => {
        resolve(data.Items);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports.handler = (event, context, callback) => {
  console.log(event.toString());
  PutMovementState(event).then(result => {
    callback(null, {success:  true});
  }).catch(err => {
    callback(err);
  })
};
