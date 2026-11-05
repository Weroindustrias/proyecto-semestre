import React from 'react';
import { TaskCard } from './TaskCard.jsx';

export const TaskList = ({ 
    agendaPriorizada = [], 
    filtroMateria, 
    setFiltroMateria, 
    materiasDisponibles = [], 
    totalCompletadas, 
    focusTareaId, 
    onIniciarPomodoro, 
    onAbrirCompletar, 
    onEliminar,
    onOpenHorasModal 
}) => {
    return (
        <div className="glass-card tasks-card">
            <div className="card-header space-between filter-bar">
                <div className="title-group">
                    <span className="icon">⚡</span>
                    <h2>Tareas Priorizadas por Dificultad y Entrega</h2>
                    <span className="badge-total-pendientes">
                        {agendaPriorizada.length} pendiente(s)
                    </span>
                </div>

                <div className="header-filter-row">
                    <div className="filter-controls">
                        <select 
                            id="filter-materia" 
                            value={filtroMateria} 
                            onChange={(e) => setFiltroMateria(e.target.value)}
                        >
                            <option value="all">Todas las materias</option>
                            {materiasDisponibles.map(mat => (
                                <option key={mat} value={mat}>{mat}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        type="button" 
                        className="btn-secondary btn-quick-horas" 
                        onClick={onOpenHorasModal} 
                        title="Ver horas realizadas"
                    >
                        ⏱️ Horas Realizadas (<span>{totalCompletadas}</span>)
                    </button>
                </div>
            </div>

            <div className="tasks-list-container">
                {agendaPriorizada.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">🎉</span>
                        <p>¡No tienes tareas pendientes en esta categoría! Todo organizado.</p>
                    </div>
                ) : (
                    agendaPriorizada.map((tarea, index) => (
                        <TaskCard 
                            key={tarea.id} 
                            tarea={tarea} 
                            index={index} 
                            estaEnfocada={String(focusTareaId) === String(tarea.id)} 
                            onIniciarPomodoro={onIniciarPomodoro} 
                            onAbrirCompletar={onAbrirCompletar} 
                            onEliminar={onEliminar} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};

