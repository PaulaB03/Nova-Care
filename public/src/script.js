// Variabile pentru login si register
const loginBtn = document.querySelector('.btn-login');
const logoutBtn = document.querySelector('.btn-logout');
const loginTab = document.querySelector('.login-tab');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const loginForm = document.querySelector('.form-box.login');
const registerForm = document.querySelector('.form-box.register');
const iconClose = document.querySelector('.icon-close');
        
// Variabile pentru formular de login si register
const fromEmailLogin = document.getElementById('fromEmailLogin');
const fromPasswordLogin = document.getElementById('fromPasswordLogin');
const fromUsername = document.getElementById('fromUsername');
const fromEmailRegister = document.getElementById('fromEmailRegister');
const fromPasswordResiter = document.getElementById('fromPasswordRegister');
        
// Variablie submit pentru login si register
const submitLogin = document.getElementById('submitLogin');
const submitRegister = document.getElementById('submitRegister');

// Variabile pentru link-urile utilizatorului
const appointmentLink = document.querySelector('.nav-appointment');
const profileLink = document.querySelector('.nav-profile');
  
// Eveniment buton Log in (navbar)
loginBtn.addEventListener('click', () => {
    loginTab.style.display = 'block'; 
    loginForm.style.display = 'block'; 
    registerForm.style.display = 'none'; 
})   
          
// Eveniment buton cancel (login/register)
iconClose.addEventListener('click', () => {
    loginTab.style.display = 'none'; // Ascunde menul log in
    console.log("am inchis tab-ul"); // !!!!!Delete later!!!!!
        
    // Cand inchidem tab-ul se reseteaza valorile din formular
    resetInput();
}) 

// Eveniment link login
loginLink.addEventListener('click', () => {
    loginForm.style.display = 'block'; 
    registerForm.style.display = 'none'; 

    // Cand schimbam tab-ul reseteaza valorile din formular
    resetInput();
});
        
// Add event for the register link
registerLink.addEventListener('click', () => {
    registerForm.style.display = 'block'; 
    loginForm.style.display = 'none';

    // Cand schimbam tab-ul reseteaza valorile din formular
    resetInput();
});

// Eveniment buton Login
submitLogin.addEventListener('click', () => {
    const email = fromEmailLogin.value
    const password = fromPasswordLogin.value
        
    // Query the database for the user with the provided email and password
    fetch(`/pacienti/email/${email}/password/${password}`)
    .then(response => response.json())
    .then(data => {
        if (data.length === 1) {
            console.log("Esti logat")
            loggedIn();
        } else {
            console.log("doesn't exist")
        }
    })
    
    .catch(error => console.error(error))
})
        
// Eveniment buton Register
submitRegister.addEventListener('click', () => {
    const email = fromEmailRegister.value
    const password = fromPasswordResiter.value
    const username = fromUsername.value
  
    // Creeaza conexiune cu serverul
    pool.getConnection((err, connection) => {
      if (err) throw err
  
      // Creeaza un obiect pacient
      const newPatient = {
        nume: username,
        email: email,
        parola: password,
        nr_telefon: null,
        zi_nastere: null,
        sex: null,
        grupa_sanguina: null,
        afectiuni: null,
        alergii: null
      }
  
      // execute the SQL query to insert the new patient record into the database
      connection.query('INSERT INTO pacienti SET ?', newPatient, (err, results) => {
        connection.release(); // return the connection to the pool
  
        if (err) throw err
  
        // send a response back to the client indicating that the patient was added successfully
        res.send(`New patient added with ID: ${results.insertId}`)
      })
    })
})

// Eveniment buton Logout
logoutBtn.addEventListener('click', () => {
    // remove id

    loginBtn.style.display = 'initial';
    logoutBtn.style.display = 'none';

    appointmentLink.style.display = 'none';
    profileLink.style.display = 'none';
})

// Functie pentru reinitializarea variabilelor de login
function resetInput() {
    fromEmailLogin.value = '';
    fromEmailRegister.value = '';
    fromUsername.value = '';
    fromPasswordLogin.value = '';
    fromPasswordResiter.value = '';
}

// Functie activare meniu utilizator
function loggedIn() {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'initial';
    loginTab.style.display = 'none';

    appointmentLink.style.display = 'initial';
    profileLink.style.display = 'initial';

    resetInput();
}