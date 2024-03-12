const express = require("express");
const router = express.Router();

const service = require("../service/pastBattleService");

router.get("/record", async(req, res) => {
    
    const username = req.body.username;

    if(username){
       const data = await service.getPastBattle(username);
       res.status(200).json(data);
    }
})

module.exports = router;