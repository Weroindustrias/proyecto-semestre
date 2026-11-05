// ============================================================================
// DOMINIO 4: INTERFAZ Y MODALES
// 8. MODAL DE COMPLETAR TAREA (Tiempo real, antes de tiempo y maestro)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

import { obtenerMaestro } from '../dominio1/maestros.js';

export let tareaPendienteDeCompletar = null;

export const setTareaPendienteDeCompletar = (t) => {
    tareaPendienteDeCompletar = t;
};

export const abrirModalCompletar = (tareaId, segundosCronometro = null, tareas = []) => {
    let tarea = tareas.find(t => String(t.id) === String(tareaId));
    if (!tarea && tareas.length > 0) {
        tarea = tareas[0];
    }
    if (!tarea) {
        cerrarModalCompletar();
        return;
    }

    tareaPendienteDeCompletar = tarea;
    const maestro = obtenerMaestro(tarea.materia);

    const modal = document.getElementById('complete-modal');
    if (!modal) return;

    document.getElementById('modal-task-title').textContent = `Registrar Horas: "${tarea.nombre}"`;
    document.getElementById('modal-task-info').textContent = `${tarea.materia} • Horas estimadas: ${tarea.horasEstimadas} hrs`;
    document.getElementById('modal-teacher-avatar').textContent = maestro.avatar;

    const quoteInput = document.getElementById('modal-custom-quote');
    if (quoteInput) {
        quoteInput.value = tarea.mensajeMotivacional || '';
    }

    let horasDefault = tarea.horasEstimadas;
    let minutosDefault = 0;

    if (segundosCronometro !== null && segundosCronometro > 0) {
        horasDefault = Math.floor(segundosCronometro / 3600);
        minutosDefault = Math.max(1, Math.round((segundosCronometro % 3600) / 60));
    }

    const hoursInput = document.getElementById('modal-time-hours');
    const minsInput = document.getElementById('modal-time-minutes');
    if (hoursInput) hoursInput.value = horasDefault;
    if (minsInput) minsInput.value = minutosDefault;

    actualizarFeedbackModal();
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
};

export const actualizarFeedbackModal = () => {
    if (!tareaPendienteDeCompletar) return;

    const horasInput = document.getElementById('modal-time-hours');
    const minutosInput = document.getElementById('modal-time-minutes');
    const horas = horasInput ? parseInt(horasInput.value, 10) || 0 : 0;
    const minutos = minutosInput ? parseInt(minutosInput.value, 10) || 0 : 0;
    const totalMinutosReales = horas * 60 + minutos;
    const totalMinutosEstimados = (tareaPendienteDeCompletar.horasEstimadas || 2) * 60;
    const diferenciaMinutos = totalMinutosEstimados - totalMinutosReales;

    const maestro = obtenerMaestro(tareaPendienteDeCompletar.materia);
    const feedbackBox = document.getElementById('modal-diff-feedback');
    const quoteEl = document.getElementById('modal-teacher-quote');
    const titleEl = document.getElementById('modal-teacher-title');

    if (!feedbackBox || !quoteEl || !titleEl) return;

    let mensajeMaestro;
    if (diferenciaMinutos > 0) {
        const porcentaje = Math.round((diferenciaMinutos / totalMinutosEstimados) * 100);
        feedbackBox.className = 'feedback-badge-box badge-ahorro';
        feedbackBox.innerHTML = `
            <div class="feedback-badge-header">
                <span class="badge-icon">⚡</span>
                <strong>¡Terminaste ${diferenciaMinutos} min antes de tiempo! (+${porcentaje}% de enfoque ganado)</strong>
            </div>
            <p>Ahorraste tiempo valioso para descansar o avanzar en otras materias.</p>
        `;
        mensajeMaestro = maestro.completadoAntes;
    } else if (diferenciaMinutos === 0) {
        feedbackBox.className = 'feedback-badge-box badge-exacto';
        feedbackBox.innerHTML = `
            <div class="feedback-badge-header">
                <span class="badge-icon">🎯</span>
                <strong>¡Cumplimiento Exacto! Realizada en las ${tareaPendienteDeCompletar.horasEstimadas} hrs planeadas.</strong>
            </div>
            <p>Precisión impecable en tu estimación.</p>
        `;
        mensajeMaestro = maestro.completadoNormal;
    } else {
        const extra = Math.abs(diferenciaMinutos);
        feedbackBox.className = 'feedback-badge-box badge-extra';
        feedbackBox.innerHTML = `
            <div class="feedback-badge-header">
                <span class="badge-icon">💪</span>
                <strong>Completada con tenacidad (+${extra} min adicionales requeridos).</strong>
            </div>
            <p>La dificultad era alta, pero no te rendiste hasta terminarla.</p>
        `;
        mensajeMaestro = maestro.completadoNormal;
    }

    const customQuoteEl = document.getElementById('modal-custom-quote');
    const mensajePersonal = customQuoteEl ? customQuoteEl.value.trim() : '';

    if (mensajePersonal) {
        titleEl.textContent = '📌 Tu Recordatorio:';
        quoteEl.textContent = `«${mensajePersonal}»`;
    } else {
        titleEl.textContent = `Consejo del ${maestro.nombre}:`;
        quoteEl.textContent = mensajeMaestro;
    }
};

export const cerrarModalCompletar = () => {
    const modal = document.getElementById('complete-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
    tareaPendienteDeCompletar = null;
};

