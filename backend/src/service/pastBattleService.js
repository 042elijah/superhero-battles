const pastBattleDAO = require("../repository/pastBattleDAO");

async function getPastBattle(username) {
    if(username){
        const data = await pastBattleDAO.getPastBattle(username);
        return data;
    }
    else{
        throw new Error("missing username or falsy value!")
    }
}



module.exports = {
    getPastBattle
}