/* All validation functions can go here */

const logger = require("./logger");

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

function validateHero(hero) {
    if(!(hero && 
        hero.powerstats.intelligence && 
        hero.powerstats.strength && 
        hero.powerstats.speed && 
        hero.powerstats.durability)) {
            return false;
    }

    return true;
}

module.exports = {
    validateJsonNumArray, 
    validateUsername,
    validatePutUserData,
    validateHero
};