const express = require("express")
const router = express.Router();

const userService = require("../service/userService")




// User page access and editing
router.get("/:userID", async (req, res) => {
    let recievedQuery = req.params.userID;
    res.status(200).json( {message: `get query with id: ${recievedQuery}`})
})

router.put("/:userID", async (req, res) => {
    const data = req.body;
    res.status(200).json({ message: `put with data: ${data} on userID` })
})


// Custom user hero access and customization
router.get("/:userID/customization", async (req, res) => {
    let recievedQuery = req.params.userID;
    res.status(200).json({ message: `get query with id: ${recievedQuery} on customization` })
})

router.post("/:userID/customization", async (req, res) => {
    let recievedQuery = req.params.userID;
    res.status(200).json({ message: `post with id: ${recievedQuery} on customization` })
})

router.put("/:userID/customization", async (req, res) => {
    const data = req.body;
    res.status(200).json({ message: `put with data: ${data} on customization` })
})


module.exports = router; 