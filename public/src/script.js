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
const fromPhone = document.getElementById('fromPhone');
const fromEmailRegister = document.getElementById('fromEmailRegister');
const fromPasswordResiter = document.getElementById('fromPasswordRegister');
        
// Variablie submit pentru login si register
const submitLogin = document.getElementById('submitLogin');
const submitRegister = document.getElementById('submitRegister');

// Variabile pentru link-urile utilizatorului
const appointmentLink = document.querySelector('.nav-appointment');
const profileLink = document.querySelector('.nav-profile');

// const pool = window.pool;

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
    fetch(`/pacient/email/${email}/password/${password}`)
    .then(response => response.json())
    .then(data => {
        if (data.length === 1) {
            console.log("Esti logat")
            loggedIn();
        } else {
            alert("Email sau parola incorecta!")
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
    const phone = fromPhone.value
  

    // Creeaza un obiect pacient
    const newPatient = {
        nume: username,
        email: email,
        parola: password,
        nr_telefon: phone,
        zi_nastere: null,
        sex: null,
        grupa_sanguina: null,
        afectiuni: null,
        alergii: null
    }

    fetch('/pacienti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPatient)
    })
    .then(response => response.text())
    .catch(error => {
        console.error(error);
    })

    console.log("registred")
    resetInput()
    loginTab.style.display = 'none'
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