import React, { useState } from 'react';
import { calcularRacha, generarMapaCalorHTML } from '../../../back/dominio2_estadis/rachaMapa.js';
import { DEFINICION_LOGROS, actualizarLogrosDesbloqueados } from '../../../back/dominio2_estadis/logros.js';
import { calcularComparacionMaterias, generarGraficaMateriasHTML } from '../../../back/dominio2_estadis/graficasEficiencia.js';
import { MAESTROS } from '../../../back/dominio1/maestros.js';

export const ModalHorasRealizadas = ({ 
    isOpen, 
    completadas = [], 
    metricas, 
    onCerrar, 
    onRestaurar, 
    onEliminarCompletada, 
    onLimpiarHistorial 
}) => {
    const [tabActiva, setTabActiva] = useState('historial'); // 'historial' | 'analisis' | 'racha'

    if (!isOpen) return null;

    const totalHorasReales = (completadas.reduce((acum, t) => acum + (t.minutosReales || 0), 0) / 60).toFixed(1);
    const totalMinutosAhorrados = completadas.reduce((acum, t) => acum + Math.max(0, t.minutosAhorrados || 0), 0);
    const totalHorasAhorradas = (totalMinutosAhorrados / 60).toFixed(1);

    const racha = calcularRacha(completadas);
    const heatmapHtml = generarMapaCalorHTML(completadas);
    const logrosDesbloqueados = actualizarLogrosDesbloqueados(completadas);
    const comparacionMaterias = calcularComparacionMaterias(completadas);
    const graficaSvgHtml = generarGraficaMateriasHTML(comparacionMaterias);

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card modal-horas-card glass-card">
                <div className="modal-header space-between">
                    <div className="modal-title-group">
                        <span className="modal-emoji">⏱️</span>
                        <div>
                            <h3>Apartado de Horas Realizadas & Análisis</h3>
                            <p className="modal-sub">Historial del tiempo real invertido, logros y evaluación de enfoque</p>
                        </div>
                    </div>
                    <button type="button" className="btn-close-modal" onClick={onCerrar} title="Cerrar ventana">✕</button>
                </div>

                <div className="stats-bar modal-stats-bar">
                    <div className="stat-card">
                        <span className="stat-value">{completadas.length}</span>
                        <span className="stat-label">Tareas Realizadas</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{totalHorasReales} hrs</span>
                        <span className="stat-label">Horas Invertidas (Reales)</span>
                    </div>
                    <div className="stat-card stat-completadas">
                        <span className="stat-value">
                            {totalMinutosAhorrados >= 60 ? `${totalHorasAhorradas} hrs` : `${totalMinutosAhorrados} min`}
                        </span>
                        <span className="stat-label">Tiempo Ahorrado (Antes)</span>
                    </div>
                    <div className="stat-card stat-enfoque">
                        <span 
                            className="stat-value" 
                            style={{ 
                                color: metricas.eficienciaGlobal > 0 ? 'var(--diff-baja)' : (metricas.eficienciaGlobal === 0 ? 'var(--accent-cyan)' : 'var(--diff-media)') 
                            }}
                        >
                            {metricas.eficienciaGlobal > 0 ? `+${metricas.eficienciaGlobal}%` : `${metricas.eficienciaGlobal}%`}
                        </span>
                        <span className="stat-label">Eficiencia de Enfoque</span>
                    </div>
                </div>

                <div className="modal-tabs-nav">
                    <button 
                        type="button" 
                        className={`modal-tab-btn ${tabActiva === 'historial' ? 'active' : ''}`} 
                        onClick={() => setTabActiva('historial')}
                    >
                        <span>🏆 Tareas Realizadas y Tiempo Dedicado</span>
                    </button>
                    <button 
                        type="button" 
                        className={`modal-tab-btn ${tabActiva === 'analisis' ? 'active' : ''}`} 
                        onClick={() => setTabActiva('analisis')}
                    >
                        <span>📈 Diagnóstico de Rendimiento</span>
                    </button>
                    <button 
                        type="button" 
                        className={`modal-tab-btn ${tabActiva === 'racha' ? 'active' : ''}`} 
                        onClick={() => setTabActiva('racha')}
                    >
                        <span>🔥 Racha & Mapa de Enfoque</span>
                    </button>
                </div>

                <div className="modal-body-scroll">
                    {tabActiva === 'historial' && (
                        <div className="modal-tab-view active">
                            <div className="card-header space-between">
                                <span className="section-subtitle">Detalle de cada tarea, horas estimadas vs. tiempo real medido:</span>
                                <button type="button" className="btn-clear-completed" onClick={onLimpiarHistorial} title="Limpiar historial">
                                    🗑️ Limpiar historial
                                </button>
                            </div>
                            <div className="tasks-list-container">
                                {completadas.length === 0 ? (
                                    <div className="empty-state">
                                        <span className="empty-icon">📝</span>
                                        <p>Aún no has registrado tareas realizadas. Usa el botón "⏱️ Registrar Horas" en cualquier tarea para registrar tu primer logro.</p>
                                    </div>
                                ) : (
                                    completadas.map(t => {
                                        const ahorroTexto = t.minutosAhorrados > 0 
                                            ? <span className="badge-saving">⚡ Ahorraste {t.minutosAhorrados} min (+{t.eficienciaPorcentaje}% enfoque)</span>
                                            : (t.minutosAhorrados === 0 ? <span className="badge-ontime">🎯 A tiempo exacto</span> : <span className="badge-extra-time">💪 +{Math.abs(t.minutosAhorrados)} min dedicados</span>);

                                        const horasStr = t.minutosReales >= 60 
                                            ? `${Math.floor(t.minutosReales / 60)}h ${t.minutosReales % 60}m`
                                            : `${t.minutosReales} min`;

                                        return (
                                            <div key={t.id} className="completed-task-card">
                                                <div className="completed-main">
                                                    <div className="task-badge-row">
                                                        <span className="materia-tag">{t.materia}</span>
                                                        <span className="completed-date">🕒 {t.fechaCompletada}</span>
                                                        {ahorroTexto}
                                                    </div>
                                                    <h3 className="completed-title">✅ {t.nombre}</h3>
                                                    <div className="completed-meta">
                                                        <span>⌛ Estimado inicial: <strong>{t.horasEstimadas} hrs ({t.horasEstimadas * 60} min)</strong></span>
                                                        <span>⏱️ Horas que dio en realizar: <strong className="highlight-time">{horasStr}</strong></span>
                                                    </div>

                                                    <div className="master-congrats-bubble">
                                                        <span className="bubble-avatar">📌</span>
                                                        <div className="bubble-text">
                                                            <strong>Recordatorio:</strong>
                                                            <p>{t.mensajeMotivacional || '¡Tarea realizada con éxito!'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="completed-side">
                                                    <button type="button" className="btn-restore" onClick={() => onRestaurar(t.id)} title="Regresar a tareas pendientes">
                                                        ↩️ Restaurar
                                                    </button>
                                                    <button type="button" className="btn-delete" onClick={() => onEliminarCompletada(t.id)} title="Eliminar del historial">
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {tabActiva === 'analisis' && (
                        <div className="modal-tab-view active">
                            <div className="analysis-container">
                                <div className="analysis-kpis-grid">
                                    <div className="kpi-card glass-card">
                                        <span className="kpi-icon">⚡</span>
                                        <div className="kpi-info">
                                            <span className={`kpi-value ${metricas.eficienciaGlobal >= 0 ? 'color-pos' : 'color-neg'}`}>
                                                {metricas.eficienciaGlobal >= 0 ? '+' : ''}{metricas.eficienciaGlobal}%
                                            </span>
                                            <span className="kpi-label">Índice de Eficiencia Global</span>
                                        </div>
                                    </div>
                                    <div className="kpi-card glass-card">
                                        <span className="kpi-icon">⏱️</span>
                                        <div className="kpi-info">
                                            <span className="kpi-value">{metricas.minutosAhorradosTotal} min</span>
                                            <span className="kpi-label">Tiempo Ahorrado (Enfoque)</span>
                                        </div>
                                    </div>
                                    <div className="kpi-card glass-card">
                                        <span className="kpi-icon">🏆</span>
                                        <div className="kpi-info">
                                            <span className="kpi-value">{metricas.tareasAntesDeTiempo} de {metricas.totalCompletadas}</span>
                                            <span className="kpi-label">Terminadas Antes de Tiempo</span>
                                        </div>
                                    </div>
                                    <div className="kpi-card glass-card">
                                        <span className="kpi-icon">⌛</span>
                                        <div className="kpi-info">
                                            <span className="kpi-value">{metricas.horasRealesTotal} hrs</span>
                                            <span className="kpi-label">Horas Reales de Enfoque</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="focus-diagnostic-card glass-card">
                                    <div className="diagnostic-header">
                                        <div className="diagnostic-badge">
                                            <span className="pulse-dot"></span>
                                            <span>Diagnóstico Agéntico: {metricas.estadoEnfoque}</span>
                                        </div>
                                    </div>
                                    <h3 className="diagnostic-title">¿Cómo estás mejorando tu enfoque?</h3>
                                    <p className="diagnostic-text">{metricas.tendencia}</p>
                                    <div className="progress-bar-container">
                                        <div 
                                            className="progress-bar-fill" 
                                            style={{ width: `${Math.min(100, Math.max(10, metricas.porcentajeAntesDeTiempo || 20))}%` }}
                                        />
                                    </div>
                                    <span className="progress-label">{metricas.porcentajeAntesDeTiempo || 0}% de tus tareas se resuelven a velocidad superior al promedio</span>
                                </div>

                                <div className="materias-chart-section glass-card">
                                    <h3 className="section-title">📊 Comparación de Eficiencia entre Materias</h3>
                                    <p className="section-subtitle">Verde = terminas más rápido de lo estimado. Rojo = te toma más tiempo del planeado.</p>
                                    <div dangerouslySetInnerHTML={{ __html: graficaSvgHtml }} />
                                </div>

                                <div className="masters-council-section">
                                    <h3 className="section-title">🎓 Feedback y Sabiduría de Cada Maestro</h3>
                                    <p className="section-subtitle">Tus maestros evalúan cómo aplicas la disciplina mental en cada una de sus materias:</p>

                                    <div className="masters-grid">
                                        {Object.keys(MAESTROS).filter(k => k !== 'default').map(key => {
                                            const m = MAESTROS[key];
                                            const tareasMateria = completadas.filter(t => t.materia === key);
                                            const tieneCompletadas = tareasMateria.length > 0;
                                            const ahorroMateria = tareasMateria.reduce((acc, t) => acc + Math.max(0, t.minutosAhorrados), 0);

                                            return (
                                                <div key={key} className={`master-card glass-card ${tieneCompletadas ? 'active-master' : ''}`}>
                                                    <div className="master-card-header">
                                                        <span className="master-avatar">{m.avatar}</span>
                                                        <div>
                                                            <h4>{m.nombre}</h4>
                                                            <span className="master-title">{key}</span>
                                                        </div>
                                                    </div>
                                                    <p className="master-analysis">"{m.analisis}"</p>
                                                    <div className="master-stats">
                                                        <span>Completadas: <strong>{tareasMateria.length}</strong></span>
                                                        <span>Ahorro: <strong>{ahorroMateria} min</strong></span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {tabActiva === 'racha' && (
                        <div className="modal-tab-view active">
                            <div className="analysis-container">
                                <div className="analysis-kpis-grid">
                                    <div className="kpi-card glass-card">
                                        <span className="kpi-icon">🔥</span>
                                        <div className="kpi-info">
                                            <span className="kpi-value">{racha.rachaActual} día(s)</span>
                                            <span className="kpi-label">Racha Actual de Enfoque</span>
                                        </div>
                                    </div>
                                    <div className="kpi-card glass-card">
                                        <span className="kpi-icon">🏅</span>
                                        <div className="kpi-info">
                                            <span className="kpi-value">{racha.mejorRacha} día(s)</span>
                                            <span className="kpi-label">Mejor Racha Histórica</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="heatmap-section glass-card">
                                    <h3 className="section-title">🗺️ Mapa de Calor de Productividad</h3>
                                    <p className="section-subtitle">Cada cuadro es un día; mientras más intenso el color, más tareas completaste ese día.</p>
                                    <div className="heatmap-scroll" dangerouslySetInnerHTML={{ __html: heatmapHtml }} />
                                    <div className="heatmap-legend">
                                        <span>Menos</span>
                                        <span className="heatmap-cell nivel-0"></span>
                                        <span className="heatmap-cell nivel-1"></span>
                                        <span className="heatmap-cell nivel-2"></span>
                                        <span className="heatmap-cell nivel-3"></span>
                                        <span className="heatmap-cell nivel-4"></span>
                                        <span>Más</span>
                                    </div>
                                </div>

                                <div className="logros-section glass-card">
                                    <h3 className="section-title">🏅 Insignias Desbloqueadas</h3>
                                    <p className="section-subtitle">Cada insignia se desbloquea sola conforme avanzas; se queda guardada aunque borres tu historial.</p>
                                    <div className="logros-grid">
                                        {DEFINICION_LOGROS.map(logro => {
                                            const desbloqueada = logrosDesbloqueados.includes(logro.id);
                                            return (
                                                <div key={logro.id} className={`logro-card ${desbloqueada ? 'logro-desbloqueado' : 'logro-bloqueado'}`}>
                                                    <span className="logro-icono">{desbloqueada ? logro.icono : '🔒'}</span>
                                                    <div className="logro-info">
                                                        <strong>{logro.nombre}</strong>
                                                        <p>{logro.descripcion}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn-primary" onClick={onCerrar}>
                        <span>← Regresar al Organizador</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

