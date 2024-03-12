const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken'); //open: do we want to handle auth here?
const bcrypt = require("bcrypt");
const { getUser } = require('../repository/userDAO');

const userDAO = require("../repository/userDAO")


//===== Post - Register a new account
async function registerUser(data) {
    let { username, password } = data;
    //evaluate data validity (should use the same validation function that is used in the get users function to maintain username restriction consistency)
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
    /** Can/should be used during user registration as well as before attempting to retrieve user from DB (so there is consistency between username restrictions).
     * Assumes no user name can contain whitespace */
    function validateUsername(username) {
        if(!String(username) || 
            // Regex to test for whitespace
            (/\s/g).test(username)
            // Other username requirements here
            ) {
            return false;
        }

        return true;
    }
    
    //pass username to DAO to retrieve User
    if(validateUsername(username)) {
        return await getUser(username);
    }

    return {error: `Couldn't get user ${username}`};
    // return { username, success: true, data: {alignment: "some user data in an object"} };
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

    // validatePutUserData will likely be moved to a separate validation script, but I am not changing the project structure without discussion first
    /**Validates user PUT data (i.e. data can be missing, but if present, it must be valid (i.e. if avatar id is present, it must be >= 0)) */
    function validatePutUserData(userData) {
        if(!userData || 

        (userData.avatar && Number(userData.avatar) < 0) || 

        /* The API also includes 'neutral' heroes so we might too */
        (userData.alignment && !(userData.alignment == 'good' || userData.alignment == 'bad' || userData.alignment == 'neutral')) || 

        (userData.following && Number(userData.following) < 0) || 
        
        (userData.followers && Number(userData.followers) < 0) || 
        
        (userData.wins && Number(userData.wins) < 0) || 

        (userData.losses && Number(userData.losses) < 0)) {
            return false;
        }

        return true;
    }

    //evaluate data validity
    if(validatePutUserData(userData)) {
        // No suitable method in user DAO currently
        // should consider making a putUser in user DAO that will update a user record entirely
    }

    //fork into subfuncs based on what userData is populated
    // Since the PUT method should either create new or replace entirely, maybe we should replace the entire user instead of forking into many subfuncs for each user attribute
    // i.e. On the edit user profile page, it already displays current user values, so onSubmit, it just sends the entire user record back, so whatever is changed will naturally be updated
    // and whatever was the same will remain the same (since the whole record is overwritten, we don't need to manually check for changes)


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

    if (!isGoodBadOrNeutral(heroData.alignement)) //verify hero alignment is valid
        return {username, heroData, success: false, message: "heroData.alignment field must be good or evil!"};

    //id = new uuid;
    heroData.id = uuidv4();

    //post CustomHero to DAO to create a new CustomHero row
    //let result = await userDAO.postCustomHero( username, heroData );

    return { username, success: true, message: "CustomHero posted.", result };
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
function isGoodBadOrNeutral(s) {
    if (s === "good")
        return true;
    else if (s === "bad")
        return true;
    else if (s === "neutral")
        return true;
    else
        return false;
}

module.exports = {
    getUser,
    putUser,
    getCustomHero,
    postCustomHero,
    putCustomHero
}
