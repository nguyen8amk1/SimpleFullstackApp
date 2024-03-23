const express = require('express');
const cors = require('cors');
const authRouter = require('./src/routes/authRoutes');
const passport = require('./passport');

require('dotenv').config();

const bodyParser = require('body-parser')
const connectDB = require('./src/config/connectDB');


const app = express()
const port = process.env.PORT || 8888;

app.use(cors({
    origin: process.env.URL_CLIENT
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
connectDB();

app.use('/api/auth', authRouter);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
