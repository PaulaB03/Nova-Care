const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

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


// // Get all patients
// app.get('/pacienti', (req, res) => {
//     pool .getConnection((err, connection) => {
//         if(err) throw err
//         console.log(`connected as id ${connection.threadId}`)

//         // quer (sqlString, callback)
//         connection.query('SELECT * from pacienti', (err, rows) => {
//             connection.release()        // return the connection to pool

//             if (!err) {
//                 res.send(rows)
//             }
//             else {
//                 console.log(err)
//             }
//         })
//     })
// })

// Get patient by email and password
app.get('/pacient/email/:email/password/:password', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
      console.log(`connected as id ${connection.threadId}`)
    
      const { email, password } = req.params
    
      // query (sqlString, values, callback)
      connection.query(
        'SELECT * FROM pacienti WHERE email = ? AND parola = ?',
        [email, password],
        (err, rows) => {
          connection.release(); // return the connection to pool
        
          if (!err) {
            res.send(rows);
          } else {
            console.log(err);
          }
        }
      )
  })
})


// Get all patient by email
app.get('/pacient/email/:email', (req, res) => {
  pool .getConnection((err, connection) => {
    if(err) throw err
    console.log(`connected as id ${connection.threadId}`)

    // quer (sqlString, callback)
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

// Add new patient
app.post('/pacienti', (req, res) => {
  const { nume, email, parola, nr_telefon, zi_nastere, sex, grupa_sanguina, afectiuni, alergii } = req.body;

  pool.getConnection((err, connection) => {
      if(err) throw err
      
      const sql = 'INSERT INTO pacienti (nume, email, parola, nr_telefon, zi_nastere, sex, grupa_sanguina, afectiuni, alergii) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [nume, email, parola, nr_telefon, zi_nastere, sex, grupa_sanguina, afectiuni, alergii];

      
      connection.query(sql, values, (err, result) => {
        connection.release() // return the connection to pool
        if (err) {
            console.log(err)
        }
        
        res.send(`New patient added`);

      })
  })
});

app.get('/index', (req, res) => {
  res.render('index')
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.listen(port, () => {
  console.log('Server started on port 5000')
})