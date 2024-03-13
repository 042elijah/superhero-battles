const { v4: uuidv4 } = require('uuid');
// const jwt = require('jsonwebtoken'); //open: do we want to handle auth here?
// const bcrypt = require("bcrypt");
const userDao = require('../repository/userDAO');


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

//===== Get - Get data for a user by username
async function getUser(username) {
    //evaluate data validity
    if(validateUsername(username)) {
        //pass username to DAO to retrieve User
        return await userDao.getUser(username);
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

    function validateJsonNumArray(arr) {
        let numbers;

        try {
            numbers = JSON.parse(arr);
        } catch (error) {
            console.error('Invalid JSON array passed with user data');
            return false;
        }

        if(!numbers) {
            return false;
        }

        for(var x in numbers) {
            if(!Number(x)) {
                return false;
            }
        }

        return true;
    }

    // validatePutUserData will likely be moved to a separate validation script, but I am not changing the project structure without discussion first
    /**Validates user PUT data (i.e. data can be missing, but if present, it must be valid (i.e. if avatar id is present, it must be >= 0)) */
    function validatePutUserData(userData) {
        if(!userData || 

        (userData.avatar && Number(userData.avatar) < 0) || 

        /* The API also includes 'neutral' heroes so we might too */
        (userData.alignment && !(userData.alignment == 'good' || userData.alignment == 'bad' || userData.alignment == 'neutral')) || 

        (userData.following && !validateJsonNumArray(userData.following)) || 
        
        (userData.followers && !validateJsonNumArray(userData.followers)) || 
        
        (userData.wins && Number(userData.wins) < 0) || 

        (userData.losses && Number(userData.losses) < 0)) {
            return false;
        }
        
        return true;
    }

    //evaluate data validity
    if(validatePutUserData(userData)) {
        // should consider making a putUser in user DAO that will update a user record entirely
        await userDao.updateInfo(username, userData);
        return { code: 200, message: 'User updated', username, success: true };

    }
    else {
        return { code: 400, message: 'Bad request', result: {}, username, success: true };
    }

    //fork into subfuncs based on what userData is populated
}



module.exports = {
    getUser,
    putUser,
    validateUsername
}
