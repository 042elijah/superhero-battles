const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    QueryCommand,
    ScanCommand
} = require("@aws-sdk/lib-dynamodb");

const documentClient = DynamoDBDocumentClient.from(client);

const userTable = "superhero-battles-db";

const client = new DynamoDBClient({ region: "us-west-1" });