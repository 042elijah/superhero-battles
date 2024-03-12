const { v4: uuidv4 } = require('uuid');

const customHeroDAO = require("../repository/customHeroDAO")


//===== Get - Get data for a custom hero
async function getCustomHero(data) {

    let { username } = data;
    
    //eval username validity
    if (!username) return {username, success: false, message: "Empty username!"};

    //pass username to DAO to retrieve CustomHero
    let hero = await customHeroDAO.getCustomHero( username );

    return { username, success: true, message: "Data retrieved.", data: hero };
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
    getCustomHero,
    postCustomHero,
    putCustomHero
}