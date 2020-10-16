require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;

// load user model
const db = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
  db.User.find()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

// POST route api/users/register (Public)
router.post('/register', (req, res) => {
  db.User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ msg: 'Email already exists.' });
      } else if (req.body.password === req.body.confirmPassword) {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          mass: req.body.mass,
          height: req.body.height,
          age: req.body.age,
          boneDensity: req.body.boneDensity,
          destination: {
            name: req.body.plannet,
            totalTripDays: req.body.days,
            tripStarted: req.body.tripStarted,
          },
        });

        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(newUser.password, salt, (error, hash) => {
            if (error) throw error;

            newUser.password = hash;
            newUser
              .save()
              .then((createdUser) => res.json(createdUser))
              .catch((error) => res.json(error));
          });
        });
      } else {
        return res.status(400).json({
          msg: "Password and Confirm Password Doesn't match. Please try again",
        });
      }
    })
    .catch((err) => {
      console.log('Error while creating a user ', err);
      res.status(503).send({ message: 'Server Error' });
    });
});

// POST api/users/login (Public)
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // find user using email
  db.User.findOne({ email })
    .populate('exercises')
    .then((user) => {
      if (!user) {
        res.status(400).json({ message: 'User not found' });
      } else {
        // check input password and saved password with bcrypt
        bcrypt.compare(password, user.password).then((isMatch) => {
          // if matchs generate a token using user saved information
          if (isMatch) {
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            const startDate = user.destination.tripStarted;
            const todaysDate = new Date();
            const diffDays = Math.round(
              Math.abs((startDate - todaysDate) / oneDay)
            );

            const payload = {
              id: user.id,
              name: user.name,
              email: user.email,
              mass: user.mass,
              height: user.height,
              age: user.age,
              boneDensity: user.boneDensity,
              exercises: user.exercises,
              // imageId: user.imageId,
              destination: {
                name: user.destination.name,
                totalTripDays: user.destination.totalTripDays,
                daysInTrip: diffDays,
              },
            };

            // sign in token
            jwt.sign(
              payload,
              JWT_SECRET,
              { expiresIn: 3600 },
              (error, token) => {
                res.json({ success: true, token: `bearer ${token}` });
              }
            );
          } else {
            return res
              .status(400)
              .json({ password: 'Password or email is incorrect' });
          }
        });
      }
    })
    .catch((err) => {
      console.log('Error while creating a user ', err);
      res.status(503).send({ message: 'Server Error' });
    });
});

// update route for profile data
router.post('/updateData', (req, res) => {
  const email = req.body.email;
  const name = req.body.name;

  // find user using email
  db.User.findOneAndUpdate({ email }, { name })
    .then((user) => {
      if (!user) {
        res.status(400).json({ message: 'User not found' });
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.log('Error while creating a user ', err);
      res.status(503).send({ message: 'Server Error' });
    });
});

// update route for image
router.post('/updateImage', (req, res) => {
  const email = req.body.email;
  const imageId = req.body.imageId;

  // find user using email
  db.User.findOneAndUpdate({ email }, { imageId })
    .then((user) => {
      if (!user) {
        res.status(400).json({ message: 'User not found' });
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.log('Error while creating a user ', err);
      res.status(503).send({ message: 'Server Error' });
    });
});

// GET /api/users
router.get('/:id', (req, res) => {
  db.User.findById(req.params.id)
    .populate('exercises')
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
    });
});

// GET api/users/current (Private)
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(res);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      mass: req.user.mass,
      height: req.user.height,
      age: req.user.age,
      boneDensity: req.user.boneDensity,
      imageId: req.user.imageId,
      exercises: req.user.exercises,
      token: req.query.secret_token,
    });
  }
);

module.exports = router;
