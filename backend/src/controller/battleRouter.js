const express = require("express")
const router = express.Router();

const pastBattleService = require("../service/pastBattleService");
const auth = require("../util/accountAccess/auth")


// router.post("/", async (req, res) => {
//     res.status(200).json({ message: `post to battleground endpoint reached` })
// })

// router.get("/", async (req, res) => {
//     res.status(200).json({ message: `get battleground endpoint reached` })
// })

router.get("/leaderboard", async (req, res) => {
    
    const data = await pastBattleService.getLeaderBoard();
    res.status(200).json(data);
})

// router.get("/battles/:battleID", async (req, res) => {
//     let recievedQuery = req.params.battleID;
//     res.status(200).json({ message: `get query from battles with id: ${recievedQuery}` })
// })

router.post('/battle', auth.authUser, async (req, res) => {
    // let battle = await pastBattleService.simulateBattle({ challenger: 'K00Lguy', challengerTeam: '[5,6,7]' }, { opponent: 'johndoe1', opponentTeam: '[8,10,11]' });
    let username = req.user.username;
    console.log(username)
    let data = req.body;

    const { challenger, challengerTeam } = data;
    const { opponent, opponentTeam } = data;
    let battle = await pastBattleService.simulateBattle({ challenger, challengerTeam }, { opponent, opponentTeam });
    
    res.json(battle);
});

// get the past battle records by username
router.get("/record/:username", async(req, res) => {
    
    const username = req.params.username;

    if(username){
       const data = await pastBattleService.getPastBattleByUsername(username);
       res.status(200).json(data);
    }
    else{
        res.status(401).json({message : "missing username!"});
    }
})

// get the past battle records by battle id and username
router.get("/record/:username/:battleID", async(req, res) => {
    
    const battleID = req.params.battleID;
    const username = req.params.username;

    if(battleID && username){
       const data = await pastBattleService.getPastBattleByBattleID(username, battleID);
       res.status(200).json(data);
    }
    else{
        res.status(401).json({message : "missing battle ID or username!"});
    }
})

module.exports = router; 