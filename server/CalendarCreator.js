const {google} = require('googleapis');
const moment = require('moment-timezone');

// TODO: try to make this works 
class CalendarCreator {
    static COLORS = {
        BLUE : "#000000", 	
        GRAY: "#000000", 
        GREEN: "#000000", 
        // ORANGE: CalendarApp.EventColor.ORANGE, 
        // RED	: CalendarApp.EventColor.RED, 
        // YELLOW: CalendarApp.EventColor.YELLOW, 
        // CYAN: CalendarApp.EventColor.CYAN, 
        // MAUVE: CalendarApp.EventColor.MAUVE,
        // PALE_BLUE: CalendarApp.EventColor.PALE_BLUE,
        // PALE_GREEN: CalendarApp.EventColor.PALE_GREEN,
    }; 

    static WEEKDAYS_MAPPING= [0, 0, 
        // CalendarApp.Weekday.MONDAY,
        // CalendarApp.Weekday.TUESDAY,
        // CalendarApp.Weekday.WEDNESDAY,
        // CalendarApp.Weekday.THURSDAY,
        // CalendarApp.Weekday.FRIDAY,
        // CalendarApp.Weekday.SATURDAY,
        // CalendarApp.Weekday.SUNDAY,
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

    _parseDateTime(date, time) {
        // Split the start date into day, month, and year
        const [day, month, year] = date.split('/').map(Number);

        // Parse the start time into hours, minutes, and seconds
        const [hours, minutes, seconds] = time.split(':').map(Number);

        // Create a moment object with the parsed values and set the timezone to Vietnam
        const d = moment.tz([year + 2000, month - 1, day, hours, minutes, seconds], 'Asia/Ho_Chi_Minh').toISOString();

        return d;
    }


    _eventParse(event) {
        // TODO: generate this date format from given information
        const startDateTime = '2024-04-01T07:00:00+07:00';
        const endDateTime = '2024-04-01T13:00:00+07:00';
        const recurrence = [ 'RRULE:FREQ=DAILY;COUNT=2' ]; // TODO: generate this information from gap info

        const result = {
            'summary': event.name,
            'description': event.description,

            'start': {
               'dateTime': startDateTime,
               'timeZone': this.timezone,
            },

            'end': {
               'dateTime': endDateTime,
                'timeZone': this.timezone,
            } ,
            'recurrence': recurrence, 
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
        }, function(err, event) {
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

    createCalendar() {
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
