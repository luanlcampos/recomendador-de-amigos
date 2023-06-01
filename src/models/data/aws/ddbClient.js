const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

/*
Facilitate the conversion of JS types to DynamoDB types
@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/classes/_aws_sdk_lib_dynamodb.DynamoDBDocument.html#constructor
*/
const ddbLocalPort = process.env.AWS_DYNAMODB_LOCAL_PORT || 9000;
const ddbOfflineOptions = {
    region: "localhost",
    endpoint: `http://localhost:${ddbLocalPort}`
};

const clientDB = process.env.IS_OFFLINE ? new DynamoDBClient(ddbOfflineOptions) : new DynamoDBClient({ region: 'us-east-1' });

const clientDocDB = DynamoDBDocumentClient.from(clientDB);
module.exports = { clientDocDB };