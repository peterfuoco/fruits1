require('dotenv').config();
const express = require("express");
const app = express(); //app is an object
const methodOverride = require("method-override");
const jwt = require('jsonwebtoken');
const cookParser = require('cookie-parser');

app.use(cookParser());
app.use(express.static("public"));

//after app has been defined, use methodOverride.
//We'll be adding a query parameter to our delete form named _method
app.use(methodOverride("_method"));

//near the top, around other app.use() calls
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  let logStatement = `${req.method} ${req.url}`;
  if(Object.keys(req.body).length > 0) {
    logStatement += ` -- body: ${JSON.stringify(req.body)}`;
  }
  console.log(logStatement);
  next();
});


const verifyToken = (req, res, next) => {
  let token = req.cookies.jwt;

  console.log('Cookies: ', token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err || !decodedUser) {
      return res.status(401).json({ error: 'Unauthorized Request' });
    }

    req.user = decodedUser;
    console.log(decodedUser);
    next();
  })
};

app.use("/fruits", require("./controllers/fruitsController.js"));
app.use("/users", verifyToken, require("./controllers/usersController.js"));
app.use('/auth', require('./controllers/authController'));

app.get('/', (req, res) => res.render('users/index.ejs'));

app.listen(process.env.PORT, () => {
  console.log("I am listening");
});
