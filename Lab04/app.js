// elementos del DOM
const formTarea = document.querySelector('#form-tarea');
const inputTitulo = document.querySelector('#titulo');
const inputCurso = document.querySelector('#curso');
const inputFecha = document.querySelector('#fechaEntrega');
const listaTareas = document.querySelector('#lista-tareas');
const divAlerta = document.querySelector('#alerta');

let tareas = JSON.parse(localStorage.getItem('tareas')) || [];
let filtroActual = 'todas';
document.addEventListener('DOMContentLoaded', renderizarTareas);
formTarea.addEventListener('submit', (e) => {
  e.preventDefault(); // Evitar recargaaaa 
  divAlerta.classList.add('d-none'); 

  const titulo = inputTitulo.value.trim();
  const curso = inputCurso.value.trim();
  const fechaEntrega = inputFecha.value;

  if (!titulo || !curso || !fechaEntrega) {
    mostrarAlerta('Todos los campos son obligatorios.');
    return;
  }
  const fechaSeleccionada = new Date(fechaEntrega + 'T00:00:00');
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (fechaSeleccionada <= hoy) {
    mostrarAlerta('La fecha de entrega debe ser posterior a la fecha actual.');
    return;
  }

  const nuevaTarea = {
    id: Date.now(),
    titulo,
    curso,
    fechaEntrega,
    completada: false
  };

  tareas.push(nuevaTarea);
  guardarYRenderizar();
  formTarea.reset();
});

function mostrarAlerta(mensaje) {
  divAlerta.textContent = mensaje;
  divAlerta.classList.remove('d-none');
}

// Guardar en localStorage 
function guardarYRenderizar() {
  localStorage.setItem('tareas', JSON.stringify(tareas));
  renderizarTareas();
}

function toggleCompletada(id) {
  tareas = tareas.map(tarea => 
    tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
  );
  guardarYRenderizar();
}

function eliminarTarea(id) {
  tareas = tareas.filter(tarea => tarea.id !== id);
  guardarYRenderizar();
}

function filtrarTareas(filtro) {
  filtroActual = filtro;
  document.querySelectorAll('.btn-group button').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase() === filtro) btn.classList.add('active');
  });

  renderizarTareas();
}

// Renderizar la lista de tareas (DOM)
function renderizarTareas() {
  listaTareas.innerHTML = '';

  // Filtrar según la opción seleccionada,no entendi algunas partes pero ahi vamos jaja.
  const tareasFiltradas = tareas.filter(tarea => {
    if (filtroActual === 'pendientes') return !tarea.completada;
    if (filtroActual === 'completadas') return tarea.completada;
    return true; 
  });

  if (tareasFiltradas.length === 0) {
    listaTareas.innerHTML = '<li class="list-group-item text-center text-muted">No hay tareas para mostrar.</li>';
    return;
  }
  tareasFiltradas.forEach(({ id, titulo, curso, fechaEntrega, completada }) => {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-center ${completada ? 'completada' : ''}`;
    
    li.innerHTML = `
      <div>
        <strong>${titulo}</strong> <small class="text-muted">(${curso})</small><br>
        <small class="text-secondary">Entrega: ${fechaEntrega}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-${completada ? 'warning' : 'success'} me-2" onclick="toggleCompletada(${id})">
          ${completada ? 'Desmarcar' : 'Completar'}
        </button>
        <button class="btn btn-sm btn-danger" onclick="eliminarTarea(${id})">Eliminar</button>
      </div>
    `;
    listaTareas.appendChild(li);
  });
}