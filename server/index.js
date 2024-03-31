const express = require('express');
const cookieSession = require('cookie-session');
const session = require('express-session')
const cors = require('cors');
const authRouter = require('./routes/auth');

const app = express(); 
const port = 8000; 

const passport  = require('passport');
const passportSetup  = require('./passport');

// app.use(session({
//     // genid: function(req) {
//     //     return genuuid() // use UUIDs for session IDs
//     // },
//     secret: 'ditmesaigon',
//     resave: false,
//     saveUninitialized: true,
//     //cookie: { secure: true }
// }));

app.use(cookieSession({
    name: 'session', 
    keys: ['ditmesaigon'], 
    maxAge: 24*60*60*100
})); 

app.use(passport.initialize());
app.use(passport.session());


app.use(cors({
    origin: "http://localhost:3000", 
    methods: "GET,POST,PUT,DELETE", 
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
}); 

app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
