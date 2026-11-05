// ============================================================================
// DOMINIO 4: INTERFAZ Y MODALES
// 10. RENDERIZADO DECLARATIVO DE LA APLICACIÓN & 11. FILTRO DE MATERIAS
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

import { procesarYPriorizar } from '../dominio1/priorizacion.js';
import { obtenerMateriasUnicas } from '../dominio2_estadis/metricas.js';
import { analizarEnfoqueFuncional } from '../dominio2_estadis/analisisEnfoque.js';
import { calcularRacha, generarMapaCalorHTML } from '../dominio2_estadis/rachaMapa.js';
import { DEFINICION_LOGROS, actualizarLogrosDesbloqueados } from '../dominio2_estadis/logros.js';
import { calcularComparacionMaterias, generarGraficaMateriasHTML } from '../dominio2_estadis/graficasEficiencia.js';
import { MAESTROS } from '../dominio1/maestros.js';

export const actualizarFiltroMaterias = (tareasState = [], tareasCompletadasState = []) => {
    const filterSelect = document.getElementById('filter-materia');
    if (!filterSelect) return;
    const valorActual = filterSelect.value;
    const materias = obtenerMateriasUnicas(tareasState, tareasCompletadasState);

    let html = '<option value="all">Todas las materias</option>';
    materias.forEach(mat => {
        html += `<option value="${mat}" ${mat === valorActual ? 'selected' : ''}>${mat}</option>`;
    });

    filterSelect.innerHTML = html;
};

export const renderAppDeclarativo = ({ tareasState, tareasCompletadasState, focusSession }) => {
    const filterMateriaSelect = document.getElementById('filter-materia');
    const selectedFilter = filterMateriaSelect ? filterMateriaSelect.value : 'all';

    // 1. Filtrado declarativo por materia
    const tareasFiltradas = selectedFilter === 'all' 
        ? tareasState 
        : tareasState.filter(t => t.materia === selectedFilter);

    // 2. Procesar agenda priorizada con pipeline funcional
    const agendaPriorizada = procesarYPriorizar(tareasFiltradas);

    // 3. Métricas de Análisis de Enfoque con HOF
    const metricas = analizarEnfoqueFuncional(tareasCompletadasState);

    // 4. Actualizar Badges y Contadores principales de la página
    const badgeTotal = document.getElementById('badge-total-pendientes');
    if (badgeTotal) badgeTotal.textContent = `${agendaPriorizada.length} pendiente(s)`;

    const headerBadge = document.getElementById('header-badge-completadas');
    if (headerBadge) headerBadge.textContent = tareasCompletadasState.length;

    const quickCount = document.getElementById('quick-horas-count');
    if (quickCount) quickCount.textContent = tareasCompletadasState.length;

    // 5. Actualizar Barra de Estadísticas interna del Modal de Horas Realizadas
    const totalHorasReales = (tareasCompletadasState.reduce((acum, t) => acum + (t.minutosReales || 0), 0) / 60).toFixed(1);
    const totalMinutosAhorrados = tareasCompletadasState.reduce((acum, t) => acum + Math.max(0, t.minutosAhorrados || 0), 0);
    const totalHorasAhorradas = (totalMinutosAhorrados / 60).toFixed(1);

    const mStatComp = document.getElementById('modal-stat-completadas');
    if (mStatComp) mStatComp.textContent = tareasCompletadasState.length;

    const mStatHoras = document.getElementById('modal-stat-horas-reales');
    if (mStatHoras) mStatHoras.textContent = `${totalHorasReales} hrs`;

    const mStatAhorro = document.getElementById('modal-stat-tiempo-ahorrado');
    if (mStatAhorro) mStatAhorro.textContent = totalMinutosAhorrados >= 60 ? `${totalHorasAhorradas} hrs` : `${totalMinutosAhorrados} min`;

    const mStatEficiencia = document.getElementById('modal-stat-eficiencia');
    if (mStatEficiencia) {
        if (metricas.eficienciaGlobal > 0) {
            mStatEficiencia.textContent = `+${metricas.eficienciaGlobal}%`;
            mStatEficiencia.style.color = 'var(--diff-baja)';
        } else if (metricas.eficienciaGlobal === 0) {
            mStatEficiencia.textContent = `0%`;
            mStatEficiencia.style.color = 'var(--accent-cyan)';
        } else {
            mStatEficiencia.textContent = `${metricas.eficienciaGlobal}%`;
            mStatEficiencia.style.color = 'var(--diff-media)';
        }
    }

    // 6. Actualizar Filtro de Materias
    actualizarFiltroMaterias(tareasState, tareasCompletadasState);

    // 7. Renderizar Lista de Tareas Pendientes (Vista limpia en pantalla principal)
    const tasksContainer = document.getElementById('tasks-list');
    if (tasksContainer) {
        if (agendaPriorizada.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🎉</span>
                    <p>¡No tienes tareas pendientes en esta categoría! Todo organizado.</p>
                </div>
            `;
        } else {
            tasksContainer.innerHTML = agendaPriorizada.map((tarea, index) => {
                const estaEnfocada = focusSession && focusSession.activa && focusSession.tarea && String(focusSession.tarea.id) === String(tarea.id);

                return `
                    <div class="task-item ${tarea.dificultad.toLowerCase()} ${estaEnfocada ? 'task-focused' : ''}">
                        <div class="task-main">
                            <div class="task-badge-row">
                                <span class="priority-rank">#${index + 1} Prioridad</span>
                                <span class="materia-tag">${tarea.materia}</span>
                                ${estaEnfocada ? '<span class="live-tag">🔥 Enfoque Activo</span>' : ''}
                            </div>
                            <h3 class="task-title">${tarea.nombre}</h3>
                            <div class="task-meta">
                                <span>⏱️ Vence en <strong>${tarea.diasRestantes} día(s)</strong></span>
                                <span>⌛ Estimado: <strong>${tarea.horasEstimadas} hrs</strong></span>
                                <span>📊 Dificultad: <strong>${tarea.dificultad}</strong></span>
                            </div>
                            
                            ${tarea.mensajeMotivacional ? `
                                <div class="custom-user-quote-box">
                                    <span class="quote-icon">📌</span>
                                    <span><strong>Recordatorio:</strong> "${tarea.mensajeMotivacional}"</span>
                                </div>
                            ` : `
                                <div class="reason-box">
                                    <span class="reason-icon">💡</span>
                                    <span>${tarea.razon}</span>
                                </div>
                            `}
                        </div>

                        <div class="task-actions-col">
                            <span class="score-tag">${tarea.score} pts</span>
                            
                            <div class="task-btns-group">
                                <button type="button" class="btn-action btn-check" onclick="window.abrirModalCompletar('${tarea.id}')" title="Registrar las horas que te dio en realizarla">
                                    <span>⏱️ Registrar Horas</span>
                                </button>
                                <button type="button" class="btn-action btn-timer" onclick="window.iniciarSesionEnfoque('${tarea.id}')" title="Medir tiempo en vivo con cronómetro">
                                    <span>▶️ Cronómetro</span>
                                </button>
                                <button type="button" class="btn-delete" onclick="window.eliminarTarea('${tarea.id}')" title="Eliminar tarea">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // 8. Renderizar Historial de Tareas Realizadas (Dentro del Modal)
    const completedContainer = document.getElementById('completed-list');
    if (completedContainer) {
        if (tareasCompletadasState.length === 0) {
            completedContainer.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📝</span>
                    <p>Aún no has registrado tareas realizadas. Usa el botón "⏱️ Registrar Horas" en cualquier tarea para registrar tu primer logro.</p>
                </div>
            `;
        } else {
            completedContainer.innerHTML = tareasCompletadasState.map(t => {
                const ahorroTexto = t.minutosAhorrados > 0 
                    ? `<span class="badge-saving">⚡ Ahorraste ${t.minutosAhorrados} min (+${t.eficienciaPorcentaje}% enfoque)</span>`
                    : (t.minutosAhorrados === 0 ? `<span class="badge-ontime">🎯 A tiempo exacto</span>` : `<span class="badge-extra-time">💪 +${Math.abs(t.minutosAhorrados)} min dedicados</span>`);

                const horasStr = t.minutosReales >= 60 
                    ? `${Math.floor(t.minutosReales / 60)}h ${t.minutosReales % 60}m`
                    : `${t.minutosReales} min`;

                return `
                    <div class="completed-task-card">
                        <div class="completed-main">
                            <div class="task-badge-row">
                                <span class="materia-tag">${t.materia}</span>
                                <span class="completed-date">🕒 ${t.fechaCompletada}</span>
                                ${ahorroTexto}
                            </div>
                            <h3 class="completed-title">✅ ${t.nombre}</h3>
                            <div class="completed-meta">
                                <span>⌛ Estimado inicial: <strong>${t.horasEstimadas} hrs (${t.horasEstimadas * 60} min)</strong></span>
                                <span>⏱️ Horas que dio en realizar: <strong class="highlight-time">${horasStr}</strong></span>
                            </div>
                            
                            <div class="master-congrats-bubble">
                                <span class="bubble-avatar">📌</span>
                                <div class="bubble-text">
                                    <strong>Recordatorio:</strong>
                                    <p>${t.mensajeMotivacional || '¡Tarea realizada con éxito!'}</p>
                                </div>
                            </div>
                        </div>

                        <div class="completed-side">
                            <button type="button" class="btn-restore" onclick="window.restaurarTarea('${t.id}')" title="Regresar a tareas pendientes">
                                ↩️ Restaurar
                            </button>
                            <button type="button" class="btn-delete" onclick="window.eliminarCompletada('${t.id}')" title="Eliminar del historial">
                                🗑️
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // 9. Renderizar Dashboard de Análisis de Enfoque (TAB 2)
    const analysisDashboard = document.getElementById('analysis-dashboard');
    if (analysisDashboard) {
        analysisDashboard.innerHTML = `
            <div class="analysis-kpis-grid">
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">⚡</span>
                    <div class="kpi-info">
                        <span class="kpi-value ${metricas.eficienciaGlobal >= 0 ? 'color-pos' : 'color-neg'}">${metricas.eficienciaGlobal >= 0 ? '+' : ''}${metricas.eficienciaGlobal}%</span>
                        <span class="kpi-label">Índice de Eficiencia Global</span>
                    </div>
                </div>
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">⏱️</span>
                    <div class="kpi-info">
                        <span class="kpi-value">${metricas.minutosAhorradosTotal} min</span>
                        <span class="kpi-label">Tiempo Ahorrado (Enfoque)</span>
                    </div>
                </div>
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">🏆</span>
                    <div class="kpi-info">
                        <span class="kpi-value">${metricas.tareasAntesDeTiempo} de ${metricas.totalCompletadas}</span>
                        <span class="kpi-label">Terminadas Antes de Tiempo</span>
                    </div>
                </div>
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">⌛</span>
                    <div class="kpi-info">
                        <span class="kpi-value">${metricas.horasRealesTotal} hrs</span>
                        <span class="kpi-label">Horas Reales de Enfoque</span>
                    </div>
                </div>
            </div>

            <div class="focus-diagnostic-card glass-card">
                <div class="diagnostic-header">
                    <div class="diagnostic-badge">
                        <span class="pulse-dot"></span>
                        <span>Diagnóstico Agéntico: ${metricas.estadoEnfoque}</span>
                    </div>
                </div>
                <h3 class="diagnostic-title">¿Cómo estás mejorando tu enfoque?</h3>
                <p class="diagnostic-text">${metricas.tendencia}</p>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${Math.min(100, Math.max(10, metricas.porcentajeAntesDeTiempo || 20))}%;"></div>
                </div>
                <span class="progress-label">${metricas.porcentajeAntesDeTiempo || 0}% de tus tareas se resuelven a velocidad superior al promedio</span>
            </div>

            <div class="materias-chart-section glass-card">
                <h3 class="section-title">📊 Comparación de Eficiencia entre Materias</h3>
                <p class="section-subtitle">Verde = terminas más rápido de lo estimado. Rojo = te toma más tiempo del planeado.</p>
                ${generarGraficaMateriasHTML(calcularComparacionMaterias(tareasCompletadasState))}
            </div>

            <div class="masters-council-section">
                <h3 class="section-title">🎓 Feedback y Sabiduría de Cada Maestro</h3>
                <p class="section-subtitle">Tus maestros evalúan cómo aplicas la disciplina mental en cada una de sus materias:</p>
                
                <div class="masters-grid">
                    ${Object.keys(MAESTROS).filter(k => k !== 'default').map(key => {
                        const m = MAESTROS[key];
                        const tareasMateria = tareasCompletadasState.filter(t => t.materia === key);
                        const tieneCompletadas = tareasMateria.length > 0;
                        const ahorroMateria = tareasMateria.reduce((acc, t) => acc + Math.max(0, t.minutosAhorrados), 0);

                        return `
                            <div class="master-card glass-card ${tieneCompletadas ? 'active-master' : ''}">
                                <div class="master-card-header">
                                    <span class="master-avatar">${m.avatar}</span>
                                    <div>
                                        <h4>${m.nombre}</h4>
                                        <span class="master-title">${key}</span>
                                    </div>
                                </div>
                                <p class="master-analysis">"${m.analisis}"</p>
                                <div class="master-stats">
                                    <span>Completadas: <strong>${tareasMateria.length}</strong></span>
                                    <span>Ahorro: <strong>${ahorroMateria} min</strong></span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // 9.5 Renderizar Dashboard de Racha, Mapa de Calor e Insignias (TAB 3)
    const rachaContainer = document.getElementById('racha-dashboard');
    if (rachaContainer) {
        const racha = calcularRacha(tareasCompletadasState);
        const heatmapHtml = generarMapaCalorHTML(tareasCompletadasState);
        const logrosDesbloqueados = actualizarLogrosDesbloqueados(tareasCompletadasState);

        rachaContainer.innerHTML = `
            <div class="analysis-kpis-grid">
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">🔥</span>
                    <div class="kpi-info">
                        <span class="kpi-value">${racha.rachaActual} día(s)</span>
                        <span class="kpi-label">Racha Actual de Enfoque</span>
                    </div>
                </div>
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">🏅</span>
                    <div class="kpi-info">
                        <span class="kpi-value">${racha.mejorRacha} día(s)</span>
                        <span class="kpi-label">Mejor Racha Histórica</span>
                    </div>
                </div>
            </div>

            <div class="heatmap-section glass-card">
                <h3 class="section-title">🗺️ Mapa de Calor de Productividad</h3>
                <p class="section-subtitle">Cada cuadro es un día; mientras más intenso el color, más tareas completaste ese día.</p>
                <div class="heatmap-scroll">
                    ${heatmapHtml}
                </div>
                <div class="heatmap-legend">
                    <span>Menos</span>
                    <span class="heatmap-cell nivel-0"></span>
                    <span class="heatmap-cell nivel-1"></span>
                    <span class="heatmap-cell nivel-2"></span>
                    <span class="heatmap-cell nivel-3"></span>
                    <span class="heatmap-cell nivel-4"></span>
                    <span>Más</span>
                </div>
            </div>

            <div class="logros-section glass-card">
                <h3 class="section-title">🏅 Insignias Desbloqueadas</h3>
                <p class="section-subtitle">Cada insignia se desbloquea sola conforme avanzas; se queda guardada aunque borres tu historial.</p>
                <div class="logros-grid">
                    ${DEFINICION_LOGROS.map(logro => {
                        const desbloqueada = logrosDesbloqueados.includes(logro.id);
                        return `
                            <div class="logro-card ${desbloqueada ? 'logro-desbloqueado' : 'logro-bloqueado'}">
                                <span class="logro-icono">${desbloqueada ? logro.icono : '🔒'}</span>
                                <div class="logro-info">
                                    <strong>${logro.nombre}</strong>
                                    <p>${logro.descripcion}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
};

