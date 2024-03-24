const express = require('express');
const app = express();
const port = 3000

const cookieSecret = "ditmesaigon";

app.use(require('cookie-parser')(cookieSecret));
app.use(require('express-session'));

// TODO: test out the express-session 

app.get('/', (req, res) => {
    res.cookie('ditmesaigon', 'vailonchimen', {signed: true});
    res.send('Hello World!');
}); 

app.get('/vailon', (req, res) => {
    console.log(req.signedCookies);
    res.send('vailon');
}); 

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}); 
