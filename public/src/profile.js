username = document.getElementById("name");
phone = document.getElementById("phone");
gender = document.getElementById("gender");
blood = document.getElementById("blood");
illness = document.getElementById("illness");
alergy = document.getElementById("alergy");
appointments = document.getElementById('appointments');

// Fetch the user information from the server
fetch('/profile/user')
  .then(response => response.json())
  .then(user => {
    renderProfile(user);
  })
  .catch(error => {
    console.log('Error:', error);
  });

// Fatch the appointments
fetch('http://localhost:5000/programari')
.then(function (response) {
    response.json().then(function (programari) {
        for (i=0; i < programari.length; i++)
            appendAppointment(programari[i]);
    })
})

// Function to render the user information
function renderProfile(user) {
    const userName = document.createElement('p').textContent = `${user.nume}`;
    username.append(userName);
    const userPhone = document.createElement('p').textContent = `${user.nr_telefon}`;
    phone.append(userPhone);
    const userGender = document.createElement('p').textContent = `${user.sex}`;
    gender.append(userGender);
    const userBlood = document.createElement('p').textContent = `${user.grupa_sanguina}`;
    blood.append(userBlood);
    const userIllness = document.createElement('p').textContent = `${user.afectiuni}`;
    illness.append(userIllness);
    const userAlergy = document.createElement('p').textContent = `${user.alergii}`;
    alergy.append(userAlergy);
}


function appendAppointment(appointment) {
    // Create specialization obj
    let specialization = document.createElement('h2');
    specialization.classList.toggle('specialization');
    specialization.innerText = appointment['specialization'];

    // Create name obj
    let name = document.createElement('p');
    name.classList.toggle('name');
    name.innerText = appointment['doctor_name'];

    // Create room obj
    let room = document.createElement('p');
    room.classList.toggle('room');
    room.innerText = appointment['room'];

    // Create date obj
    let date = document.createElement('p');
    date.classList.toggle('date');
    const dateString = appointment['data'];
    const dateObject = new Date(dateString);
    const formattedDate = dateObject.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    date.innerText = formattedDate;

    // Create appointment obj
    let doc = document.createElement('div');
    doc.classList.toggle('appointment');


    doc.appendChild(specialization);
    doc.appendChild(name);
    doc.appendChild(room);
    doc.appendChild(date);
    appointments.appendChild(doc);
}