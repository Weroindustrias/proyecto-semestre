import React from 'react';

export const TaskCard = ({ 
    tarea, 
    index, 
    estaEnfocada, 
    onIniciarPomodoro, 
    onAbrirCompletar, 
    onEliminar 
}) => {
    return (
        <div className={`task-item ${tarea.dificultad.toLowerCase()} ${estaEnfocada ? 'task-focused' : ''}`}>
            <div className="task-main">
                <div className="task-badge-row">
                    <span className="priority-rank">#{index + 1} Prioridad</span>
                    <span className="materia-tag">{tarea.materia}</span>
                    {estaEnfocada && <span className="live-tag">🔥 Enfoque Activo</span>}
                </div>

                <h3 className="task-title">{tarea.nombre}</h3>

                <div className="task-meta">
                    <span>⏱️ Vence en <strong>{tarea.diasRestantes} día(s)</strong></span>
                    <span>⌛ Estimado: <strong>{tarea.horasEstimadas} hrs</strong></span>
                    <span>📊 Dificultad: <strong>{tarea.dificultad}</strong></span>
                </div>

                {tarea.mensajeMotivacional ? (
                    <div className="custom-user-quote-box">
                        <span className="quote-icon">📌</span>
                        <span><strong>Recordatorio:</strong> "{tarea.mensajeMotivacional}"</span>
                    </div>
                ) : (
                    <div className="reason-box">
                        <span className="reason-icon">💡</span>
                        <span>{tarea.razon}</span>
                    </div>
                )}
            </div>

            <div className="task-actions-col">
                <span className="score-tag">{tarea.score} pts</span>

                <div className="task-btns-group">
                    <button 
                        type="button" 
                        className="btn-action btn-check" 
                        onClick={() => onAbrirCompletar(tarea.id)} 
                        title="Registrar las horas que te dio en realizarla"
                    >
                        <span>⏱️ Registrar Horas</span>
                    </button>
                    <button 
                        type="button" 
                        className="btn-action btn-timer" 
                        onClick={() => onIniciarPomodoro(tarea)} 
                        title="Medir tiempo en vivo con cronómetro"
                    >
                        <span>▶️ Cronómetro</span>
                    </button>
                    <button 
                        type="button" 
                        className="btn-delete" 
                        onClick={() => onEliminar(tarea.id)} 
                        title="Eliminar tarea"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    );
};

