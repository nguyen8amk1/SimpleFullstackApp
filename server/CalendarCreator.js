const {google} = require('googleapis');

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

    // TODO: clean this function, overlapping variables and very confusing 
    createEvent(event, calendar) {
        const validEvent = event;

        const name = validEvent.name;
        const gap = validEvent.gap;

        const startime = validEvent.startTime;
        const endtime = validEvent.endTime;

        const startdatestring = generateDateString(validEvent.startDate, startime);
        const enddatestring = generateDateString(validEvent.endDate, startime);

        let startdate = new Date(startdatestring);
        let enddate = new Date(enddatestring); 

        const startstring = generateDateString(validEvent.startDate, startime);

        const endstring = generateDateString(validEvent.startDate, endtime);

        let currentstart = new Date(startstring);
        let currentend = new Date(endstring); 

        if(endtime === "00:00:00") {
            //Logger.log("12 gio rui :v");
            currentend.setDate(currentend.getDate() + 1);
        }
        const weekdays = [WEEKDAYS_MAPPING[validEvent.weekday]];

        const eventSeries = calendar.createEventSeries(name,
            currentstart, 
            currentend,
            CalendarApp.newRecurrence().addWeeklyRule().interval(gap)
                .onlyOnWeekdays(weekdays)
                .until(enddate))
        .setDescription(validEvent.description)
        .setColor(validEvent.color)
        ;

        Logger.log("Added: " + name);
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
        const calendar = google.calendar({version: 'v3', auth: this.userCredentials});
        const res = await calendar.events.list({
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
