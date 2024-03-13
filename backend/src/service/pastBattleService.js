const pastBattleDAO = require("../repository/pastBattleDAO");

async function getPastBattleByUsername(username) {
    if(username){
        const data = await pastBattleDAO.getPastBattleByUsername(username);
        return data;
    }
    else{
        throw new Error("missing username or falsy value exists!")
    }
}

async function getPastBattleByBattleID(username, battleID) {
    if(battleID){
        const data = await pastBattleDAO.getPastBattleByBattleID(username, battleID);
        console.log(battleID)
        return data;
    }
    else{
        throw new Error("missing battle id/username or falsy value exists!")
    }
}

module.exports = {
    getPastBattleByUsername,
    getPastBattleByBattleID
}