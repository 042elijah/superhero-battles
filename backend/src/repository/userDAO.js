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

const client = new DynamoDBClient({ region: "us-east-2" });
 
// getting the documentClient
const documentClient = DynamoDBDocumentClient.from(client);

const userTable = "superhero-battles-db";

async function getUser(username) {
    // return the user info
    const command = new QueryCommand({
        TableName: userTable,
        //FilterExpression: "#status = :status",
        KeyConditionExpression: "#username = :username AND #id = :user",
        ExpressionAttributeNames: {"#username": "username", '#id': 'id' },
        ExpressionAttributeValues: {':username': username, ':user': 'user' } // Need :user because user is reserved word in DynamoDB
    });
    try {
        const data = await documentClient.send(command);
        let receivedData = data.Items[0];
        let user = {
            username: receivedData.username,
            avatar: receivedData.avatar,
            alignment: receivedData.alignment,
            followers: receivedData.followers,
            following: receivedData.following,
            wins: receivedData.wins,
            losses: receivedData.losses
        }
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getRecord(username) {
    // return a list of past battles
    const command = new QueryCommand({
        TableName : userTable,
        //FilterExpression: "#status = :status",
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {':username': username }
    });
    try {
        const data = await documentClient.send(command);
        let receivedData = data.Items[0];
        let user = {
            username: receivedData.username,
            player2: receivedData.player2,
            heroList1 : receivedData.heroList1,
            heroList2 : receivedData.heroList2,
            winner : receivedData.winner
        }
        return user;
    } catch (error) {
        return null;
    }
}

async function getCustomHero(username) {
    // return the custom hero info
    const command = new QueryCommand({
        TableName : userTable,
        //FilterExpression: "#status = :status",
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {':username': username }
    });
    try {
        const data = await documentClient.send(command);
        let receivedData = data.Items[0];
        let hero = {
            username: receivedData.username,
            heroName: receivedData.heroName,
            description : receivedData.description,
            backstory : receivedData.backstory,
            stats : receivedData.stats
        }
        return hero;
    } catch (error) {
        return null;
    }
}

// function that allows user change the avatar and alignment 
async function updateInfo(username, info) {
    const updateCommand = new UpdateCommand({
        TableName : userTable,
        Key : {
            username: username,
            id: 'user'
        },
        UpdateExpression : "set #avatar = :avatar, #alignment = :alignment",
        ExpressionAttributeNames : {"#avatar" : "avatar", "#alignment" : "alignment"},
        ExpressionAttributeValues:{":avatar" : info.avatar, ":alignment" : info.alignment},
        ReturnValues : "ALL_NEW"
    });

    try {
        const data = await documentClient.send(updateCommand);
        //console.log(data);
        return "Update Success!";
    } catch (error) {
        console.error(error);
        return null;
    }
}

// update the battle record, increase counts of win/lose
// the outcome should be a string that indicates win or lose
async function updateRecord(username, outcome) {

    const expression = "";

    if(outcome === "win"){
        expression = "add wins :val"
    }
    else if(outcome === "lose"){
        expression = "add losses :val"
    } 

    const updateCommand = new UpdateCommand({
        TableName : userTable,
        Key : {username : username},
        UpdateExpression : expression,
        //ExpressionAttributeNames : {},
        ExpressionAttributeValues:{":val" : {"N" : "1"}},
        ReturnValues : "ALL_NEW"
    });

    try {
        const data = await documentClient.send(updateCommand);
        //console.log(data);
        return "Update Success!";
    } catch (error) {
        return null;
    }
}

module.exports = {
    getRecord,
    getUser,
    getCustomHero,
    updateInfo,
    updateRecord
}