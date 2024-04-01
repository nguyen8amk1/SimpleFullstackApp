const router = require('express').Router();

// TODO: need to check authentication first then able to do the work 
const authMiddleware = (req, res, next) => {
    console.log(req.cookies);
    const credentialsExist = req.cookies !== undefined;
    if(!credentialsExist) {
        return res.sendStatus(401);
    }
    next(); 
}

router.get('/generateCalendar',authMiddleware, (req, res) => {
    // TODO: checking if there exist accessToken

})

module.exports = router;
