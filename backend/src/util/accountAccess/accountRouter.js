const express = require("express");
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
        
        if (loggedIn) {
            const { success, user, token } = loggedIn;
            res.json({ message: `Signed in as ${user.username}`, token, user });
        }
        else {
            res.status(400).json({ message: "Error logging in" });
        }
    }
})




module.exports = router; 
