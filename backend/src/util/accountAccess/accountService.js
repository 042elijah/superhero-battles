const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken'); //open: do we want to handle auth here?
const bcrypt = require("bcrypt");



//===== Post - Register a new account
async function registerUser(data) {
    let { username, password } = data;
    //evaluate data validity
    //data isTruthy?, username not taken?, valid format?
    //id = "user";
    //bcrypt password
    //pass username, id, & bcrypted password to DAO
    return { username, success: true, };
}

//===== Post - Login to an account
async function loginUser(data) {
    let { username, password } = data;
    //evaluate data validity
    //bcrypt password
    //pass username to DAO to retrieve
    //verify password match
    //generate jwt 
    return { username, success: true, token: "123abc" };
}

module.exports = {
    registerUser,
    loginUser
}