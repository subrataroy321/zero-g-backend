// import requireed node modules into variables
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const users = require('./routes/api/users');
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Custom Request Logger Middleware
app.use((req, res, next) => {
  const url = req.url;
  const method = req.method;

  // Destructuring
  // const { url, method } = req;

  const requestedAt = new Date().toLocaleTimeString();
  const result = `${method} ${url} ${requestedAt}`;
  console.log(result);

  next();
});

// passport middleware
app.use(passport.initialize());

// importing passport file into server
require('./config/passport')(passport);

// <<<<<<<<  SERVER HOME ROUTE >>>>>>>>>>>
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Smile, You are being watched by the Backend Team' });
});

// api/users route middleware
app.use('/api/users', users);

// SERVER PORT TO LISTEN
app.listen(port, () => {
  console.log(`You are lisening smooth to port ${port}`);
});
