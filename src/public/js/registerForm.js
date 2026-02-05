async function handleRegister(event) {
  event.preventDefault();

  const wrongInput = document.getElementById('wrong-input');

  const newUserData = {
    id: Number(document.getElementById('id').value),
    userName: document.getElementById('userName').value,
    password: document.getElementById('password').value,
    role: document.getElementById('role').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    registrationNumber: document.getElementById('registrationNumber').value,
    program: document.getElementById('program').value,
    firstName: document.getElementById('firstName').value,
    middleName: document.getElementById('middleName').value,
    firstLastName: document.getElementById('firstLastName').value,
    secondLastName: document.getElementById('secondLastName').value
  };

  try {
    const response = await fetch('/app/v1/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newUserData })
    });

    const data = await response.json();

    if (response.status === 201 && data.success === true) {
      // Registro exitoso → volver al login
      window.location.href = '/app/v1/';
    } else {
      wrongInput.textContent =
        data.message || 'Error al crear el usuario';
      wrongInput.style.display = 'block';
    }

  } catch (error) {
    wrongInput.textContent = 'Error de conexión con el servidor';
    wrongInput.style.display = 'block';
  }
}
