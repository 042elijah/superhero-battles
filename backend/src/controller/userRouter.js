const express = require("express")
const router = express.Router();
const userService = require('../service/userService');
const customHeroService = require('../service/customHeroService');
const { authUser, authUserAllowGuest, authUserOwnerPath, authUserOwnerQuery } = require('../middleware/auth');


// User page access and editing
router.get("/:username", authUserAllowGuest, async (req, res) => {
    let username = req.params.username;
    let dbResponse = await userService.getUser(username);
    let user = dbResponse.Items && dbResponse.Items[0];
    delete user.password;

    // authUserAllowGuest modifies the req
    // if user is logged in, it adds a user property to the req obj
    // if user is not logged in, it adds an isGuest property to the req obj (with value of true; isGuest=false should not have any effect and 
    // should not trick the system into allowing a guest into someone's account...)
    
    // If user is a guest
    if(req.isGuest == true) {
        res.status(200).json({ message: 'Viewing user profile as guest', userStatus: 'guest', user });

        // Should give different/limited data
        // Should NOT give option to battle
        // Should NOT give option to edit
    }
    // Else if a valid user is logged in
    else if(req.user) {
        // If a different user is looking at another user's profile
        if(req.user.username != username) {
            res.status(200).json({ message: 'Viewing as other user', userStatus: 'otheruser',  user });

            // Give some basic user data
            // Give option to battle this user (handled in frontend, but can give a flag to signal this option)
        }
        // Else if a user is looking at their own profile
        else {
            res.status(200).json({ message: 'Viewing as owning user', userStatus: 'owner',  user });

            // Give most user data (except password)
            // Give option for edit profile (probably handled in frontend, but can add a flag to tell the frontend to display edit profile page)
        }
    }
})

router.put("/:username", authUserOwnerPath, async (req, res) => {
    let data = req.body;
    let username = req.params.username;

    // Disallow changing the username in the body
    data = {...data, username: username};

    const putResult = await userService.putUser({ username: data.username, userData: data });
    
    res.status(putResult.code).json({ message: putResult.message });
})


// Custom user hero access and customization
router.get("/:username/customization", async (req, res) => {

    const data = await customHeroService.getCustomHero(req.params.username);

    res.status(200).json({ data })
})

router.post("/:username/customization", async (req, res) => {

    let recievedQuery = req.params.username;

    res.status(200).json({ message: `post with id: ${recievedQuery} on customization` })
})

router.put("/:username/customization", async (req, res) => {

    const data = req.body;

    res.status(200).json({ message: `put with data: ${data} on customization` })
})


module.exports = router; 