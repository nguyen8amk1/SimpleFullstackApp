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
    console.log(credentials);
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
  console.log("authorized client: ", client);
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

//authorize().then(listEvents).catch(console.error);
// Input: 
    // user credentials
    // calendar information
// Output: 
//  success/failed message


// NOTE: this should be generated from the HTML parser 
const main = async () => {
    try {
        // const userCredentials = await authorize();
        // console.log(userCredentials);
        //TODO: create new Calendar
        const accessToken = something;
        const userCredentials = auth(accessToken);

        const calendarParser = new HTMLCalendarParser();
        calendarParser.setData("./tkb.html");

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
};

main();
