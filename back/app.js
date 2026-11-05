// ============================================================================
// ORQUESTADOR PRINCIPAL DE LA APLICACIÓN (Arquitectura Dividida por Dominios)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

// 1. DOMINIO 1: Tareas, Maestros y Priorización Pura
import { obtenerMaestro } from './dominio1/maestros.js';
import { cargarTareas, cargarCompletadas, persistirEstado } from './dominio1/estado.js';
import { procesarYPriorizar } from './dominio1/priorizacion.js';

// 2. DOMINIO 2: Estadísticas, Métricas, Racha y Logros
import { mostrarPrediccionTiempo } from './dominio2_estadis/prediccion.js';

// 3. DOMINIO 3: Pomodoro y Notificaciones
import { 
    focusSession, 
    iniciarSesionEnfoque, 
    iniciarFaseEnfoque, 
    reiniciarRondaEnfoque, 
    pausarReanudarEnfoque, 
    cancelarEnfoque 
} from './dominio3_pomodoro/focusPomodoro.js';
import { solicitarPermisoNotificaciones } from './dominio3_pomodoro/notificaciones.js';

// 4. DOMINIO 4: Modales e Interfaz de Usuario
import { 
    tareaPendienteDeCompletar, 
    abrirModalCompletar as abrirModalCompletarBase, 
    actualizarFeedbackModal, 
    cerrarModalCompletar 
} from './dominio4_interfaz/modalCompletar.js';
import { 
    abrirModalHorasRealizadas, 
    cerrarModalHorasRealizadas 
} from './dominio4_interfaz/modalesHoras.js';
import { 
    abrirModalFlashcards as abrirModalFlashcardsBase, 
    cerrarModalFlashcards, 
    moverFlashcard 
} from './dominio4_interfaz/flashcards.js';
import { renderAppDeclarativo } from './dominio4_interfaz/renderApp.js';

// ============================================================================
// ESTADO REACTIVO GLOBAL
// ============================================================================
let tareasState = cargarTareas();
let tareasCompletadasState = cargarCompletadas();

const guardarYRenderizar = () => {
    persistirEstado(tareasState, tareasCompletadasState);
    renderAppDeclarativo({ tareasState, tareasCompletadasState, focusSession });
};

// ============================================================================
// ACCIONES EXPUESTAS GLOBALMENTE EN WINDOW (Para eventos inline en HTML)
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
    const tarea = tareasCompletadasState.find(t => String(t.id) === String(id));
    if (!tarea) return;

    const tareaRestaurada = {
        id: Date.now().toString(),
        nombre: tarea.nombre,
        materia: tarea.materia,
        diasRestantes: tarea.diasRestantes || 2,
        dificultad: tarea.dificultad || 'Media',
        horasEstimadas: tarea.horasEstimadas || 2
    };

    tareasCompletadasState = tareasCompletadasState.filter(t => String(t.id) !== String(id));
    tareasState = [tareaRestaurada, ...tareasState];
    guardarYRenderizar();
};

window.iniciarSesionEnfoque = (id) => iniciarSesionEnfoque(id, tareasState);
window.abrirModalCompletar = (id, segs) => abrirModalCompletarBase(id, segs, tareasState);
window.cerrarModalCompletar = cerrarModalCompletar;
window.abrirModalHorasRealizadas = abrirModalHorasRealizadas;
window.cerrarModalHorasRealizadas = cerrarModalHorasRealizadas;

window.confirmarCompletarTarea = () => {
    const tareaTarget = tareaPendienteDeCompletar || (tareasState.length > 0 ? tareasState[0] : null);
    if (!tareaTarget) {
        cerrarModalCompletar();
        return;
    }

    const horasInput = document.getElementById('modal-time-hours');
    const minutosInput = document.getElementById('modal-time-minutes');
    const horas = horasInput ? parseInt(horasInput.value, 10) || 0 : 0;
    const minutos = minutosInput ? parseInt(minutosInput.value, 10) || 0 : 0;
    const totalMinutosReales = Math.max(1, horas * 60 + minutos);
    const totalMinutosEstimados = (tareaTarget.horasEstimadas || 2) * 60;
    const minutosAhorrados = totalMinutosEstimados - totalMinutosReales;
    const eficienciaPorcentaje = Math.round((minutosAhorrados / totalMinutosEstimados) * 100);

    const maestro = obtenerMaestro(tareaTarget.materia);
    const ahora = new Date();
    const formatoFecha = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')} - ${ahora.toLocaleDateString()}`;
    const fechaISO = ahora.toISOString().split('T')[0];

    const customQuoteEl = document.getElementById('modal-custom-quote');
    const mensajePersonal = (customQuoteEl && customQuoteEl.value.trim()) 
        ? customQuoteEl.value.trim() 
        : (tareaTarget.mensajeMotivacional || (minutosAhorrados > 0 ? maestro.completadoAntes : maestro.completadoNormal));

    const tareaCompletada = {
        ...tareaTarget,
        id: `comp-${Date.now()}`,
        minutosEstimados: totalMinutosEstimados,
        horasReales: (totalMinutosReales / 60).toFixed(1),
        minutosReales: totalMinutosReales,
        minutosAhorrados: minutosAhorrados,
        eficienciaPorcentaje: eficienciaPorcentaje,
        fechaCompletada: formatoFecha,
        fechaISO: fechaISO,
        maestro: maestro,
        mensajeMotivacional: mensajePersonal
    };

    tareasState = tareasState.filter(t => String(t.id) !== String(tareaTarget.id));
    tareasCompletadasState = [tareaCompletada, ...tareasCompletadasState];
    persistirEstado(tareasState, tareasCompletadasState);

    if (focusSession.activa && focusSession.tarea && String(focusSession.tarea.id) === String(tareaTarget.id)) {
        cancelarEnfoque();
    }

    cerrarModalCompletar();
    renderAppDeclarativo({ tareasState, tareasCompletadasState, focusSession });
    abrirModalHorasRealizadas();
};

// ============================================================================
// INICIALIZACIÓN DE EVENTOS DEL DOM
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const materiaSelect = document.getElementById('materia-select');
    const customMateriaInput = document.getElementById('custom-materia');
    const filterMateriaSelect = document.getElementById('filter-materia');

    // Manejo de tema Claro / Oscuro
    const aplicarTema = (tema) => {
        document.documentElement.setAttribute('data-theme', tema);
        try { localStorage.setItem('pf_theme', tema); } catch (e) {}
        const icon = document.getElementById('theme-toggle-icon');
        const label = document.getElementById('theme-toggle-label');
        if (icon) icon.textContent = tema === 'light' ? '🌙' : '☀️';
        if (label) label.textContent = tema === 'light' ? 'Modo Oscuro' : 'Modo Claro';
    };

    aplicarTema(document.documentElement.getAttribute('data-theme') || 'light');

    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', () => {
            const actual = document.documentElement.getAttribute('data-theme') || 'light';
            aplicarTema(actual === 'light' ? 'dark' : 'light');
        });
    }

    // Modal Horas Realizadas
    const btnOpenHoras = document.getElementById('btn-open-horas-modal');
    if (btnOpenHoras) btnOpenHoras.addEventListener('click', abrirModalHorasRealizadas);

    const btnQuickHoras = document.getElementById('btn-quick-horas-link');
    if (btnQuickHoras) btnQuickHoras.addEventListener('click', abrirModalHorasRealizadas);

    const btnCloseHorasModal = document.getElementById('btn-close-horas-modal');
    if (btnCloseHorasModal) btnCloseHorasModal.addEventListener('click', cerrarModalHorasRealizadas);

    const btnCloseHorasFooter = document.getElementById('btn-close-horas-footer');
    if (btnCloseHorasFooter) btnCloseHorasFooter.addEventListener('click', cerrarModalHorasRealizadas);

    // Tabs del Modal
    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.modaltab;
            document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const vistas = {
                historial: document.getElementById('modal-view-historial'),
                analisis: document.getElementById('modal-view-analisis'),
                racha: document.getElementById('modal-view-racha')
            };

            Object.keys(vistas).forEach(key => {
                const el = vistas[key];
                if (!el) return;
                if (key === targetTab) {
                    el.classList.remove('hidden');
                    el.classList.add('active');
                } else {
                    el.classList.add('hidden');
                    el.classList.remove('active');
                }
            });
        });
    });

    // Flashcards
    const btnOpenFlashcards = document.getElementById('btn-open-flashcards');
    if (btnOpenFlashcards) {
        btnOpenFlashcards.addEventListener('click', () => abrirModalFlashcardsBase(tareasState, tareasCompletadasState));
    }
    const btnCloseFlashcards = document.getElementById('btn-close-flashcards');
    if (btnCloseFlashcards) btnCloseFlashcards.addEventListener('click', cerrarModalFlashcards);
    const btnCloseFlashcardsFooter = document.getElementById('btn-close-flashcards-footer');
    if (btnCloseFlashcardsFooter) btnCloseFlashcardsFooter.addEventListener('click', cerrarModalFlashcards);

    const btnFlipFlashcard = document.getElementById('btn-flip-flashcard');
    if (btnFlipFlashcard) {
        btnFlipFlashcard.addEventListener('click', () => {
            const inner = document.getElementById('flashcard-inner');
            if (inner) inner.classList.toggle('flipped');
        });
    }

    const btnPrevFlashcard = document.getElementById('btn-prev-flashcard');
    if (btnPrevFlashcard) btnPrevFlashcard.addEventListener('click', () => moverFlashcard(-1));
    const btnNextFlashcard = document.getElementById('btn-next-flashcard');
    if (btnNextFlashcard) btnNextFlashcard.addEventListener('click', () => moverFlashcard(1));

    // Pomodoro y Focus Banner
    const btnFinishFocus = document.getElementById('btn-finish-focus');
    if (btnFinishFocus) {
        btnFinishFocus.addEventListener('click', () => {
            if (focusSession.tarea) {
                abrirModalCompletarBase(focusSession.tarea.id, focusSession.segundosEnfoqueAcumulados, tareasState);
            }
        });
    }

    const btnPauseFocus = document.getElementById('btn-pause-focus');
    if (btnPauseFocus) btnPauseFocus.addEventListener('click', pausarReanudarEnfoque);

    const btnCancelFocus = document.getElementById('btn-cancel-focus');
    if (btnCancelFocus) btnCancelFocus.addEventListener('click', cancelarEnfoque);

    const btnStartPomodoro = document.getElementById('btn-start-pomodoro');
    if (btnStartPomodoro) {
        btnStartPomodoro.addEventListener('click', () => {
            solicitarPermisoNotificaciones();
            iniciarFaseEnfoque();
        });
    }

    const btnOtraRonda = document.getElementById('btn-otra-ronda');
    if (btnOtraRonda) btnOtraRonda.addEventListener('click', reiniciarRondaEnfoque);

    const btnFinishAfterBreak = document.getElementById('btn-finish-after-break');
    if (btnFinishAfterBreak) {
        btnFinishAfterBreak.addEventListener('click', () => {
            if (focusSession.tarea) {
                abrirModalCompletarBase(focusSession.tarea.id, focusSession.segundosEnfoqueAcumulados, tareasState);
            }
        });
    }

    // Modal Confirmar Completar Tarea
    const modalBtnConfirm = document.getElementById('modal-btn-confirm');
    if (modalBtnConfirm) modalBtnConfirm.addEventListener('click', window.confirmarCompletarTarea);

    const modalBtnCancel = document.getElementById('modal-btn-cancel');
    if (modalBtnCancel) modalBtnCancel.addEventListener('click', cerrarModalCompletar);

    const timeHoursEl = document.getElementById('modal-time-hours');
    if (timeHoursEl) timeHoursEl.addEventListener('input', actualizarFeedbackModal);

    const timeMinsEl = document.getElementById('modal-time-minutes');
    if (timeMinsEl) timeMinsEl.addEventListener('input', actualizarFeedbackModal);

    const customQuoteEl = document.getElementById('modal-custom-quote');
    if (customQuoteEl) customQuoteEl.addEventListener('input', actualizarFeedbackModal);

    // Limpiar Historial
    const btnClearHistory = document.getElementById('btn-clear-history');
    if (btnClearHistory) {
        btnClearHistory.addEventListener('click', () => {
            if (confirm('¿Deseas limpiar el historial de tareas completadas?')) {
                tareasCompletadasState = [];
                guardarYRenderizar();
            }
        });
    }

    // Predicción de tiempo en formulario
    const actualizarPrediccion = () => {
        let materia = materiaSelect ? materiaSelect.value : '';
        if (materia === 'custom' && customMateriaInput) materia = customMateriaInput.value.trim();
        const dificultadInput = document.querySelector('input[name="dificultad"]:checked');
        const dificultad = dificultadInput ? dificultadInput.value : null;
        mostrarPrediccionTiempo(materia, dificultad, tareasCompletadasState);
    };

    if (materiaSelect) {
        materiaSelect.addEventListener('change', (e) => {
            if (e.target.value === 'custom') {
                customMateriaInput.classList.remove('hidden');
                customMateriaInput.required = true;
                customMateriaInput.focus();
            } else {
                customMateriaInput.classList.add('hidden');
                customMateriaInput.required = false;
            }
            actualizarPrediccion();
        });
    }

    if (customMateriaInput) customMateriaInput.addEventListener('input', actualizarPrediccion);
    document.querySelectorAll('input[name="dificultad"]').forEach(radio => {
        radio.addEventListener('change', actualizarPrediccion);
    });

    if (filterMateriaSelect) {
        filterMateriaSelect.addEventListener('change', () => {
            renderAppDeclarativo({ tareasState, tareasCompletadasState, focusSession });
        });
    }

    // Submit del Formulario
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('task-name').value.trim();
            let materia = materiaSelect.value;
            if (materia === 'custom') {
                materia = customMateriaInput.value.trim();
            }

            const diasRestantes = parseInt(document.getElementById('dias-restantes').value, 10);
            const horasEstimadas = parseInt(document.getElementById('horas-estimadas').value, 10);
            const dificultadInput = document.querySelector('input[name="dificultad"]:checked');
            const dificultad = dificultadInput ? dificultadInput.value : 'Media';

            const quoteEl = document.getElementById('task-quote');
            const mensajeMotivacional = quoteEl ? quoteEl.value.trim() : '';

            if (!nombre || !materia || isNaN(diasRestantes) || isNaN(horasEstimadas)) {
                alert('Por favor completa todos los campos correctamente.');
                return;
            }

            const nuevaTarea = {
                id: Date.now().toString(),
                nombre,
                materia,
                diasRestantes,
                dificultad,
                horasEstimadas,
                mensajeMotivacional
            };

            tareasState = [nuevaTarea, ...tareasState];
            guardarYRenderizar();

            form.reset();
            if (customMateriaInput) {
                customMateriaInput.classList.add('hidden');
                customMateriaInput.required = false;
            }
            const predBox = document.getElementById('prediction-box');
            if (predBox) predBox.classList.add('hidden');

            if (window.electronAPI && typeof window.electronAPI.notify === 'function') {
                window.electronAPI.notify('Tarea Registrada ⚡', `Se agregó: "${nombre}" para ${materia}`);
            }
        });
    }

    // Detección de Electron
    if (window.electronAPI && window.electronAPI.isElectron) {
        document.body.classList.add('is-electron');
        const tag = document.querySelector('.header-tag span:last-child');
        if (tag) tag.textContent = 'Desktop App (Electron)';
    }

    // Renderizado Inicial
    renderAppDeclarativo({ tareasState, tareasCompletadasState, focusSession });
});
