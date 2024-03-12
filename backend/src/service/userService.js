const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken'); //open: do we want to handle auth here?
const bcrypt = require("bcrypt");

const userDAO = require("../repository/userDAO")


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
    
    //eval username validity
    if (!username) return {username, success: false, message: "Empty username!"};

    //pass username to DAO to retrieve CustomHero
    let heroData = await userDAO.getCustomHero( username );

    return { username, success: true, message: "Data retrieved.", data: heroData };
}

//===== Post - Create a new custom hero
async function postCustomHero(data) {

    let { username, heroData } = data;

    //evaluate username validity
    if (!username) return {username, heroData, success: false, message: "Empty username!"};

    //heroData like { heroName, backstory, description, alignment, stats }
    if (!heroData.heroName || !heroData.backstory || !heroData.description || !heroData.alignemnt || !heroData.stats) //is there a more elegant way to do this?
        return {username, heroData, success: false, message: "heroData has empty values!"};

    if (!isGoodOrEvil(heroData.alignement))
        return {username, heroData, success: false, message: "heroData.alignment field must be good or evil!"};

    //id = new uuid;
    heroData.id = uuidv4();

    //post CustomHero to DAO to create a new CustomHero row
    //let result = await userDAO.postCustomHero( username, heroData );

    return { username, success: true, message: "CustomHero posted.", result }
}

//===== Put - Modify a custom hero (can we modify custom heroes?)
async function putCustomHero(data) {

    let { username, heroData } = data;

    //evaluate username validity
    if (!username) return {username, success: false, message: "Empty username!"};

    //heroData like { heroName, backstory, description, alignment, stats }

    //put CustomHero to DAO to modify extant CustomHero
    //let result = await userDAO.modifyCustomHero( username, heroData );

    return { username, success: true, message: "CustomHero modified.", result };
}



// assistance function to determine whether an alignment field is valid
function isGoodOrEvil(s) {
    if (s === "good")
        return true;
    else if (s === "evil")
        return true;
    else
        return false;
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
