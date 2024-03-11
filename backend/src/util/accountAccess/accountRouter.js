const express = require("express")
const router = express.Router();

const accountService = require("./accountService")

// Account registration and login
router.post("/", async (req, res) => {
    if (req.baseUrl == "/register") {
        const registered = await accountService.registerUser(req.body);

        if (registered) res.status(201).json({ message: `Account has been registered`})
        else res.status(400).json({ message: "Error with account creation", receivedData: req.body })
    }
    if (req.baseUrl == "/login") {
        const loggedIn = await accountService.loginUser(req.body);

        if (loggedIn) res.status(200).json({ message: `Login Successful` })
        else res.status(400).json({ message: "Error logging in", receivedData: req.body }) 
    }

})




module.exports = router; 
