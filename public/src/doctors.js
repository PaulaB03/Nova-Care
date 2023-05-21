const menu = document.getElementById("doctors")
const specialization = document.getElementById('specialization')

// fetch the doctors
fetch('http://localhost:5000/doctori')
.then(function (response) {
    response.json().then(function (doctori) {
        for (i=0; i < doctori.length; i++) {
            appendDoctor(doctori[i]);
        }
    });
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

    // Append elements
    div.appendChild(name);
    div.appendChild(email);
    div.appendChild(phone);
    div.appendChild(specialization);
    div.appendChild(location);

    // Create doctor obj
    let doc = document.createElement('div');
    doc.classList.toggle('doctor');

    doc.appendChild(img);
    doc.appendChild(div);

    menu.appendChild(doc);
}

const doctors = document.getElementsByClassName('doctor')
function filterDoctors() {
    var selectedSpecialization = specialization.value;
  
    for (var i = 0; i < doctors.length; i++) {
        var doctor = doctors[i];
        var doctorSpecialization = doctor.querySelector('.specialization').textContent;
        
        if (selectedSpecialization === 'all' || doctorSpecialization === selectedSpecialization) 
            doctor.classList.remove('hide');
        else 
            doctor.classList.add('hide');
    }
}

specialization.addEventListener('change', filterDoctors);
filterDoctors();