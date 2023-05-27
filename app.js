if (process.env.NODE_ENV != "production") {
  require("dotenv").config()
}

const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const app = express()
const port = process.env.PORT || 5000
const fetch = require('node-fetch');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const flash = require("express-flash")
const session = require("express-session")
var loggedIn = null;


app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.use('/favicon.ico', express.static('/css/images/favicon.ico'))

// Set views
app.set('views', './views')
app.set('view engine', 'ejs')

// MySQL
const pool = mysql.createPool({
    connectionLimit : 10, // numar maxim de conexiuni
    host            : 'localhost',
    user            : 'root',
    password        : 'password',
    database        : 'novacare'
})

// Get all doctors
app.get('/doctori', (req, res) => {
    pool .getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        // query (sqlString, callback)
        connection.query('SELECT * FROM doctori', (err, rows) => {
            connection.release()        // return the connection to pool

            if (!err) {
                res.send(rows)
            }
            else {
                console.log(err)
            }
        })
    })
})

// Get all patient by email
app.get('/pacient/email/:email', (req, res) => {
  pool .getConnection((err, connection) => {
    if(err) throw err
    console.log(`connected as id ${connection.threadId}`)

    // query (sqlString, callback)
    connection.query('SELECT * from pacienti WHERE email = ?', [req.params.email], (err, rows) => {
      connection.release()        // return the connection to pool

      if (!err) {
        res.send(rows)
      } else {
        console.log(err)
      }
    })
  })
})

// Login
app.post("/login", (req, res) => {

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      // Handle the error
      req.flash("error", "An error occurred");
      res.redirect("/login");
      return;
    }

    const values = [email, parola] = [req.body.email, req.body.password];
    // query (sqlString, values, callback)
    connection.query(
      'SELECT * FROM pacienti WHERE email = ? AND parola = ?',
      values,
      (err, rows) => {
        connection.release(); // Return the connection to the pool

        if (err) {
          console.log(err);
          // Handle the error
          req.flash("error", "An error occurred");
          res.redirect("/login");
          return;
        }

        if (rows.length === 1) {
          // Authentication successful
          const user = rows[0];
          loggedIn = user;
          req.session.user = user;
          res.redirect("/profile");
        } else {
          // Authentication failed
          res.redirect("/login");
          console.log("password incorect!")
        }
      }
    );
  });
});


// Add new patient
app.post("/register", async (req, res) => {
  try {
    pool.getConnection((err, connection) => {
      if(err) throw err
      
      const sql = 'INSERT INTO pacienti (nume, email, parola, nr_telefon, zi_nastere, sex, grupa_sanguina, afectiuni, alergii) VALUES (?, ?, ?, ?, null, null, null, null, null)';
      const values = [nume, email, parola, nr_telefon] = [req.body.name, req.body.email, req.body.password, req.body.phone];

      
      connection.query(sql, values, (err, result) => {
        connection.release() // return the connection to pool
        if (err) {
            console.log(err)
        }
        
        console.log("New patient added!")
        res.redirect("/login")

      })
  })
  }
  catch (e){
    console.log(e)
    res.redirect("/register")
  }
})

// Routes
app.get('/about', (req, res) => {
  res.render('about', { user: loggedIn });
})

app.get('/doctors', (req, res) => {
  res.render('doctors', { user: loggedIn });
})

app.get('/login', (res, req) => {
  req.render('login')
})

app.get('/register', (res, req) => {
  req.render('register')
})

app.get('/profile', (req, res) => {
  // Check if the user is logged in
  if (loggedIn) {
    // User is logged in
    const user = req.session.user;
    // Render the profile page with the user information
    res.render('profile', { user });
  } else {
    // User is not logged in, redirect to login page
    res.redirect('/login');
  }
});

app.get('/appointment', (req, res) => {
  res.render('appointment')
})

app.get('/logout', (req, res) => {
  // Clear the user session and set loggedIn to null
  req.session.user = null;
  loggedIn = null;

  // Redirect the user to the login page
  res.redirect('/login');
});

// End Routes


app.listen(port, () => {
  console.log('Server started on port 5000')
})