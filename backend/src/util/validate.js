/* All validation functions can go here */

const logger = require("./logger");

function validateNumArray(arr) {
    if(!arr) {
        return false;
    }
    
    for(var x of arr) {
        if(!Number(x)) {
            return false;
        }
    }

    return true;
}

function validateJsonNumArray(arr) {
    let numbers;

    try {
        numbers = JSON.parse(arr);
    } catch (error) {
        logger.error('Invalid JSON number array');
        return false;
    }

    if(!numbers) {
        return false;
    }
    
    for(var x of numbers) {
        if(!Number(x)) {
            return false;
        }
    }

    return true;
}

function validateStringArray(arr) {

    try {
        let strings = JSON.stringify(arr);
    } catch (error) {
        logger.error('Invalid JSON string array');
        return false;
    }

    if(!arr) {
        logger.error('Undefined JSON string array');
        return false;
    }
    
    for(var x of arr) {
        if( typeof x === 'string' || x instanceof String ) {
            //is a string, do nothing
        } else {
            logger.error('JSON string array contains non-strings');
            return false;
        }
    }

    return true;
}

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

/**Validates user PUT data (i.e. data can be missing, but if present, it must be valid (i.e. if avatar id is present, it must be >= 0)) */
function validatePutUserData(userData) {

    if(!userData || //this big ugly if statement with a million clauses and no return metadata is pretty severe kludge

    (userData.avatar && Number(userData.avatar) < 0) || 

    /* The API also includes 'neutral' heroes so we might too */
    (userData.alignment && !(userData.alignment == 'good' || userData.alignment == 'bad' || userData.alignment == 'neutral')) || 

    ("following" in userData && (!Array.isArray(userData.following) || !validateStringArray(userData.following))) || 
    ("followers" in userData && (!Array.isArray(userData.followers) || !validateStringArray(userData.followers))) ||
    
    (userData.wins && Number(userData.wins) < 0) || 

    (userData.losses && Number(userData.losses) < 0) ||

    ("password" in userData)/*not exactly a smart check, but changing passwords is beyond this func's scope*/ ) { 

        logger.error(`PUT user data has problems: ${JSON.stringify(userData)}`);
        return false;
    }

    return true;
}

function validateHero(hero) {
    if(!(hero && 
        hero.powerstats && 
        hero.powerstats.intelligence && 
        hero.powerstats.strength && 
        hero.powerstats.speed && 
        hero.powerstats.durability)) {
            return false;
    }

    return true;
}

module.exports = {
    validateNumArray,
    validateJsonNumArray, 
    validateUsername,
    validatePutUserData,
    validateHero
};