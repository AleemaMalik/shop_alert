import AWS from 'aws-sdk'; 
// ES5 example
const { CloudWatchLogsClient, AssociateKmsKeyCommand } = require("@aws-sdk/client-cloudwatch-logs");

// a client can be shared by different commands.
const client = new CloudWatchLogsClient({ region: "us-east-1" });

// const params = {
//   /** input parameters */
// };
const command = new AssociateKmsKeyCommand(params);

// async/await.
try {
    const data = await client.send(command);
    // process data.
  } catch (error) {
    // error handling.
  } finally {
    // finally.
  }

  client.send(command).then(
    (data) => {
      // process data.
    },
    (error) => {
      // error handling.
    }
  );

  client
  .send(command)
  .then((data) => {
    // process data.
  })
  .catch((error) => {
    // error handling.
  })
  .finally(() => {
    // finally.
  });


const cloudwatchlogs = new AWS.CloudWatchLogs({apiVersion: '2014-03-28'});

const params = {
  logGroupName: '/aws/lambda/dynamodb-lambda-stream', /* required */
  logStreamName: 'STRING_VALUE', /* required */
  endTime: 'NUMBER_VALUE',
  limit: 'NUMBER_VALUE',
  nextToken: 'STRING_VALUE',
  startFromHead: true || false,
  startTime: 'NUMBER_VALUE'
};

cloudwatchlogs.getLogEvents(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});