const userService = require('../../service/userService');

const userDAO = require("../../repository/userDAO");

const { generateJWT, hashPassword, validatePassword } = require('./auth');

const validate = require('../validate');

async function dataValidation (username, password) {
    const daoData = await userDAO.getUser(username);
    let dataChecks = {
        username: null,
        password: null,
        exists: null
    }
    // check if account exits in db
    if (daoData.Items != `${[]}`) dataChecks.exists = true;
    else dataChecks.exists = false;
    // check if password is valid
    if ((password === password.split(' ').join('')) && password.length > 5 ) dataChecks.password = true
    else dataChecks.password = false;
    // check if username is valid
    if ((username === username.split(' ').join('')) && username.length < 50) dataChecks.username = true;
    else dataChecks.username = false;
    // return object with checks to validate as needed
    return dataChecks;
}

//===== Post - Register a new account
//expects data like {username: String, password: String}
async function registerUser(data) {

    if (!("username" in data) || !("password" in data)) return [400, "Invalid request body"];

    let username = data.username;
    let password = data.password;
    let dataCheck = await dataValidation(username, password);
    
    if (dataCheck.exists == true) return [401, "Username already in use"];
    
    if (dataCheck.password == false) return [401, "Invalid password. Must be at least 5 characters with no spaces"]
    
    if (dataCheck.username == false) return [401, "Invalid userame. Must be less than 50 characters with no spaces"]

    let userObj = {
        username: username,
        id: "user",
        avatar: null,
        password: `${await hashPassword(password)}`,
        alignment: null,
        followers: 0,
        following: 0,
        wins: 0,
        losses: 0
    }
    //if data is returned then return status 201 and positive, if null then 400
    const daoData = await userDAO.registerUser(userObj);
    if (daoData) {
        return [201, "Account Successfully created"];
    } else return [400, "An unknown error has occured with account registration"]

}

//===== Post - Login to an account
//expects data like {username: String, password: String}
async function loginUser(data) {
    
    if (!("username" in data) || !("password" in data)) return [400, "Invalid request body"];

    let { username, password } = data;

    //evaluate data validity
    if(!validate.validateUsername(username)) {
        return null;
    }
    
    //pass username to DAO to retrieve
    const dbResponse = await userService.getUser(username);
    const user = dbResponse.Items && dbResponse.Items[0];

    //verify password match
    const validPass = await validatePassword(password, user)
    if(!validPass) {
        return null;
    }
    

    //generate jwt
    else {
        let payload = {
            username: user.username,
            alignment: user.alignment,
            avatar: user.avatar,
        };

        //generate JWT
        const token = await generateJWT(payload);

        return { success: true, user: payload, token };
    }
}

module.exports = {
    registerUser,
    loginUser
}