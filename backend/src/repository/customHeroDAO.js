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

const TableName = "superhero-battles-db";


// get the custom hero info
async function getCustomHero (username) {

    const command = new QueryCommand({
        TableName,
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

//modify or add customHero
//requires id!
async function updateCustomHero (hero) {

    const heroKeys = Object.keys(hero).filter(k => k !== "username" && k !== "id");

    const params = { //copied & adapted from https://dev.to/dvddpl/dynamodb-dynamic-method-to-insert-or-edit-an-item-5fnh
        TableName,
        UpdateExpression: `SET ${heroKeys.map((k, index) => `#field${index} = :value${index}`).join(', ')}`,
        ExpressionAttributeNames: heroKeys.reduce((accumulator, k, index) => ({
            ...accumulator,
            [`#field${index}`]: k
        }), {}),
        ExpressionAttributeValues: heroKeys.reduce((accumulator, k, index) => ({
            ...accumulator,
            [`:value${index}`]: hero[k]
        }), {}),
        Key: {
            username: hero.username,
            id: hero.id
        },
        ReturnValues: 'ALL_NEW'
    };

    const command = new UpdateCommand(params);

    try {
        const result = await documentClient.send(command);
        return result;
    }
    catch (err) {
        console.error(err);
    }
    return null;

}

//UTILITY: finds the first customHero in an array of a query response
function findCustomHero (data) {
    
    for ( let i = 0; i < data.length; i++ ) {     //iterate through returned Items,
        if ( data[i].id.charAt(0) == 'c' ) { //find the id that starts with c
            //console.log(data[i]);
            return data[i];       //and save it
        }
    }
    return null;
}


module.exports = {
    getCustomHero,
    //postCustomHero,
    updateCustomHero
}





//DEPRECATED
//add new customHero
async function postCustomHero (hero) {

    const command = new PutCommand({
        TableName,
        Item: hero
    });

    try {
        const result = await documentClient.send(command);
        return result;
    }
    catch (err) {
        console.error(err);
    }
    return null;
}