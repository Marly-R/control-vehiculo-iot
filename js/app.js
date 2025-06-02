// Variable global para almacenar la IP pública
let globalIP = "";

// Modo programación y movimientos almacenados
let modoProgramacion = false;
let movimientosProgramados = [];
const maxMovimientos = 10;

// Obtener IP pública al cargar la página
function obtenerIP() {
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      globalIP = data.ip;
      console.log('IP pública obtenida:', globalIP);
    })
    .catch(error => {
      console.error('Error al obtener la IP:', error);
    });
}

window.onload = obtenerIP;

// Función para enviar comandos
function sendCommand(command) {
  if (modoProgramacion) {
    if (movimientosProgramados.length < maxMovimientos) {
      movimientosProgramados.push(command);
      actualizarListaProgramacion();

      // Resaltar visualmente el botón
      document.querySelectorAll('.control-btn').forEach(btn => {
        if (btn.textContent.trim() === command.trim()) {
          btn.classList.add('selected');
        }
      });
    } else {
      alert("Has alcanzado el máximo de 10 movimientos.");
    }
  } else {
    document.getElementById('movementStatus').innerText = command;

    const data = {
      name: "Marly Galarza",
      ip: globalIP || "IP-no-disponible",
      status: command
    };

    fetch('http://34.236.244.24/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) throw new Error('Error en la solicitud');
      return response.json();
    })
    .then(data => {
      console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('movementStatus').textContent = "Error al enviar orden";
    });
  }
}

function actualizarListaProgramacion() {
  const lista = document.getElementById('lista-programacion');
  if (lista) {
    lista.innerHTML = '';
    movimientosProgramados.forEach((mov, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${mov}`;
      lista.appendChild(li);
    });
  }
}

function toggleModo() {
  modoProgramacion = !modoProgramacion;
  const panel = document.getElementById('programacion-controls');
  if (modoProgramacion) {
    panel.style.display = 'block';
    document.getElementById('movementStatus').innerText = 'Gabacion Activada';
  } else {
    panel.style.display = 'none';
    movimientosProgramados = [];
    actualizarListaProgramacion();
    document.getElementById('movementStatus').innerText = 'Grabacion desactivada';
  }
}

async function enviarMovimientosProgramados() {
  if (movimientosProgramados.length === 0) {
    alert("No hay movimientos para ejecutar.");
    return;
  }

  document.getElementById('movementStatus').innerText = 'Ejecutando secuencia...';

  for (let i = 0; i < movimientosProgramados.length; i++) {
    const comando = movimientosProgramados[i];
    const data = {
      name: "Marly Galarza",
      ip: globalIP || "IP-no-disponible",
      status: comando
    };

    try {
      const res = await fetch('http://34.236.244.24/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Error HTTP ' + res.status);

      document.getElementById('movementStatus').innerText = `Ejecutando: ${comando} (${i + 1}/${movimientosProgramados.length})`;
    } catch (error) {
      console.error("Error enviando comando programado:", error);
      document.getElementById('movementStatus').textContent = 'Error enviando comando: ' + comando;
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  movimientosProgramados = [];
  actualizarListaProgramacion();
  modoProgramacion = false;
  toggleModo();
}

function actualizarVelocidad(valor) {
  document.getElementById('velDisplay').innerText = valor;

  fetch('http://54.236.243.52/api/velocidad', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ velocidad: parseInt(valor) })
  })
  .then(response => response.json())
  .then(data => console.log("Velocidad actualizada:", data))
  .catch(error => console.error("Error al actualizar velocidad:", error));
}

function demoRandom() {
  const demoComandos = [
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

  const comando = demoComandos[Math.floor(Math.random() * demoComandos.length)];
  sendCommand(comando);
}

// WebSocket opcional (comentado por defecto)
/*
const socket = new WebSocket("wss://TU-SERVIDOR-AWS:8765");
socket.onopen = () => {
  console.log("WebSocket conectado.");
};
socket.onerror = (error) => {
  console.error("WebSocket Error:", error);
};
*/
