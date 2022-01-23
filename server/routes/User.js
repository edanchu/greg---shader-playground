const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: 'greg',
      sub: userID,
    },
    'greg',
    { expiresIn: '1hr' }
  );
};

userRouter.post('/register', (req, res) => {
  const { email, username, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err)
      res.status(500).json({
        message: { msgBody: 'Server error has occured', msgError: true },
      });
    if (user)
      res.status(400).json({
        message: { msgBody: 'Email is already in use', msgError: true },
      });
    else {
      const newUser = new User({ email, username, password });
      newUser.save((err) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: { msgBody: 'Could not save user', msgError: true },
          });
        } else
          res.status(201).json({
            message: {
              msgBody: 'Account successfully created',
              msgError: false,
            },
          });
      });
    }
  });
});

userRouter.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, email, username } = req.user;
      const token = signToken(_id);
      res.cookie('access_token', token, { httpOnly: true, sameSite: true });
      res
        .status(200)
        .json({ isAuthenticated: true, user: { email, username } });
    }
  }
);

module.exports = userRouter;
