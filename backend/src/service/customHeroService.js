const { v4: uuidv4 } = require('uuid');

const customHeroDAO = require("../repository/customHeroDAO")


//===== Get - Get data for a custom hero
//param: valid username pop'd by http params.
async function getCustomHero(username) {

    //eval username validity
    if (!username) return {username, success: false, message: "Empty username!"};

    //pass username to DAO to retrieve CustomHero
    let hero = await customHeroDAO.getCustomHero( username );

    if (!hero) return { username, success: false, message: "DAO failed to find hero!" };

    return { username, success: true, message: "Hero retrieved.", data: hero };
}

//===== Put - Modify a custom hero (can we modify custom heroes?)  
//param: complete hero object, with username pop'd by http params, id optional
//id in hero = modify extant CustomHero
//id not in hero = add new CustomHero
async function putCustomHero(hero) {

    let heroCheck = checkHero(hero); //heroCheck both verifies the validity of and cleans the data of hero
    if (!heroCheck.success) return heroCheck;

    //check if hero has an id. if not, we're adding a new CustomHero, so we assign a new id.
    //if it does have an id, we're modifying an extant CustomHero, so we don't need to assign a new id.
    if (!heroCheck.hero.id) heroCheck.hero.id = "c" + uuidv4();

    //put CustomHero to DAO to modify extant CustomHero
    let result = await customHeroDAO.updateCustomHero( heroCheck.hero );

    if (!result) return { username: heroCheck.username, success: false, message: "DAO UpdateCommand failure!", hero: heroCheck.hero };

    return { 
        username: heroCheck.username, 
        success: true, 
        message: "CustomHero upated.", 
        result 
    };
}


//UTILITY: check if a hero has all their fields correct. doesnt check id. username pop'd by http params.
    //heroData like { username, heroName, backstory, description, alignment, stats }
function checkHero(hero) {
    
    if (!hero.username || !hero.heroName || !hero.backstory || !hero.description || !hero.alignment) //is there a more elegant way to do this?
        return {username: hero.username, success: false, message: "heroData has empty values!", hero};

    if (!isGoodBadOrNeutral(hero.alignment)) //verify hero alignment is valid
        return {username: hero.username, success: false, message: "heroData.alignment field must be good, neutral, or bad!", hero};

    if (!Number.isInteger(hero.stats) || hero.stats <= 0 || hero.stats > 731) //verify stats is a valid number
        return {username: hero.username, success: false, message: "heroData.stats field must be a valid heroAPI id!", hero};

    if (!Number.isInteger(hero.avatar) || hero.avatar < 0) //verify stats is a valid number
        return {username: hero.username, success: false, message: "heroData.avatarID field must be a valid id!", hero};

    return {
        username: hero.username, 
        success: true, 
        message: "Hero is valid.", 
        hero: {     //we do this in case there's extra unwanted data in hero.
            username: hero.username,
            heroName: hero.heroName,
            backstory: hero.backstory,
            description: hero.description,
            alignment: hero.alignment,
            stats: hero.stats,
            id: hero.id,
            avatar: hero.avatar
        }};
}

//UTILITY: assistance function to determine whether an alignment field is valid
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
    //postCustomHero,
    putCustomHero,

    // export below functions for testing purpose
    checkHero,
    isGoodBadOrNeutral
}






//DEPRECATED
//===== Post - Create a new custom hero
//param: complete hero object, username pop'd by http params, but no id
async function postCustomHero(hero) {

    let heroCheck = checkHero(hero); //heroCheck both verifies the validity of and cleans the data of hero
    if (!heroCheck.success) return heroCheck;

    //id = new uuid;
    heroCheck.hero.id = "c" + uuidv4();

    //post CustomHero to DAO to create a new CustomHero row
    let result = await customHeroDAO.postCustomHero( heroCheck.hero );

    return { 
        username: heroCheck.username, 
        success: true, 
        message: "CustomHero posted.", 
        result 
    };
}