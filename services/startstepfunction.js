const AWS = require("aws-sdk");
const StepFunctions = new AWS.StepFunctions(); 

const StartExecution = (input) => {
  console.log(input);
  var params = {
    stateMachineArn: process.env.STATE_MACHINE_ARN, 
    input: JSON.stringify(input)
  };

  return new Promise((resolve, reject) => {
    StepFunctions.startExecution(params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data.executionArn);
    })
  });
}

const CheckStatus = (executionArn) => {
  var params = {
    executionArn: executionArn
  };
  return new Promise((resolve, reject) => {
    StepFunctions.describeExecution(params, (err, data) => {
      if (err) {
        reject(err);
      }
      if (data.status == 'FAILED') {
        reject('StepFunctions failed');
      } else {
        resolve(data.status);
      }
    });
  })
}

const GetFromMobile = (input) => {
  return new Promise((resolve, reject) => {
    StartExecution(input).then(executionArn => {
      setTimeout(() => {
        CheckStatus(executionArn).then(status => {
          resolve(status);
        }).catch(err => {
          reject(err);
        })   
      }, 3000) 
    }).catch(err => {
      reject(err);
    })
  });
}

module.exports = GetFromMobile;