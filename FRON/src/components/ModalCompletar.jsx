import React, { useState, useEffect } from 'react';
import { obtenerMaestro } from '../../../back/dominio1/maestros.js';

export const ModalCompletar = ({ 
    isOpen, 
    tarea, 
    segundosCronometro, 
    onCerrar, 
    onConfirmar 
}) => {
    const [horas, setHoras] = useState(0);
    const [minutos, setMinutos] = useState(0);
    const [customQuote, setCustomQuote] = useState('');

    useEffect(() => {
        if (!tarea) return;

        let hDefault = tarea.horasEstimadas || 2;
        let mDefault = 0;

        if (segundosCronometro && segundosCronometro > 0) {
            hDefault = Math.floor(segundosCronometro / 3600);
            mDefault = Math.max(1, Math.round((segundosCronometro % 3600) / 60));
        }

        setHoras(hDefault);
        setMinutos(mDefault);
        setCustomQuote(tarea.mensajeMotivacional || '');
    }, [tarea, segundosCronometro]);

    if (!isOpen || !tarea) return null;

    const maestro = obtenerMaestro(tarea.materia);
    const totalMinutosReales = Math.max(1, (parseInt(horas, 10) || 0) * 60 + (parseInt(minutos, 10) || 0));
    const totalMinutosEstimados = (tarea.horasEstimadas || 2) * 60;
    const diferenciaMinutos = totalMinutosEstimados - totalMinutosReales;

    let mensajeMaestro = maestro.completadoNormal;
    if (diferenciaMinutos > 0) {
        mensajeMaestro = maestro.completadoAntes;
    }

    const handleConfirm = () => {
        const ahora = new Date();
        const formatoFecha = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')} - ${ahora.toLocaleDateString()}`;
        const fechaISO = ahora.toISOString().split('T')[0];
        const eficienciaPorcentaje = Math.round((diferenciaMinutos / totalMinutosEstimados) * 100);

        const tareaCompletada = {
            ...tarea,
            id: `comp-${Date.now()}`,
            idOriginal: tarea.id,
            minutosEstimados: totalMinutosEstimados,
            horasReales: (totalMinutosReales / 60).toFixed(1),
            minutosReales: totalMinutosReales,
            minutosAhorrados: diferenciaMinutos,
            eficienciaPorcentaje,
            fechaCompletada: formatoFecha,
            fechaISO,
            maestro,
            mensajeMotivacional: customQuote.trim() || tarea.mensajeMotivacional || mensajeMaestro
        };

        onConfirmar(tareaCompletada);
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card glass-card">
                <div className="modal-header">
                    <span className="modal-emoji">🎉</span>
                    <h3>Registrar Horas: "{tarea.nombre}"</h3>
                </div>

                <div className="modal-body">
                    <p className="modal-sub">{tarea.materia} • Estimado inicial: {tarea.horasEstimadas} hrs</p>

                    <div className="time-input-section">
                        <label>¿Cuántas horas te dio en realizar esta tarea?:</label>
                        <div className="time-inputs-row">
                            <div className="time-input-col">
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="99" 
                                    value={horas} 
                                    onChange={(e) => setHoras(e.target.value)} 
                                />
                                <span>horas</span>
                            </div>
                            <div className="time-input-col">
                                <input 
                                    type="number" 
                                    min="0" 
                                    max="59" 
                                    value={minutos} 
                                    onChange={(e) => setMinutos(e.target.value)} 
                                />
                                <span>minutos</span>
                            </div>
                        </div>
                    </div>

                    <div className={`feedback-badge-box ${diferenciaMinutos > 0 ? 'badge-ahorro' : (diferenciaMinutos === 0 ? 'badge-exacto' : 'badge-extra')}`}>
                        {diferenciaMinutos > 0 && (
                            <>
                                <div className="feedback-badge-header">
                                    <span className="badge-icon">⚡</span>
                                    <strong>¡Terminaste {diferenciaMinutos} min antes de tiempo! (+{Math.round((diferenciaMinutos / totalMinutosEstimados) * 100)}% de enfoque ganado)</strong>
                                </div>
                                <p>Ahorraste tiempo valioso para descansar o avanzar en otras materias.</p>
                            </>
                        )}
                        {diferenciaMinutos === 0 && (
                            <>
                                <div className="feedback-badge-header">
                                    <span className="badge-icon">🎯</span>
                                    <strong>¡Cumplimiento Exacto! Realizada en las {tarea.horasEstimadas} hrs planeadas.</strong>
                                </div>
                                <p>Precisión impecable en tu estimación.</p>
                            </>
                        )}
                        {diferenciaMinutos < 0 && (
                            <>
                                <div className="feedback-badge-header">
                                    <span className="badge-icon">💪</span>
                                    <strong>Completada con tenacidad (+{Math.abs(diferenciaMinutos)} min adicionales requeridos).</strong>
                                </div>
                                <p>La dificultad era alta, pero no te rendiste hasta terminarla.</p>
                            </>
                        )}
                    </div>

                    <div className="user-quote-input-group">
                        <label>📌 Tu Recordatorio <span className="label-sub">(un tema, concepto o nota que quieras dejar)</span></label>
                        <input 
                            type="text" 
                            placeholder="Ej. Recordatorio: también repasar bucles for y while" 
                            value={customQuote} 
                            onChange={(e) => setCustomQuote(e.target.value)} 
                        />
                    </div>

                    <div className="teacher-congrats-card">
                        <div className="teacher-congrats-avatar">{maestro.avatar}</div>
                        <div>
                            <strong>
                                {customQuote.trim() ? '📌 Tu Recordatorio:' : `Consejo del ${maestro.nombre}:`}
                            </strong>
                            <p>
                                {customQuote.trim() ? `«${customQuote.trim()}»` : mensajeMaestro}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn-secondary" onClick={onCerrar}>Regresar</button>
                    <button type="button" className="btn-primary" onClick={handleConfirm}>
                        <span>🏆 Guardar Horas Realizadas</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

