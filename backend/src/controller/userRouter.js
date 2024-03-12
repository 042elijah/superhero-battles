const express = require("express")
const router = express.Router();

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

// Do we want to show the user profile display only if it is another user/guest and show the edit profile if it is the user with userID logged in?
// Or do we want to just forbid access if it is anyone but userID what is logged in?
// User page access and editing
router.get("/:userID", authUser, async (req, res) => {
    let recievedQuery = req.params.userID;
    // Can use req.user to access user obj when using authUser middleware
    res.status(200).json( {message: `get query with id: ${recievedQuery}`})
})

router.put("/:userID", authUser, async (req, res) => {
    const data = req.body;
    // Can use req.user to access user obj when using authUser middleware
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