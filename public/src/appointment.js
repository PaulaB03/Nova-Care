const menu = document.querySelector('#doctors');
const form = document.querySelector('form');

// Add an event listener to the form submit event
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the default form submission

  const specialization = document.getElementById('specialization').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value + ':00';

  // Make an AJAX request to the server
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `/available-doctors?specialization=${encodeURIComponent(specialization)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const availableDoctors = JSON.parse(xhr.responseText);
      const doctors = availableDoctors.availableDoctors;

      menu.innerHTML = '';
      for (var i = 0; i < doctors.length; i++)
        appendDoctor(doctors[i]);

      console.log(doctors);
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
  const selectedHour = document.getElementById('time').value;

  // Create the appointment data object
  const appointmentData = {
    id_doctor: doctorId,
    data: selectedDate,
    ora: selectedHour
  };
  console.log(appointmentData)

  fetch('/appointment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(appointmentData)
  })
  .then(response => {
    if (response.ok) {
      console.log('Appointment created successfully!');
      window.location.href = '/profile';
    } else {
      console.log('Appointment creation failed');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
