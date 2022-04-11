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


console.log('Loading function');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

// exports.handler = async(event,context) => {
exports.handler = function(event, context) {
	event.Records.forEach(function(record) {
	// for(const record of event.Records){
		console.log(record.eventID);
		console.log(record.eventName);
		console.log('DynamoDB Record: %j', record.dynamodb);
		var newPrice = record.dynamodb['NewImage']['currentPrice']['S'];
        var prevPrice = record.dynamodb['OldImage']['currentPrice']['S']; 
        var record_id = record.dynamodb['OldImage']['id']['S']; 
        
        //converting currPrice to float 
        newPrice = newPrice.slice(1);
        newPrice = parseFloat(newPrice);
        
        //converting prevPrice to float
        prevPrice = prevPrice.slice(1);
        prevPrice = parseFloat(prevPrice);
        
        if(newPrice < prevPrice){
            prevPrice = record.dynamodb['OldImage']['currentPrice']['S']; 
        	//update initialPrice in table to have value of prevPrice
        	updatePriceTable(record_id, prevPrice)
        	console.log('New price is lower... SEND NOTIFICATION');
        }
        
        else{
        	console.log('No change in price keep polling');
        }
        
	})
	
	return 'Succesfully processed ${event.Records.length} records.';
};



function updatePriceTable(record_id, update_price) {             
dynamodb.updateItem({
            'TableName': 'PriceDropItem-qm7yd6qh4feo3mycxyxf4jhf4q-dev',
            'Key': { 'id' : { 'S': record_id }},
            'UpdateExpression': 'SET initialPrice = :x',
            // 'ExpressionAttributeNames': {'initialPrice' : 'initialPrice'},
            'ExpressionAttributeValues': { 
            	':x' :  'update_price'         
}, function(err, data) {
            if (err) {
                console.log(err);
                context.fail("Error updating pricedrop table: ", err)
            } else {
                console.log("Updated price for item id %s", record_id);
                context.succeed("Successfully processed " + event.Records.length + " records.");
            }
        }
          
    } ); 
};