const iconClose = document.querySelector('.icon-close');
const infoTab = document.querySelector('.login-tab');
const modifyBtn = document.querySelector('.modify');

username = document.getElementById("name");
phone = document.getElementById("phone");
gender = document.getElementById("gender");
blood = document.getElementById("blood");
illness = document.getElementById("illness");
alergy = document.getElementById("alergy");
appointments = document.getElementById('appointments');

function fetchUserProfile() {
  // Fetch the user information from the server
  fetch('/profile/user')
    .then(response => response.json())
    .then(user => {
      renderProfile(user);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

// Fetch the appointments
fetch('http://localhost:5000/programari')
.then(function (response) {
    response.json().then(function (programari) {
        for (i=0; i < programari.length; i++)
            appendAppointment(programari[i]);
    })
})


// Function to render the user information
function renderProfile(user) {
  document.getElementById('nume').textContent = user.nume;
  document.getElementById('telefon').textContent = user.nr_telefon;
  document.getElementById('sex').textContent = user.sex || 'N/A';
  document.getElementById('sange').textContent = user.grupa_sanguina || 'N/A';
  document.getElementById('afectiuni').textContent = user.afectiuni || 'N/A';
  document.getElementById('alergii').textContent = user.alergii || 'N/A';
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

    // Create time obj
    let time = document.createElement('p');
    time.classList.toggle('time');
    time.innerText = appointment['ora'].substring(0, 5);

    // Create appointment obj
    let doc = document.createElement('div');
    doc.classList.toggle('appointment');


    doc.appendChild(specialization);
    doc.appendChild(name);
    doc.appendChild(room);
    doc.appendChild(date);
    doc.appendChild(time);
    appointments.appendChild(doc);
}


// Eveniment buton cancel 
iconClose.addEventListener('click', () => {
  infoTab.style.display = 'none'; 
}) 

// Eveniment buton modificare informatii
modifyBtn.addEventListener('click', () => {
  infoTab.style.display = 'block';

  // Make an AJAX request to retrieve user information
  fetch('http://localhost:5000/profile/user')
    .then(response => response.json())
    .then(user => {
      // Prefill the input fields with user information
      document.getElementById('phoneForm').value = user.nr_telefon;
      document.getElementById('illnessForm').value = user.afectiuni;
      document.getElementById('alergyForm').value = user.alergii;
    })
    .catch(error => {
      console.error('Error retrieving user information:', error);
    });
})

// Event listener for form submission
document.getElementById("submitInfo").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the form inputs
  const phone = document.getElementById("phoneForm").value;
  const illness = document.getElementById("illnessForm").value;
  const allergy = document.getElementById("alergyForm").value;

  // Create a data object with the updated user information
  const data = {
    phone: phone,
    illness: illness,
    allergy: allergy
  };

  // Send a POST request to the server with the updated user information
  fetch('/modify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    infoTab.style.display = 'none';
    fetchUserProfile();
    console.log(result);
  })
  .catch(error => {
    console.log('Error:', error);
  });
});

fetchUserProfile();