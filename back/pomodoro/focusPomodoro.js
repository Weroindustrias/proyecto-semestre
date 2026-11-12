// ============================================================================
// DOMINIO 3: POMODORO Y NOTIFICACIONES
// 3. ESTADO DEL CRONÓMETRO DE ENFOQUE (Focus Mode / Pomodoro)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

import { obtenerMaestro } from '../tareas.y.planificador/maestros.js';
import { formatearTiempo, reproducirAlarma, mostrarNotificacionNavegador } from './notificaciones.js';

export let focusSession = {
    activa: false,
    tarea: null,
    fase: 'config', // 'config' | 'enfoque' | 'descanso'
    segundosEnfoqueAcumulados: 0,
    segundosRestantes: 0,
    duracionEnfoqueMin: 25,
    duracionDescansoMin: 10,
    intervalId: null,
    enPausa: false
};

/**
 * Prepara la sesión Pomodoro para una tarea seleccionada
 * @param {string} tareaId 
 * @param {Array} listaTareas 
 */
export const iniciarSesionEnfoque = (tareaId, listaTareas = []) => {
    const tarea = listaTareas.find(t => String(t.id) === String(tareaId));
    if (!tarea) return;

    const maestro = obtenerMaestro(tarea.materia);

    if (focusSession.intervalId) {
        clearInterval(focusSession.intervalId);
    }

    const savedWork = localStorage.getItem('pf_pomodoro_work') || 25;
    const savedBreak = localStorage.getItem('pf_pomodoro_break') || 10;

    const workInputEl = document.getElementById('focus-work-minutes');
    if (workInputEl) workInputEl.value = savedWork;
    const breakInputEl = document.getElementById('focus-break-minutes');
    if (breakInputEl) breakInputEl.value = savedBreak;

    focusSession = {
        activa: true,
        tarea: tarea,
        fase: 'config',
        segundosEnfoqueAcumulados: 0,
        segundosRestantes: 0,
        duracionEnfoqueMin: parseInt(savedWork, 10) || 25,
        duracionDescansoMin: parseInt(savedBreak, 10) || 10,
        intervalId: null,
        enPausa: false
    };

    const banner = document.getElementById('focus-banner');
    if (!banner) return;

    banner.classList.remove('focus-descanso');
    document.getElementById('focus-task-name').textContent = tarea.nombre;
    document.getElementById('focus-task-meta').textContent = `${tarea.materia} • Estimado: ${tarea.horasEstimadas} hrs • Dificultad: ${tarea.dificultad}`;
    document.getElementById('focus-teacher-avatar').textContent = '💬';
    document.getElementById('focus-teacher-name').textContent = 'Tu Recordatorio';
    document.getElementById('focus-teacher-quote').textContent = tarea.mensajeMotivacional
        ? `«${tarea.mensajeMotivacional}»`
        : `«${maestro.enfoque}»`;

    document.getElementById('focus-phase-icon').textContent = '⚙️';
    document.getElementById('focus-phase-badge').textContent = 'CONFIGURA TU POMODORO';
    document.getElementById('focus-timer-clock').textContent = '00:00:00';
    document.getElementById('focus-timer-sub').textContent = 'Ajusta tus minutos y presiona Iniciar';

    const btnPause = document.getElementById('btn-pause-focus');
    if (btnPause) btnPause.innerHTML = '<span>⏸️ Pausar</span>';

    document.getElementById('focus-config-row').classList.remove('hidden');
    document.getElementById('focus-actions-row').classList.add('hidden');
    document.getElementById('focus-decision-row').classList.add('hidden');

    banner.classList.remove('hidden');
    banner.style.display = 'block';
    banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/**
 * Arranca el primer bloque de enfoque usando los minutos configurados
 */
export const iniciarFaseEnfoque = () => {
    if (!focusSession.activa) return;

    const workInput = document.getElementById('focus-work-minutes');
    const breakInput = document.getElementById('focus-break-minutes');
    const minutosEnfoque = Math.max(1, parseInt(workInput.value, 10) || 25);
    const minutosDescanso = Math.max(1, parseInt(breakInput.value, 10) || 10);

    localStorage.setItem('pf_pomodoro_work', minutosEnfoque);
    localStorage.setItem('pf_pomodoro_break', minutosDescanso);

    focusSession.duracionEnfoqueMin = minutosEnfoque;
    focusSession.duracionDescansoMin = minutosDescanso;
    focusSession.fase = 'enfoque';
    focusSession.segundosRestantes = minutosEnfoque * 60;
    focusSession.enPausa = false;

    const banner = document.getElementById('focus-banner');
    if (banner) banner.classList.remove('focus-descanso');
    document.getElementById('focus-config-row').classList.add('hidden');
    document.getElementById('focus-decision-row').classList.add('hidden');
    document.getElementById('focus-actions-row').classList.remove('hidden');
    document.getElementById('focus-phase-icon').textContent = '🔥';
    document.getElementById('focus-phase-badge').textContent = 'SESIÓN DE ENFOQUE EN VIVO';
    document.getElementById('focus-timer-sub').textContent = 'Tiempo restante de enfoque';
    document.getElementById('focus-timer-clock').textContent = formatearTiempo(focusSession.segundosRestantes);

    tickearPomodoro();
};

/**
 * Reinicia otra ronda de enfoque reutilizando la duración previa
 */
export const reiniciarRondaEnfoque = () => {
    if (!focusSession.activa) return;
    focusSession.fase = 'enfoque';
    focusSession.segundosRestantes = focusSession.duracionEnfoqueMin * 60;
    focusSession.enPausa = false;

    const banner = document.getElementById('focus-banner');
    if (banner) banner.classList.remove('focus-descanso');
    document.getElementById('focus-decision-row').classList.add('hidden');
    document.getElementById('focus-actions-row').classList.remove('hidden');
    document.getElementById('focus-phase-icon').textContent = '🔥';
    document.getElementById('focus-phase-badge').textContent = 'SESIÓN DE ENFOQUE EN VIVO';
    document.getElementById('focus-timer-sub').textContent = 'Tiempo restante de enfoque';
    document.getElementById('focus-timer-clock').textContent = formatearTiempo(focusSession.segundosRestantes);

    tickearPomodoro();
};

/**
 * Motor del cronómetro regresivo de la máquina de estados
 */
export const tickearPomodoro = () => {
    if (focusSession.intervalId) {
        clearInterval(focusSession.intervalId);
    }
    focusSession.intervalId = setInterval(() => {
        if (focusSession.enPausa) return;

        focusSession.segundosRestantes -= 1;
        if (focusSession.fase === 'enfoque') {
            focusSession.segundosEnfoqueAcumulados += 1;
        }

        const clockEl = document.getElementById('focus-timer-clock');
        if (clockEl) {
            clockEl.textContent = formatearTiempo(Math.max(0, focusSession.segundosRestantes));
        }

        if (focusSession.segundosRestantes <= 0) {
            reproducirAlarma();
            if (focusSession.fase === 'enfoque') {
                iniciarFaseDescanso();
            } else if (focusSession.fase === 'descanso') {
                finalizarDescanso();
            }
        }
    }, 1000);
};

export const iniciarFaseDescanso = () => {
    focusSession.fase = 'descanso';
    focusSession.segundosRestantes = focusSession.duracionDescansoMin * 60;

    mostrarNotificacionNavegador(
        '⏰ ¡Tiempo de enfoque terminado!',
        `Buen trabajo. Tómate ${focusSession.duracionDescansoMin} min de descanso antes de seguir.`
    );

    const banner = document.getElementById('focus-banner');
    if (banner) banner.classList.add('focus-descanso');
    document.getElementById('focus-phase-icon').textContent = '☕';
    document.getElementById('focus-phase-badge').textContent = '¡TIEMPO DE DESCANSO!';
    document.getElementById('focus-timer-sub').textContent = 'Tiempo restante de descanso';
    document.getElementById('focus-teacher-name').textContent = 'Consejo de Descanso';
    document.getElementById('focus-teacher-quote').textContent = '«Levántate, estira las piernas, hidrátate y descansa la vista. Tu mente lo agradecerá en la siguiente ronda.»';
};

export const finalizarDescanso = () => {
    if (focusSession.intervalId) {
        clearInterval(focusSession.intervalId);
    }
    mostrarNotificacionNavegador(
        '☕ ¡Descanso terminado!',
        '¿Otra ronda de enfoque o completar la tarea? Vuelve a la pestaña para decidir.'
    );
    document.getElementById('focus-timer-sub').textContent = 'Descanso completo';
    document.getElementById('focus-actions-row').classList.add('hidden');
    document.getElementById('focus-decision-row').classList.remove('hidden');
};

export const pausarReanudarEnfoque = () => {
    if (!focusSession.activa || focusSession.fase === 'config') return;
    focusSession.enPausa = !focusSession.enPausa;
    const btn = document.getElementById('btn-pause-focus');
    if (btn) {
        btn.innerHTML = focusSession.enPausa ? '<span>▶️ Reanudar</span>' : '<span>⏸️ Pausar</span>';
    }
};

export const cancelarEnfoque = () => {
    if (focusSession.intervalId) {
        clearInterval(focusSession.intervalId);
    }
    focusSession = {
        activa: false,
        tarea: null,
        fase: 'config',
        segundosEnfoqueAcumulados: 0,
        segundosRestantes: 0,
        duracionEnfoqueMin: 25,
        duracionDescansoMin: 10,
        intervalId: null,
        enPausa: false
    };
    const banner = document.getElementById('focus-banner');
    if (banner) {
        banner.classList.add('hidden');
        banner.classList.remove('focus-descanso');
        banner.style.display = 'none';
    }
};

