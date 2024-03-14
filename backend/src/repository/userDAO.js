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

const logger = require("../util/logger")

const client = new DynamoDBClient( {region: "us-east-2"} );

// getting the documentClient
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "superhero-battles-db";


async function registerUser(userObj) {
    const command = new PutCommand({
        TableName,
        Item: userObj
    })

    try {
        const result = await documentClient.send(command)
        return result;
    } catch (err) {
        logger.error(err);
        console.error(err);
        return null;
    }
}

async function getUser(username) {
    // return the user info
    const command = new QueryCommand({
        TableName,
        //FilterExpression: "#status = :status",
        KeyConditionExpression: "#username = :username AND #id = :user",
        ExpressionAttributeNames: { "#username": "username", '#id': 'id' },
        ExpressionAttributeValues: { ':username': username, ':user': 'user' } // Need :user because user is reserved word in DynamoDB
    });
    try {
        const data = await documentClient.send(command);
        
        return data;
    } catch (err) {
        logger.error(err);
        console.error(err);
        return null;
    }
}

async function getAllUsers() {

    const command = new QueryCommand({  //returns all users
        TableName,
        IndexName: "id-index",
        KeyConditionExpression: "#key = :value",
        ExpressionAttributeNames: { "#key": "id" },
        ExpressionAttributeValues: { ":value": 'user' } 
    });

    try
    {
        const data = await documentClient.send(command);

        if (data.Items.length == 0)
        {
            logger.error(`Failed to get any users!`);
            console.error(`Failed to get any users!`);
            return null;
        }

        return data;
    } 
    catch (err) 
    {
        logger.error(`Error getting all users: ${err}`);
        console.error(`Error getting all users: ${err}`);
    }
    return null;
}

/*async function getRecord(username) {
    // return a list of past battles
    const command = new QueryCommand({
        TableName,
        //FilterExpression: "#status = :status",
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: { "#username": "username" },
        ExpressionAttributeValues: { ':username': username }
    });
    try {
        const data = await documentClient.send(command);
        let receivedData = data.Items[0]; //does this code actually work?
        let user = {
            username: receivedData.username,
            player2: receivedData.player2,
            heroList1: receivedData.heroList1,
            heroList2: receivedData.heroList2,
            winner: receivedData.winner
        }
        return user;
    } catch (err) {
        logger.error(err);
        console.error(err);
        return null;
    }
}*/

// function to update user data
// modify any/all user fields, except username, password, id. all fields optional in req.
async function updateInfo(user) {

    const userKeys = Object.keys(user).filter(k => k !== "username" && k !== "id");

    const params = { //copied & adapted from https://dev.to/dvddpl/dynamodb-dynamic-method-to-insert-or-edit-an-item-5fnh
        TableName,
        UpdateExpression: `SET ${userKeys.map((k, index) => `#field${index} = :value${index}`).join(', ')}`,
        ExpressionAttributeNames: userKeys.reduce((accumulator, k, index) => ({
            ...accumulator,
            [`#field${index}`]: k
        }), {}),
        ExpressionAttributeValues: userKeys.reduce((accumulator, k, index) => ({
            ...accumulator,
            [`:value${index}`]: user[k]
        }), {}),
        Key: {
            username: user.username,
            id: "user"
        },
        ReturnValues: 'ALL_NEW'
    };

    const command = new UpdateCommand(params);

    try {
        const result = await documentClient.send(command);
        return result;
    }
    catch (err) {
        logger.error(err);
        console.error(err);
        return null;
    }
}

/*async function updateInfo(username, info) {
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
}*/

// update the battle record, increase counts of win/lose
// the outcome should be a string that indicates win or lose
async function updateRecord(username, outcome) {

    const expression = "";

    if (outcome === "win") {
        expression = "add wins :val"
    }
    else if (outcome === "lose") {
        expression = "add losses :val"
    }

    const updateCommand = new UpdateCommand({
        TableName,
        Key: { username: username, id: 'user' },
        UpdateExpression: expression,
        //ExpressionAttributeNames : {},
        ExpressionAttributeValues: { ":val": { "N": "1" } },
        ReturnValues: "ALL_NEW"
    });

    try {
        const result = await documentClient.send(updateCommand);
        //console.log(data);
        return result;
    } catch (err) {
        logger.error(err);
        console.error(err);
        return null;
    }
}

module.exports = {
    //getRecord,
    getUser,
    getAllUsers,
    updateInfo,
    updateRecord,
    registerUser
}