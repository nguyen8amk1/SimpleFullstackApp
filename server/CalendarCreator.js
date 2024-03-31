const {google} = require('googleapis');
const moment = require('moment-timezone');


const { datetime, RRule, RRuleSet, rrulestr } = require('rrule');

// TODO: try to make this works 
// NOTE: this calendar creator should be the plugin part 
class CalendarCreator {
    // byweekday: [RRule.MO, RRule.FR],
    static WEEKDAYS_MAPPING = [
        0, 0, 
        RRule.MO, 
        RRule.TU, 
        RRule.WE, 
        RRule.TH, 
        RRule.FR, 
        RRule.SA, 
        RRule.SU, 
    ];

    constructor(userCredentials) {
        this.userCredentials = userCredentials;
        this.calendarId = 'primary';
        this.calendar = google.calendar({version: 'v3', auth: this.userCredentials});
        this.timezone = 'Asia/Ho_Chi_Minh';
    }

    setTimeZone(timezone) {
        this.timezone = timezone;
    }

    setCalendarId(id) {
        this.calendarId = id;
    }
    

    _generateDateString(date, time) {
        const months = ["ERROR",  "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December" ];

        var dateArray = date.split('/');

        const newDate = parseInt(dateArray[0], 10); 
        const month = months[parseInt(dateArray[1], 10)];
        const year = parseInt(dateArray[2], 10);

        return `${month} ${newDate}, ${year} ${time} GMT+0700`;
    }

    // NOTE: this function only works correctly is the startdate is monday
    _adjustAsyncWeekdateStateDate(event) {
        const weekday2offsetMapping = [0, 0, 0, 1, 2, 3, 4, 5, 6]; 

        var dateArray = event.startDate.split('/');
        const newDate = parseInt(dateArray[0], 10) + weekday2offsetMapping[event.weekday]; 
        const month = parseInt(dateArray[1], 10);
        const year = parseInt(dateArray[2], 10);

        const newEvent = {
            ...event, 
            startDate: `${newDate}/${month}/${year}`, 
        };

        return newEvent;
    }


    _modifiedSchedule(schedule) {
        const newArray = schedule.map(a => ({...a}));

        for(let i = 0; i < schedule.length; i++) {
            newArray[i] = adjustAsyncWeekdateStateDate(schedule[i]);
        }

        return newArray;
    }

    _nextOccuringDate(startDate, gap) {
        let nextStartDate = new Date(startDate); 
        nextStartDate.setDate(nextStartDate.getDate() + gap*7);
        return nextStartDate; 
    }

    _generateDateTimeString(date, time) {
        let result = "";
        const [day, month, year] = date.split('/');

        // NOTE: this full year is only temporary -> change this to a better implementation
        // TODO: create a more dynamic implemetation for this 
        const fullYear= '20'+ year;
        result += fullYear + '-' + month + '-' + day;
        result += 'T'; 
        result += time; 
        result += '+07:00'; 
        return result;
    }


    _eventParse(event) {
        const startCourseDateTime = this._generateDateTimeString(event.startDate, event.startTime);
        const endCourseDateTime = this._generateDateTimeString(event.endDate, event.endTime);

        const startSessionDateTime = this._generateDateTimeString(event.startDate, event.startTime);
        const endSessionDateTime = this._generateDateTimeString(event.startDate, event.endTime);
        
        const courseWeekdays = [CalendarCreator.WEEKDAYS_MAPPING[event.weekday]];
        const interval = event.gap;

        // TODO: 
        // Count works perfectly fine, but until still not working 
        
        const count = 10;
        const recurrence = new RRule({
            freq: RRule.WEEKLY,
            interval: interval,
            tzid: this.timezone,
            byweekday: courseWeekdays,
            //dtstart: datetime(2024, 3, 4, 7, 30, 0),
            //until: datetime(2024, 6, 31),
            count: count, 
        }).toString();

        const result = {
            'summary': event.name,
            'description': event.description,

            'start': {
               'dateTime': startSessionDateTime,
               'timeZone': this.timezone,
            },
            
            'end': {
               'dateTime': endSessionDateTime,
               'timeZone': this.timezone,
            },
            
            'recurrence': [recurrence], 
        };

        return result;    
    }

    async createEvent(event) {
        // TODO: make this works 
        const validEvent = this._eventParse(event);
        console.log(validEvent);

        await this.calendar.events.insert({
            calendarId: this.calendarId,
            resource: validEvent,
        }, (err, event) => {
                if (err) {
                    console.log('There was an error contacting the Calendar service: ' + err);
                    return;
                }
                console.log('Event created: %s', event.htmlLink);
        });

        // const eventSeries = this.calendar.createEventSeries(
        //     validEvent.name,
        //     validEvent.currentstart, 
        //     validEvent.currentend,
        //     CalendarApp.newRecurrence().addWeeklyRule().interval(validEvent.gap)
        //         .onlyOnWeekdays(validEvent.weekdays)
        //         .until(validEvent.enddate))
        // .setDescription(validEvent.description)
        // .setColor(validEvent.color)
        // ;

        console.log("Added: " + validEvent.name);
    }

    async generateResultCalendar() {
        // TODO: this code bellow is appscript, make it work 
        const calendar = CalendarApp.getCalendarById(calendarID);
        const correctedSchedule = modifiedSchedule(schedule);

        Logger.log(COLORS);

        for(let i = 0; i < correctedSchedule.length; i++) {
            const event = correctedSchedule[i];
            createEvent(event, calendar);
        }
    }

    async listEvents(count) {
        let result = "ditme, bi cai lon gi roi"; 

        const res = await this.calendar.events.list({
            calendarId: this.calendarId,
            timeMin: new Date().toISOString(),
            maxResults: count,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = res.data.items;
        if (!events || events.length === 0) {
            result = 'No upcoming events found.';
            // return;
        } else {
            //console.log('Upcoming 10 events:');
            result = [];
            events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                //console.log(`${start} - ${event.summary}`);
                result.push(`${start} - ${event.summary}`);
            });
        }
        return result;
    }
};

module.exports = CalendarCreator;
