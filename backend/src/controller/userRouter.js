const express = require("express")
const router = express.Router();
const userService = require('../service/userService');
const customHeroService = require('../service/customHeroService');


// Account registration and login
router.post("/register", async (req, res) => {
    res.status(200).json({ message: `post to register endpoint reached`})
})

router.post("/login",  async (req, res) => {
    res.status(200).json({ message: `post to login endpoint reached` })
})

// Will move this function to wherever middlewares folder/script is created
function authUser(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Authentication header format convention: 'Bearer <token>'; This split returns the token value
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        // logger.info('401 Unauthorized access');
        res.status(401).json({ message: 'Unauthorized access' });
        return;
    }
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err || !user.role || !predicate(user.role)) {
            // logger.info('403 Forbidden access');
            res.status(403).json({ message: 'Forbidden access' });
            return;
        }
        else {
            req.user = user;
            next();
        }
    });
}

// Do we want to show the user profile display only if it is another user/guest and show the edit profile if it is the user with username logged in?
// Or do we want to just forbid access if it is anyone but username what is logged in?
// User page access and editing
router.get("/:username", /*authUser,*/ async (req, res) => {
    let username = req.params.username;
    // Can use req.user to access user obj when using authUser middleware

    // If a guest or other user is looking at someone else's profile, then call getUserAsViewer or getUserAsGuest or similar function
    if(true) {
        // Only send basic info to guests/other users
        const user = await userService.getUser(username);
        res.status(200).json({user});
    }
    else {
        // Else if the owning user is looking at their own profile, then call getUserAsOwner or similar function
    }
})

router.put("/:username", /*authUser,*/ async (req, res) => {
    const data = req.body;
    // Can use req.user to access user obj when using authUser middleware

    await userService.putUser({ username: data.username, userData: data });

    res.status(200).json({ message: `put with data: ${JSON.stringify(data)} on username` })
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