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

async function getPastBattleByUsername(username) {
    const command = new QueryCommand({
        TableName : "superhero-battles-db",
        //FilterExpression: "#status = :status",
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {':username': username }
    });
    try {
        const data = await documentClient.send(command);
        let receivedData = data.Items;
        let list = [];

        receivedData.forEach((item) => {
            // get the item.id starts with letter b, which indicates that is a battle record
            if(item.id.charAt(0) == "b"){
                let record = {
                    username : item.username,
                    heroList1 : item.heroList1,
                    player2 : item.player2,
                    heroList2 : item.heroList2,
                    winner : item.winner
                }
                list.push(record);
            }
        });
        return list;
    } catch (error) {
        console.log(error);
        throw new Error("Error on pastBattleDAO!");     
    }
}

async function getPastBattleByBattleID(username, battleID) {
    const command = new GetCommand({
        TableName : "superhero-battles-db",
        Key : {
            username : username,
            id : battleID
        }
    });
    try {
        const data = await documentClient.send(command);
        
        return data.Item;
    } catch (error) {
        console.log(error);
        throw new Error("Error on pastBattleDAO!");     
    }
}

async function getLeaderBoard() {
    const command = new QueryCommand({
        TableName : "superhero-battles-db",
        IndexName : "id-wins-index",
        KeyConditionExpression: "#key = :value",
        ExpressionAttributeNames: { "#key": "id" },
        ExpressionAttributeValues: { ":value": 'user' },
        Limit : 10,
        ScanIndexForward : false,
        ProjectionExpression : "username, alignment, wins",
    })
    try {
        const data = await documentClient.send(command);
        return data.Items;
    } catch (error) {
        
    }

}

module.exports = {
    getPastBattleByUsername,
    getPastBattleByBattleID,
    getLeaderBoard
}