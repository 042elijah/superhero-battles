const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken'); //open: do we want to handle auth here?
const bcrypt = require("bcrypt");


//===== Post - Register a new account
async function registerUser(data) {
    let { username, password } = data;
    //evaluate data validity
        //data isTruthy?, username not taken?, valid format?
    //add uuid, bcrypt password
    //pass username & bcrypted password to DAO
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


//===== Get - Get data for a user by username
async function getUser(data) {
    let { username } = data;
    //evaluate data validity
    //pass username to DAO to retrieve User
    return { username, success: true, data: {alignment: "some user data in an object"} };
}

//===== Put - Modify a user's account data
/*
    lots of things can be classed under "putUser". 
    Should consider having this func fork into subfuncs based on what's being modified.
    Or else have multiple funcs that the router can call based on params.
*/
async function putUser(data) {
    let { username, userData } = data;
    //userData like { avatar, alignment, following, followers, wins, losses }
    //evaluate data validity
    //fork into subfuncs based on what userData is populated
    //???
    return { username, success: true };
}


//===== Get - Get data for a custom hero
async function getCustomHero(data) {
    let { username } = data;
    //evaluate data validity
    //pass username to DAO to retrieve CustomHero
    return { username, success: true, data: {heroName: "some custom hero data in an object"} }
}

//===== Post - Create a new custom hero
async function postCustomHero(data) {
    let { username, heroData } = data;
    //heroData like { heroName, backstory, description, alignment, stats }
    //evaluate data validity
    //post CustomHero to DAO to create a new CustomHero row
    return { username, success: true }
}

//===== Put - Modify a custom hero (can we modify custom heroes?)
async function putCustomHero(data) {
    let { username, heroData } = data;
    //heroData like { heroName, backstory, description, alignment, stats }
    //evaluate data validity
    //put CustomHero to DAO to modify extant CustomHero
    return { username, success: true };
}



module.exports = {
    registerUser,
    loginUser,
    getUser,
    putUser,
    getCustomHero,
    postCustomHero,
    putCustomHero
}