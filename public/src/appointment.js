const menu = document.querySelector('#doctors');
const form = document.querySelector('form');

// Add an event listener to the form submit event
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission

  const specialization = document.getElementById('specialization').value;
  const date = document.getElementById('date').value;

  // Make an AJAX request to the server
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/doctor/specialization/${encodeURIComponent(specialization)}?date=${encodeURIComponent(date)}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const doctors = JSON.parse(xhr.responseText);

      // Clear the doctorsContainer before adding new doctors
      menu.innerHTML = '';

      // Add new doctors
      doctors.forEach((doctor) => {
        appendDoctor(doctor);
      });
    }
  };
  xhr.send();
});

function appendDoctor(doctor) {
  // Create image obj
  let img = document.createElement('img');
  img.classList.toggle('picture');
  img.src = 'https://raw.githubusercontent.com/PaulaB03/Nova-Care/main/public/images/doctor' + doctor['id_doctor'] + '.jpg';

  // Create name obj
  let name = document.createElement('h2');
  name.classList.toggle('name');
  name.innerText = doctor['nume'];

  // Create email obj
  let email = document.createElement('p');
  email.classList.toggle('email');
  email.innerText = doctor['email'];

  // Create phone obj
  let phone = document.createElement('p');
  phone.classList.toggle('phone');
  phone.innerText = doctor['nr_telefon'];

  // Create specialization obj
  let specialization = document.createElement('p');
  specialization.classList.toggle('specialization');
  specialization.innerText = doctor['specializare'];

  // Create location obj
  let location = document.createElement('p');
  location.classList.toggle('location');
  location.innerText = doctor['cabinet'];

  // Create  information object
  let div = document.createElement('div');
  div.classList.toggle('information');

  // Create button object
  let button = document.createElement('button');
  button.classList.toggle('submit-button');
  button.type = 'submit';
  button.classList.toggle('btn-submit');
  button.id = 'commit';
  button.innerText = 'Adauga programare';

  // Add click event listener to the button
  button.addEventListener('click', () => {
    createAppointment(doctor['id_doctor']);
  });


  // Append elements
  div.appendChild(name);
  div.appendChild(email);
  div.appendChild(phone);
  div.appendChild(specialization);
  div.appendChild(location);
  div.appendChild(button);

  // Create doctor obj
  let doc = document.createElement('div');
  doc.classList.toggle('doctor');

  doc.appendChild(img);
  doc.appendChild(div);

  menu.appendChild(doc);
}

function createAppointment(doctorId) {
  const selectedDate = document.getElementById('date').value;

  // Create the appointment data object
  const appointmentData = {
    id_doctor: doctorId,
    data: selectedDate,
  };

  // Make an AJAX request to create the appointment
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/appointment', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      console.log('Appointment created successfully!');
      window.location.href = '/profile';
    }
  };
  xhr.send(JSON.stringify(appointmentData));
}
