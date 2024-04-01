const router = require('express').Router();
const {HTMLCalendarParser} = require('../services/CalendarParsers');
const CalendarCreator = require('../services/CalendarCreator');

// TODO: need to check authentication first then able to do the work 
const authMiddleware = (req, res, next) => {
    const credentialsExist = req.user !== undefined;
    if(!credentialsExist) {
        return res.sendStatus(401);
    }
    next(); 
}

router.get('/generate-calendar',authMiddleware, async (req, res) => {
    // TODO: list first 10 events of the user 
    console.log(req.user);
    try {
        // const userCredentials = await authorize();
        // console.log(userCredentials);
        //TODO: create new Calendar
        const accessToken = req.user.accessToken;

        const calendarParser = new HTMLCalendarParser();

        const tkb = '/home/nttn/Documents/GitHub/SimpleFullstackApp/server/services/tkb.html'
        calendarParser.setData(tkb);

        const schedule1 = calendarParser.parse();

        const calendarCreator = new CalendarCreator();
        await calendarCreator.setCredentials(accessToken);

        await calendarCreator.enableRandomColors();
        const calendarId = await calendarCreator.newCalendar("vailonchimen");
        calendarCreator.setCalendarId(calendarId);
        await calendarCreator.generateResultCalendar(schedule1);

    } catch (err) {
        console.error(err);
    } 
});

module.exports = router;
