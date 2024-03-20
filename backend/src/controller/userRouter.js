const express = require("express")
const router = express.Router();
const userService = require('../service/userService');
const customHeroService = require('../service/customHeroService');
const { authUser, authUserAllowGuest, authUserOwnerPath, authUserOwnerQuery } = require('../util/accountAccess/auth');



router.get("/usersearch", authUserAllowGuest, async (req, res) => {

    let dbResponse = await userService.getAllUsers();

    if (!dbResponse || !("Items" in dbResponse) || !dbResponse.Items[0]) {

        res.status(400).json({ message: 'Couldnt find any users at all??', dbResponse });

    } else {

        for (let i = 0; i < dbResponse.Items.length; i++) {
            if (dbResponse.Items[i] && ("password" in dbResponse.Items[i])) delete dbResponse.Items[i].password;
        }
        
        res.status(200).json({ message: 'Got all users', users: dbResponse.Items, userStatus: req.userStatus });
    }
});

// Get User page for access and editing
router.get("/:username", authUserAllowGuest, async (req, res) => {
    let username = req.params.username;
    let dbResponse = await userService.getUser(username);

    if (!dbResponse || !("Items" in dbResponse) || !dbResponse.Items[0]) {
        res.status(400).json({ message: 'Couldnt find user', userStatus: 'guest', dbResponse });
    } else {

        let user = dbResponse.Items && dbResponse.Items[0];
        if (user && ("password" in user)) delete user.password;

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
    }
})

//modifies an existing user
// modify any/all user fields, except username, password, id. all fields optional in req.
router.put("/:username", authUserOwnerPath, async (req, res) => {
    let data = req.body;
    let username = req.params.username;

    // Disallow changing the username in the body
    data = {...data, username: username};

    const putResult = await userService.putUser({ username: data.username, userData: data });
    
    res.status(putResult.code).json({ message: putResult.message });
})


//for guests to view a user's custom hero
//needs: username param
router.get("/:username/customhero", authUserAllowGuest, async (req, res) => {

    const data = await customHeroService.getCustomHero(req.params.username);

    res.status(200).json({ data })
})

// Custom user hero access and customization
//needs: username param
router.get("/:username/customization", authUserAllowGuest, async (req, res) => {

    const data = await customHeroService.getCustomHero(req.params.username);

    res.status(200).json({ data })
})

//needs: username param, complete hero{} in body
router.put("/:username/customization", authUserAllowGuest, async (req, res) => {
    
    //console.log(JSON.stringify(req.body.data));
    let result = await customHeroService.putCustomHero({username: req.params.username, ...req.body.data});

    res.status(200).json({ result })
})


module.exports = router; 