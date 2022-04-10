// https://medium.com/aws-activate-startup-blog/building-dynamic-dashboards-using-aws-lambda-and-amazon-dynamodb-streams-part-ii-b2d883bebde5
// aaconsole.log('Loading event');
// var AWS = require('aws-sdk');
// var dynamodb = new AWS.DynamoDB();
// exports.handler = function(event, context) {
   
//     var newPrice = 0;
//     var oldPrice = 0;

// event.Records.forEach(function(record) {
//         var currPrice = record.dynamodb['NewImage']['currentPrice']['S'];
//         var initPrice = record.dynamodb['OldImage']['initialPrice']['S'];        

//         if (currPrice < initPrice) {
//             newPrice = currPrice;
//             oldPrice = initPrice;
//         } 
//     }); 
   
//     var priceDropTable = 
//     updatePriceDropTable
// //     // Update the aggregation table with the total of RED, GREEN, and BLUE 
// //     // votes received from this series of updates    
// // var aggregatesTable = 'VoteAppAggregates';
// //     if (totalRed > 0) updateAggregateForColor("RED", totalRed);
// //     if (totalBlue > 0) updateAggregateForColor("BLUE", totalBlue);
// //     if (totalGreen > 0) updateAggregateForColor("GREEN", totalGreen);   

// function updatePriceDropTable(votedFor, numVotes) {             
// dynamodb.updateItem({
//             'TableName': aggregatesTable,
//             'Key': { 'VotedFor' : { 'S': votedFor }},
//             'UpdateExpression': 'add #vote :x',
//             'ExpressionAttributeNames': {'#vote' : 'Vote'},
//             'ExpressionAttributeValues': { ':x' : { "N" : numVotes.toString() }         
// }, function(err, data) {
//             if (err) {
//                 console.log(err);
//                 context.fail("Error updating Aggregates table: ", err)
//             } else {
//                 console.log("Vote received for %s", votedFor);
//                 context.succeed("Successfully processed " + event.Records.length + " records.");
//             }
//         });    
//     }
// };