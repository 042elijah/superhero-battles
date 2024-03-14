const { v4: uuidv4 } = require('uuid');
// const jwt = require('jsonwebtoken'); //open: do we want to handle auth here?
// const bcrypt = require("bcrypt");
const userDao = require('../repository/userDAO');
const validate = require('../util/validate');


//===== Get - Get data for a user by username
async function getUser(username) {
    //evaluate data validity
    if(validate.validateUsername(username)) {
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

    //evaluate data validity
    if(validate.validatePutUserData(userData)) {
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
    putUser
}
