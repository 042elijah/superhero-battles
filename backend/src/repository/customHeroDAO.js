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


// return the custom hero info
async function getCustomHero (username) {

    const command = new QueryCommand({
        TableName : userTable,
        //FilterExpression: "#status = :status",
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {':username': username }
    });

    try {
        const data = await documentClient.send(command);
        if (!data || data.Count == 0) throw new Error("No data received!");

        let hero = findCustomHero(data.Items); //find the custom hero in the data
        if (!hero) throw new Error("No customHero present in set!");

        return hero;

    } catch (error) {
        console.error(error);
        return null;
    }
}

//add new customHero
async function postCustomHero () {

}

//modify customHero
async function putCustomHero () {

}

//util: finds the first customHero in query response
function findCustomHero (data) {
    
    for ( let i = 0; i < data.length; i++ ) {     //iterate through returned Items,
        if ( data[i].id.charAt(0) == 'c' ) { //find the id that starts with c
            console.log(data[i]);
            return data[i];       //and save it
        }
    }
    return null;
}


module.exports = {
    getCustomHero,
    postCustomHero,
    putCustomHero
}