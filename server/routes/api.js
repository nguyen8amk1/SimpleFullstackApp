const router = require('express').Router();

// TODO: need to check authentication first then able to do the work 
const authMiddleware = (req, res, next) => {
    const credentialsExist = req.user !== undefined;
    if(!credentialsExist) {
        return res.sendStatus(401);
    }
    next(); 
}

router.get('/generate-calendar',authMiddleware, (req, res) => {
    // TODO: list first 10 events of the user 
    console.log(req.user);
});

module.exports = router;
