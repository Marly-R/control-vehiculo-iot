let movimientosGrabados = [];
let enProgramacion = false;
let velocidadActual = "medio"; // Valores posibles: "bajo", "medio", "alto"

function sendCommand(command) {
    const data = {
        name: "Marly Galarza",
        ip: "192.123.23.43",
        status: command,
        velocidad: velocidadActual
    };

    // Si estamos en modo programación y no hemos llegado al límite
    if (enProgramacion && movimientosGrabados.length < 10) {
        movimientosGrabados.push(command);

        // Marcar visualmente el botón presionado
        document.querySelectorAll('.control-btn').forEach(btn => {
            if (btn.textContent.trim() === command.trim()) {
                btn.classList.add('selected');
            }
        });
    }

    fetch('http://44.201.22.175/api/devices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en la solicitud');
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

// Iniciar grabación
function iniciarProgramacion() {
    enProgramacion = true;
    movimientosGrabados = [];

    // Limpiar botones resaltados
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    alert("Modo programación activado. Puedes grabar hasta 10 movimientos.");
}

// Detener grabación
function detenerProgramacion() {
    enProgramacion = false;
    alert(`Grabación finalizada. Se grabaron ${movimientosGrabados.length} movimientos.`);
}

// Reproducir movimientos grabados
function reproducirMovimientos() {
    if (movimientosGrabados.length === 0) {
        alert("No hay movimientos grabados.");
        return;
    }

    let i = 0;
    const intervalo = setInterval(() => {
        if (i < movimientosGrabados.length) {
            sendCommand(movimientosGrabados[i]);
            i++;
        } else {
            clearInterval(intervalo);
            document.getElementById('movementStatus').textContent = "Reproducción finalizada.";
        }
    }, 1000); // 1 segundo entre cada movimiento
}

// Modo demo: elegir movimiento aleatorio
function demoMovimiento() {
    const comandos = [
    "VUELTA ADELANTE IZQUIERDA",
    "GIRO 360° IZQUIERDA",
    "GIRO 90° IZQUIERDA",
    "VUELTA ATRÁS IZQUIERDA",
    "AVANZAR",
    "RETROCEDER",
    "DETENER",
    "VUELTA ADELANTE DERECHA",
    "GIRO 360° DERECHA",
    "GIRO 90° DERECHA",
    "VUELTA ATRÁS DERECHA"
    ];

    const comandoAleatorio = comandos[Math.floor(Math.random() * comandos.length)];
    sendCommand(comandoAleatorio);
}

// Cambiar velocidad del vehículo
function setVelocidad(nivel) {
    velocidadActual = nivel;
    alert(`Velocidad establecida: ${nivel.toUpperCase()}`);
}
