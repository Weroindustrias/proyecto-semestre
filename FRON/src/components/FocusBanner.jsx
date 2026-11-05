import React, { useState } from 'react';

export const FocusBanner = ({ 
    pomodoro, 
    onAbrirCompletar 
}) => {
    const {
        activa,
        tarea,
        fase,
        enPausa,
        relojFormateado,
        duracionEnfoqueMin,
        duracionDescansoMin,
        segundosEnfoqueAcumulados,
        maestro,
        arrancarEnfoque,
        otraRonda,
        pausarReanudar,
        cancelar
    } = pomodoro;

    const [workMin, setWorkMin] = useState(duracionEnfoqueMin);
    const [breakMin, setBreakMin] = useState(duracionDescansoMin);

    if (!activa || !tarea) return null;

    const fraseVisible = tarea.mensajeMotivacional
        ? `«${tarea.mensajeMotivacional}»`
        : (maestro ? `«${maestro.enfoque}»` : '«¡Enfoque total y mente despejada!»');

    const handleCompletar = () => {
        onAbrirCompletar(tarea.id, segundosEnfoqueAcumulados);
    };

    return (
        <div className={`glass-card focus-banner ${fase === 'descanso' ? 'focus-descanso' : ''}`}>
            <div className="focus-header">
                <div className="focus-title-group">
                    <span className="focus-pulse-icon">
                        {fase === 'config' ? '⚙️' : (fase === 'descanso' ? '☕' : '🔥')}
                    </span>
                    <div>
                        <span className="focus-badge">
                            {fase === 'config' && 'CONFIGURA TU POMODORO'}
                            {fase === 'enfoque' && 'SESIÓN DE ENFOQUE EN VIVO'}
                            {fase === 'descanso' && '¡TIEMPO DE DESCANSO!'}
                            {fase === 'decision' && 'RONDA TERMINADA'}
                        </span>
                        <h3>{tarea.nombre}</h3>
                        <p className="focus-meta">
                            {tarea.materia} • Estimado: {tarea.horasEstimadas} hrs • Dificultad: {tarea.dificultad}
                        </p>
                    </div>
                </div>

                <div className="focus-timer-box">
                    <div className="timer-display">{relojFormateado}</div>
                    <span className="timer-sub">
                        {fase === 'config' && 'Ajusta tus minutos y presiona Iniciar'}
                        {fase === 'enfoque' && 'Tiempo restante de enfoque'}
                        {fase === 'descanso' && 'Tiempo restante de descanso'}
                        {fase === 'decision' && 'Descanso completo'}
                    </span>
                </div>
            </div>

            {fase === 'config' && (
                <div className="focus-config-row">
                    <div className="focus-config-item">
                        <label>⏳ Minutos de Enfoque</label>
                        <input 
                            type="number" 
                            min="5" 
                            max="120" 
                            value={workMin} 
                            onChange={(e) => setWorkMin(e.target.value)} 
                        />
                    </div>
                    <div className="focus-config-item">
                        <label>☕ Minutos de Descanso</label>
                        <input 
                            type="number" 
                            min="1" 
                            max="60" 
                            value={breakMin} 
                            onChange={(e) => setBreakMin(e.target.value)} 
                        />
                    </div>
                    <button 
                        type="button" 
                        className="btn-focus-start" 
                        onClick={() => arrancarEnfoque(workMin, breakMin)}
                    >
                        <span>🚀 Iniciar Pomodoro</span>
                    </button>
                </div>
            )}

            <div className="teacher-live-quote">
                <div className="teacher-avatar">💬</div>
                <div className="teacher-quote-content">
                    <strong>Tu Recordatorio</strong>
                    <p>{fraseVisible}</p>
                </div>
            </div>

            {fase === 'decision' && (
                <div className="focus-decision-row">
                    <p className="focus-decision-text">☕ ¡Descanso terminado! ¿Qué sigue?</p>
                    <div className="focus-decision-btns">
                        <button type="button" className="btn-focus-toggle" onClick={otraRonda}>
                            <span>🔁 Otra Ronda de Enfoque</span>
                        </button>
                        <button type="button" className="btn-focus-complete" onClick={handleCompletar}>
                            <span>✅ Completar Tarea</span>
                        </button>
                    </div>
                </div>
            )}

            {fase !== 'config' && fase !== 'decision' && (
                <div className="focus-actions">
                    <button type="button" className="btn-focus-complete" onClick={handleCompletar}>
                        <span>✅ ¡Completar Tarea! (Terminé antes / Listo)</span>
                    </button>
                    <button type="button" className="btn-focus-toggle" onClick={pausarReanudar}>
                        <span>{enPausa ? '▶️ Reanudar' : '⏸️ Pausar'}</span>
                    </button>
                    <button type="button" className="btn-focus-cancel" onClick={cancelar}>
                        <span>✕ Cancelar</span>
                    </button>
                </div>
            )}
        </div>
    );
};

