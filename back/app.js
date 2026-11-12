// ============================================================================
// ORQUESTADOR PRINCIPAL DE LA APLICACIÓN (Arquitectura Dividida por Dominios)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

// 1. DOMINIO 1: Tareas, Estado y Persistencia
import { cargarTareas, cargarCompletadas, persistirEstado } from './dominio1/estado.js';

// 2. DOMINIO 3: Pomodoro y Sesión de Enfoque
import { focusSession, iniciarSesionEnfoque, cancelarEnfoque } from './dominio3_pomodoro/focusPomodoro.js';

// 3. DOMINIO 4: Modales e Interfaz de Usuario
import { 
    tareaPendienteDeCompletar, 
    abrirModalCompletar, 
    cerrarModalCompletar, 
    construirTareaCompletada 
} from './dominio4_interfaz/modalCompletar.js';
import { abrirModalHorasRealizadas, cerrarModalHorasRealizadas } from './dominio4_interfaz/modalesHoras.js';
import { abrirModalFlashcards } from './dominio4_interfaz/flashcards.js';
import { renderAppDeclarativo } from './dominio4_interfaz/renderApp.js';
import { inicializarEventosUI } from './dominio4_interfaz/eventos.js';

// ============================================================================
// ESTADO INMUTABLE Y CICLO DE RENDERIZADO
// ============================================================================
let tareasState = cargarTareas();
let tareasCompletadasState = cargarCompletadas();

const guardarYRenderizar = () => {
    persistirEstado(tareasState, tareasCompletadasState);
    renderAppDeclarativo({ tareasState, tareasCompletadasState, focusSession });
};

// ============================================================================
// ACCIONES GLOBALES EXPUESTAS EN WINDOW
// ============================================================================
window.eliminarTarea = (id) => {
    tareasState = tareasState.filter(t => String(t.id) !== String(id));
    guardarYRenderizar();
};

window.eliminarCompletada = (id) => {
    tareasCompletadasState = tareasCompletadasState.filter(t => String(t.id) !== String(id));
    guardarYRenderizar();
};

window.restaurarTarea = (id) => {
    const target = tareasCompletadasState.find(t => String(t.id) === String(id));
    if (!target) return;

    const restaurada = {
        id: Date.now().toString(),
        nombre: target.nombre,
        materia: target.materia,
        diasRestantes: target.diasRestantes || 2,
        dificultad: target.dificultad || 'Media',
        horasEstimadas: target.horasEstimadas || 2,
        mensajeMotivacional: target.mensajeMotivacional || ''
    };

    tareasCompletadasState = tareasCompletadasState.filter(t => String(t.id) !== String(id));
    tareasState = [restaurada, ...tareasState];
    guardarYRenderizar();
};

window.iniciarSesionEnfoque = (id) => iniciarSesionEnfoque(id, tareasState);
window.abrirModalCompletar = (id, segs) => abrirModalCompletar(id, segs, tareasState);
window.cerrarModalCompletar = cerrarModalCompletar;
window.abrirModalHorasRealizadas = abrirModalHorasRealizadas;
window.cerrarModalHorasRealizadas = cerrarModalHorasRealizadas;

window.confirmarCompletarTarea = () => {
    const target = tareaPendienteDeCompletar || (tareasState.length > 0 ? tareasState[0] : null);
    if (!target) {
        cerrarModalCompletar();
        return;
    }

    const horas = parseInt(document.getElementById('modal-time-hours')?.value, 10) || 0;
    const minutos = parseInt(document.getElementById('modal-time-minutes')?.value, 10) || 0;
    const mensajePersonal = document.getElementById('modal-custom-quote')?.value || '';

    const tareaCompletada = construirTareaCompletada(target, { horas, minutos, mensajePersonal });

    tareasState = tareasState.filter(t => String(t.id) !== String(target.id));
    tareasCompletadasState = [tareaCompletada, ...tareasCompletadasState];
    persistirEstado(tareasState, tareasCompletadasState);

    if (focusSession.activa && focusSession.tarea && String(focusSession.tarea.id) === String(target.id)) {
        cancelarEnfoque();
    }

    cerrarModalCompletar();
    renderAppDeclarativo({ tareasState, tareasCompletadasState, focusSession });
    abrirModalHorasRealizadas();
};

// ============================================================================
// INICIALIZACIÓN OPTIMIZADA DEL DOM
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    inicializarEventosUI({
        getState: () => ({ tareasState, tareasCompletadasState, focusSession }),
        onAgregarTarea: (nuevaTarea) => {
            tareasState = [nuevaTarea, ...tareasState];
            guardarYRenderizar();
            if (window.electronAPI?.notify) {
                window.electronAPI.notify('Tarea Registrada ⚡', `Se agregó: "${nuevaTarea.nombre}" para ${nuevaTarea.materia}`);
            }
        },
        onConfirmarCompletar: window.confirmarCompletarTarea,
        onLimpiarHistorial: () => {
            if (confirm('¿Deseas limpiar el historial de tareas completadas?')) {
                tareasCompletadasState = [];
                guardarYRenderizar();
            }
        },
        onFiltroChange: () => renderAppDeclarativo({ tareasState, tareasCompletadasState, focusSession }),
        onAbrirFlashcards: () => abrirModalFlashcards(tareasState, tareasCompletadasState),
        onAbrirCompletarDesdeFocus: () => {
            if (focusSession.tarea) {
                abrirModalCompletar(focusSession.tarea.id, focusSession.segundosEnfoqueAcumulados, tareasState);
            }
        }
    });

    renderAppDeclarativo({ tareasState, tareasCompletadasState, focusSession });
});
