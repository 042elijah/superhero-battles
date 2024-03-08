const express = require("express")
const router = express.Router();


router.post("/", async (req, res) => {
    res.status(200).json({ message: `post to battleground endpoint reached` })
})

router.get("/", async (req, res) => {
    res.status(200).json({ message: `get battleground endpoint reached` })
})

router.get("/leaderboard", async (req, res) => {
    res.status(200).json({ message: `get battleground leaderboard endpoint reached` })
})

router.get("/battles/:battleID", async (req, res) => {
    let recievedQuery = req.params.battleID;
    res.status(200).json({ message: `get query from battles with id: ${recievedQuery}` })
})

module.exports = router; 