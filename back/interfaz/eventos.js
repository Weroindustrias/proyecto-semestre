// ============================================================================
// DOMINIO 4: INTERFAZ Y MODALES
// GESTOR CENTRAL DE EVENTOS DEL DOM (UI Event Binding Optimizado)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

import { solicitarPermisoNotificaciones } from '../ponmodoro/notificaciones.js';
import {
    iniciarFaseEnfoque,
    reiniciarRondaEnfoque,
    pausarReanudarEnfoque,
    cancelarEnfoque
} from '../ponmodoro/focusPomodoro.js';
import {
    abrirModalHorasRealizadas,
    cerrarModalHorasRealizadas
} from './modalesHoras.js';
import {
    cerrarModalFlashcards,
    moverFlashcard
} from './flashcards.js';
import {
    actualizarFeedbackModal,
    cerrarModalCompletar
} from './modalCompletar.js';
import { mostrarPrediccionTiempo } from '../dominio2_estadis/prediccion.js';

// Helpers funcionales para manipulación y registro de eventos
const $ = (id) => document.getElementById(id);
const on = (id, event, handler) => {
    const el = typeof id === 'string' ? $(id) : id;
    if (el) el.addEventListener(event, handler);
};
const onClick = (id, handler) => on(id, 'click', handler);

/**
 * Inicializa todos los eventos de la interfaz declarativa
 * @param {object} handlers Callbacks expuestos por el orquestador principal
 */
export const inicializarEventosUI = ({
    getState,
    onAgregarTarea,
    onConfirmarCompletar,
    onLimpiarHistorial,
    onFiltroChange,
    onAbrirFlashcards,
    onAbrirCompletarDesdeFocus
}) => {
    // 1. Alternador de Tema Claro / Oscuro
    const aplicarTema = (tema) => {
        document.documentElement.setAttribute('data-theme', tema);
        try { localStorage.setItem('pf_theme', tema); } catch { }
        const icon = $('theme-toggle-icon');
        const label = $('theme-toggle-label');
        if (icon) icon.textContent = tema === 'light' ? '🌙' : '☀️';
        if (label) label.textContent = tema === 'light' ? 'Modo Oscuro' : 'Modo Claro';
    };

    aplicarTema(document.documentElement.getAttribute('data-theme') || 'light');
    onClick('btn-theme-toggle', () => {
        const actual = document.documentElement.getAttribute('data-theme') || 'light';
        aplicarTema(actual === 'light' ? 'dark' : 'light');
    });

    // 2. Modales de Horas Realizadas
    onClick('btn-open-horas-modal', abrirModalHorasRealizadas);
    onClick('btn-quick-horas-link', abrirModalHorasRealizadas);
    onClick('btn-close-horas-modal', cerrarModalHorasRealizadas);
    onClick('btn-close-horas-footer', cerrarModalHorasRealizadas);

    // Navegación de Tabs del Modal de Horas (Delegación limpia)
    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.modaltab;
            document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const vistas = {
                historial: $('modal-view-historial'),
                analisis: $('modal-view-analisis'),
                racha: $('modal-view-racha')
            };

            Object.entries(vistas).forEach(([key, el]) => {
                if (!el) return;
                const activa = key === targetTab;
                el.classList.toggle('hidden', !activa);
                el.classList.toggle('active', activa);
            });
        });
    });

    // 3. Modal de Flashcards
    onClick('btn-open-flashcards', onAbrirFlashcards);
    onClick('btn-close-flashcards', cerrarModalFlashcards);
    onClick('btn-close-flashcards-footer', cerrarModalFlashcards);
    onClick('btn-flip-flashcard', () => $('flashcard-inner')?.classList.toggle('flipped'));
    onClick('btn-prev-flashcard', () => moverFlashcard(-1));
    onClick('btn-next-flashcard', () => moverFlashcard(1));

    // 4. Focus Banner y Pomodoro
    onClick('btn-finish-focus', onAbrirCompletarDesdeFocus);
    onClick('btn-pause-focus', pausarReanudarEnfoque);
    onClick('btn-cancel-focus', cancelarEnfoque);
    onClick('btn-start-pomodoro', () => {
        solicitarPermisoNotificaciones();
        iniciarFaseEnfoque();
    });
    onClick('btn-otra-ronda', reiniciarRondaEnfoque);
    onClick('btn-finish-after-break', onAbrirCompletarDesdeFocus);

    // 5. Modal de Completar Tarea
    onClick('modal-btn-confirm', onConfirmarCompletar);
    onClick('modal-btn-cancel', cerrarModalCompletar);
    ['modal-time-hours', 'modal-time-minutes', 'modal-custom-quote'].forEach(id => {
        on(id, 'input', actualizarFeedbackModal);
    });

    // 6. Limpieza de Historial
    onClick('btn-clear-history', onLimpiarHistorial);

    // 7. Predicción de Tiempo en Formulario
    const materiaSelect = $('materia-select');
    const customMateriaInput = $('custom-materia');

    const dispararPrediccion = () => {
        let materia = materiaSelect?.value || '';
        if (materia === 'custom') materia = customMateriaInput?.value.trim() || '';
        const dificultad = document.querySelector('input[name="dificultad"]:checked')?.value || null;
        mostrarPrediccionTiempo(materia, dificultad, getState().tareasCompletadasState);
    };

    if (materiaSelect) {
        materiaSelect.addEventListener('change', (e) => {
            const esCustom = e.target.value === 'custom';
            if (customMateriaInput) {
                customMateriaInput.classList.toggle('hidden', !esCustom);
                customMateriaInput.required = esCustom;
                if (esCustom) customMateriaInput.focus();
            }
            dispararPrediccion();
        });
    }

    on('custom-materia', 'input', dispararPrediccion);
    document.querySelectorAll('input[name="dificultad"]').forEach(radio => {
        radio.addEventListener('change', dispararPrediccion);
    });

    // 8. Filtro por Materia
    on('filter-materia', 'change', onFiltroChange);

    // 9. Envío del Formulario (Creación Funcional de Tareas)
    const form = $('task-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = $('task-name')?.value.trim();
            let materia = materiaSelect?.value || '';
            if (materia === 'custom') materia = customMateriaInput?.value.trim() || '';

            const diasRestantes = parseInt($('dias-restantes')?.value, 10);
            const horasEstimadas = parseInt($('horas-estimadas')?.value, 10);
            const dificultad = document.querySelector('input[name="dificultad"]:checked')?.value || 'Media';
            const mensajeMotivacional = $('task-quote')?.value.trim() || '';

            if (!nombre || !materia || isNaN(diasRestantes) || isNaN(horasEstimadas)) {
                alert('Por favor completa todos los campos correctamente.');
                return;
            }

            onAgregarTarea({
                id: Date.now().toString(),
                nombre,
                materia,
                diasRestantes,
                dificultad,
                horasEstimadas,
                mensajeMotivacional
            });

            form.reset();
            if (customMateriaInput) {
                customMateriaInput.classList.add('hidden');
                customMateriaInput.required = false;
            }
            $('prediction-box')?.classList.add('hidden');
        });
    }

    // 10. Detección de Electron Runtime
    if (window.electronAPI?.isElectron) {
        document.body.classList.add('is-electron');
        const tag = document.querySelector('.header-tag span:last-child');
        if (tag) tag.textContent = 'Desktop App (Electron)';
    }
};

