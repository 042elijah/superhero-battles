const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken'); //open: do we want to handle auth here?
const bcrypt = require("bcrypt");
const userService = require('../../service/userService');

const userDAO = require("../../repository/userDAO");

const { SECRET_KEY } = require('../../middleware/auth');

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
async function registerUser(data) {
    let username = data.username
    let password = data.password
    let dataCheck = await dataValidation(username, password)

    if (dataCheck.exists == true) return [401, "Username already in use"];
    
    if (dataCheck.password == false) return [401, "Invalid password. Must be at least 5 characters with no spaces"]
    
    if (dataCheck.username == false) return [401, "Invalid userame. Must be less than 50 characters with no spaces"]

    let userObj = {
        username: username,
        id: "user",
        avatar: null,
        password: password,
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
async function loginUser(data) {
    let { username, password } = data;

    //evaluate data validity
    if(!userService.validateUsername(username)) {
        return null;
    }

    //bcrypt password
    // Passwords are not hashed in the DB so cannot use/don't need bcrypt so far. If we want to hash passwords (which is probably a requirement, we need to hash during 
    // account registration)
    
    //pass username to DAO to retrieve
    const dbResponse = await userService.getUser(username);
    const user = dbResponse.Items && dbResponse.Items[0];

    //verify password match
    if(!(password === user.password)) {
        return null;
    }
    // Use this if/when we have hashed passwords in the DB
    // // bcrypt.compare takes plaintext as first param and hashed as second param
    // if(!user || !(await bcrypt.compare(password, user.password))) {
    //     res.status(401).json('Invalid credentials');
    // }

    //generate jwt
    else {
        let payload = {
            username: user.username,
            alignment: user.alignment,
            avatar: user.avatar,
        };

        // Make sure token created for the presentation has enough lifetime to last for the duration of the presentation
        let signOptions = {
            expiresIn: '25m'
        };

        //generate JWT
        const token = jwt.sign(payload, SECRET_KEY, signOptions);

        return { success: true, user: payload, token };
    }
}

module.exports = {
    registerUser,
    loginUser
}