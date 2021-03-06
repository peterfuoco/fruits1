require('dotenv').config();
const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');

const User = require("../models").User;

// GET SIGNUP FORM
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// GET LOGIN
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// POST LOGIN
router.post("/login", (req, res) => {
  User.findOne({
    where: { username: req.body.username },
  }).then((user) => {
    if (user) {
      bcryptjs.compare(req.body.password, user.password, (err, match) => {
        if (match) {
          const token = jwt.sign(
            {
              username: user.username,
              id: user.id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "30 days",
            }
          );

          console.log(token);
          res.cookie("jwt", token);

          res.redirect(`/users/profile/${user.id}`);
        } else {
          return res.sendStatus(400);
        }
      });
    }
  });
});

// POST - CREATE NEW USER FROM SIGNUP
router.post("/", (req, res) => {
  bcryptjs.genSalt(10, (err, salt) => {
    if (err) return res.status(500).json(err);

    bcryptjs.hash(req.body.password, salt, (err, hashedPwd) => {
      if (err) return res.status(500).json(err);

      req.body.password = hashedPwd;

      User.create(req.body)
        .then((newUser) => {
          const token = jwt.sign(
            {
              username: newUser.username,
              id: newUser.id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "30 days",
            }
          );

          console.log(token);
          res.cookie("jwt", token);
          res.redirect(`/users/profile/${newUser.id}`);
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    });
  });
});

module.exports = router;
