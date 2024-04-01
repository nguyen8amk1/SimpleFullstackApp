const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const CalendarCreator = require('./CalendarCreator');
const {HTMLCalendarParser} = require('./CalendarParsers');

const { datetime, RRule, RRuleSet, rrulestr } = require('rrule');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.readonly'];


// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }

  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: '7b67866fd7f5842220add4245ec3b230fc0790c2ceb0b56de40a1d8fe3f3f7ab@group.calendar.google.com', 
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
}

//authorize().then(listEvents).catch(console.error);
// Input: 
    // user credentials
    // calendar information
// Output: 
//  success/failed message


// NOTE: this should be generated from the HTML parser 
let schedule = 
[
  {
    name: 'Đồ họa máy tính - CS105.O21.KHCL - VN',
    startDate: '19/02/24',
    endDate: '08/06/24',
    startTime: '07:30:00',
    endTime: '09:45:00',
    gap: 1,
    description: 'P B1.10 - CS105.O21.KHCL - VN - Sĩ số: 49}',
    color: 11,
    weekday: 4
  },
  {
    name: 'Bảo mật web và ứng dụng - NT213.O22.ATCL.1 - VN(HT1) - (Cách 2 tuần)',
    startDate: '04/03/24',
    endDate: '01/06/24',
    startTime: '07:30:00',
    endTime: '11:30:00',
    gap: 2,
    description: 'P B4.06 (PM) - NT213.O22.ATCL.1 - VN(HT1) - (Cách 2 tuần) - Sĩ số: 23}',
    color: 6,
    weekday: 5
  },
  {
    name: 'Các phương pháp lập trình - SE334.O21.PMCL - VN - (Cách 2 tuần)',
    startDate: '19/02/24',
    endDate: '15/06/24',
    startTime: '07:30:00',
    endTime: '10:45:00',
    gap: 2,
    description: 'P B4.10 - SE334.O21.PMCL - VN - (Cách 2 tuần) - Sĩ số: 50}',
    color: 4,
    weekday: 7
  },
  {
    name: 'Cơ chế hoạt động của mã độc - NT230.O21.ATCL - VN',
    startDate: '19/02/24',
    endDate: '08/06/24',
    startTime: '08:15:00',
    endTime: '09:45:00',
    gap: 1,
    description: 'P C212 (CLC) - NT230.O21.ATCL - VN - Sĩ số: 26}',
    color: 11,
    weekday: 3
  },
  {
    name: 'Bảo mật web và ứng dụng - NT213.O22.ATCL - VN',
    startDate: '19/02/24',
    endDate: '08/06/24',
    startTime: '08:15:00',
    endTime: '09:45:00',
    gap: 1,
    description: 'P C301 (CLC) - NT213.O22.ATCL - VN - Sĩ số: 45}',
    color: 6,
    weekday: 6
  },
  {
    name: 'Cơ chế hoạt động của mã độc - NT230.O21.ATCL.1 - VN(HT1) - (Cách 2 tuần)',
    startDate: '04/03/24',
    endDate: '01/06/24',
    startTime: '13:00:00',
    endTime: '17:00:00',
    gap: 2,
    description: 'P B2.18 (PM) - NT230.O21.ATCL.1 - VN(HT1) - (Cách 2 tuần) - Sĩ số: 26}',
    color: 11,
    weekday: 3
  },
  {
    name: 'Tư duy tính toán - CS117.O21 - VN',
    startDate: '19/02/24',
    endDate: '08/06/24',
    startTime: '13:00:00',
    endTime: '15:15:00',
    gap: 1,
    description: 'P C214 (CLC) - CS117.O21 - VN - Sĩ số: 100}',
    color: 6,
    weekday: 6
  }
]; 

const generateDateTimeString = (date, time) => {
    let result = "";
    const [day, month, year] = date.split('/');
    const fullYear= '20'+ year;
    result += fullYear + '-' + month + '-' + day;
    result += 'T'; 
    result += time; 
    result += '+07:00'; 
    return result;
}

const main = async () => {
    try { 
        // NOTE: this authorize() function is gonna be move to it's own block with output is the userCredentials 
        const userCredentials = await authorize();
        console.log(userCredentials);
        // TODO: create new Calendar

        const calendarParser = new HTMLCalendarParser();
        calendarParser.setData("./tkb.html");
        const schedule1 = calendarParser.parse();

        const calendarCreator = new CalendarCreator(userCredentials);
        await calendarCreator.enableRandomColors();
        const calendarId = await calendarCreator.newCalendar("vailonchimen");
        calendarCreator.setCalendarId(calendarId);
        await calendarCreator.generateResultCalendar(schedule1);


    } catch (err) {
        console.error(err);
    } 
};

main();
