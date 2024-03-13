const express = require("express")
const router = express.Router();

const accountService = require("./accountService")

// Account registration and login
router.post("/", async (req, res) => {
    if (req.baseUrl == "/register") {
        // registered should be true/false
        const registered = await accountService.registerUser(req.body);

        if (registered) res.status(registered[0]).json({ message: `${registered[1]}`})
        else res.status(400).json({ message: "Error with account creation", receivedData: req.body })
    }
    if (req.baseUrl == "/login") {
        const loggedIn = await accountService.loginUser(req.body);

        if (loggedIn) res.status(200).json({ message: `Login Successful` })
        else res.status(400).json({ message: "Error logging in", receivedData: req.body }) 
    }

})




module.exports = router; 
