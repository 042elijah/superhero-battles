const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand
} = require("@aws-sdk/lib-dynamodb")

const client = new DynamoDBClient({ region: "us-east-2" });
 
// getting the documentClient
const documentClient = DynamoDBDocumentClient.from(client);

async function getPastBattle(username) {
    const command = new QueryCommand({
        TableName : "superhero-battles-db",
        //FilterExpression: "#status = :status",
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {':username': username }
    });
    try {
        const data = await documentClient.send(command);
        // an array, need to organize it
        let receivedData = data.Items;
        let list = [];
        receivedData.forEach((item) => {
            let record = {
                username : item.username,
                heroList1 : item.heroList1,
                player2 : item.player2,
                heroList2 : item.heroList2,
                winner : item.winner
            }
            list.push(record)
        });
        return list;
    } catch (error) {
        console.log(error);
        throw new Error("Error on pastBattleDAO!");     
    }
}