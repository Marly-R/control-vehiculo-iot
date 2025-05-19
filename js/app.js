function sendCommand(command) {
    const data = {
        name: "Marly Galarza",
        ip: "192.123.23.43",
        status: command
    };

    fetch('http://13.220.25.172/api/devices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then(data => {
        console.log('Respuesta del servidor:', data);
        document.getElementById('movementStatus').textContent = command;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('movementStatus').textContent = "Error al enviar orden";
    });
}
