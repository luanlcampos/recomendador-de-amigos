const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const clientDB = new DynamoDBClient({ region: 'us-east-1' });
/*
Facilitate the conversion of JS types to DynamoDB types
@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/classes/_aws_sdk_lib_dynamodb.DynamoDBDocument.html#constructor
*/
const clientDocDB = DynamoDBDocumentClient.from(clientDB);
module.exports = { clientDocDB };