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

const getFormattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth();
  let day = today.getDate() + 1;

  // Pad single digits with leading zeros
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }

  return `${day}/${month}/${year}`;
};

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

// Get appointments
app.get('/programari', (req, res) => {
  pool.getConnection((err, connection) => {
    if(err) throw err

    const query = `
    SELECT p.data, d.nume AS doctor_name, d.email AS doctor_email, d.nr_telefon AS doctor_phone, d.specializare AS specialization, d.cabinet AS room
    FROM programari p
    INNER JOIN doctori d ON p.id_doctor = d.id_doctor
    WHERE p.id_pacient = ?
    ORDER BY -p.data`;

    connection.query(query, [loggedIn.id_pacient], (err, rows) => {
      connection.release()

      if (!err)
        res.send(rows)
      else  
        console.log(err)
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

app.get('/doctor/specialization/:specialization', (req, res) => {
  const specialization = req.params.specialization;
  
  pool.getConnection((err, connection) => {
    if (err) throw err;

    const query = `
      SELECT *
      FROM doctori
      WHERE specializare = ?`;

    connection.query(query, [specialization], (err, rows) => {
      connection.release();

      if (!err)
        res.send(rows);
      else
        console.log(err);
    });
  });
});



// Profile route to send user information
app.get('/profile/user', (req, res) => {
  // Check if the user is logged in
  if (loggedIn) {
    // User is logged in
    const user = req.session.user;
    // Send the user information as a JSON response
    res.json(user);
  } else {
    // User is not logged in
    res.status(401).json({ error: 'Unauthorized' });
  }
});

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

// Add appointment
app.post('/appointment', async (req, res) => {
  try {
    const { id_doctor, data } = req.body;
    const id_pacient = loggedIn.id_pacient; // Assuming you have stored the patient ID in the session

    // Example code using a SQL query with placeholders
    const query = 'INSERT INTO programari (id_doctor, id_pacient, data) VALUES (?, ?, ?)';
    const values = [id_doctor, id_pacient, data];

    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        return;
      }

      connection.query(query, values, (err, result) => {
        connection.release();

        if (err) {
          console.log(err);
          return;
        }

        console.log("New appointment created!");
        res.redirect("/profile");
      });
    });
  } catch (err) {
    console.log(err);
  }
});


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
  // Check if the user is logged in
  if (loggedIn) {
    // User is logged in
    const user = req.session.user;
    // Render the profile page with the user information
    res.render('appointment', { currentDate: getFormattedDate() });
  }
  else {
    // User is not logged in, redirect to login page
    res.redirect('/login');
  }
});

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