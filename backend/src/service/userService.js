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

async function getAllUsers() {
    return await userDao.getAllUsers();
}  

//===== Put - Modify a user's account data
// modify any/all user fields, except username, password, id. all fields optional in req.
async function putUser(data) {
    let { username, userData } = data;
    //userData like { avatar, alignment, following, followers, wins, losses }
    //console.log(JSON.stringify(userData.data));
    //evaluate data validity
    if(userData && validate.validatePutUserData(userData.data)) {
        // should consider making a putUser in user DAO that will update a user record entirely
        let result = await userDao.updateInfo({username, ...userData});
        //console.log(result);
        return { code: 200, message: 'User updated', username, success: true, result };
    }
    else {
        return { code: 400, message: 'Bad request', result: {}, username, success: false };
    }
}



module.exports = {
    getUser,
    getAllUsers,
    putUser
}
