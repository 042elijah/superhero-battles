const express = require("express")
const router = express.Router();

const pastBattleService = require("../service/pastBattleService");


// router.post("/", async (req, res) => {
//     res.status(200).json({ message: `post to battleground endpoint reached` })
// })

// router.get("/", async (req, res) => {
//     res.status(200).json({ message: `get battleground endpoint reached` })
// })

router.get("/leaderboard", async (req, res) => {
    res.status(200).json({ message: `get battleground leaderboard endpoint reached` })
})

// router.get("/battles/:battleID", async (req, res) => {
//     let recievedQuery = req.params.battleID;
//     res.status(200).json({ message: `get query from battles with id: ${recievedQuery}` })
// })

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
    console.log(battleID);

    if(battleID && username){
       const data = await pastBattleService.getPastBattleByBattleID(username, battleID);
       res.status(200).json(data);
    }
    else{
        res.status(401).json({message : "missing battle ID or username!"});
    }
})

module.exports = router; 