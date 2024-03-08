const express = require("express")
const router = express.Router();


router.post("/register", async (req, res) => {
    res.status(200).json({ message: `post to register endpoint reached`})
})

router.post("/login",  async (req, res) => {
    res.status(200).json({ message: `post to login endpoint reached` })
})

router.get("/:userID", async (req, res) => {
    let recievedQuery = req.params.userID;
    res.status(200).json( {message: `get query with id: ${recievedQuery}`})
})

router.get("/:userID/customization", async (req, res) => {
    let recievedQuery = req.params.userID;
    res.status(200).json({ message: `get query with id: ${recievedQuery} on customization` })
})

router.post("/:userID/customization", async (req, res) => {
    let recievedQuery = req.params.userID;
    res.status(200).json({ message: `post with id: ${recievedQuery} on customization` })
})

module.exports = router; 