import React, { useState, useMemo } from 'react';
import { calcularPrediccionTiempo } from '../../../back/dominio2_estadis/prediccion.js';

export const TaskForm = ({ onAgregarTarea, tareasCompletadas = [] }) => {
    const [nombre, setNombre] = useState('');
    const [materiaSelect, setMateriaSelect] = useState('');
    const [customMateria, setCustomMateria] = useState('');
    const [diasRestantes, setDiasRestantes] = useState('');
    const [horasEstimadas, setHorasEstimadas] = useState('');
    const [dificultad, setDificultad] = useState('Media');
    const [recordatorio, setRecordatorio] = useState('');

    const materiaEfectiva = materiaSelect === 'custom' ? customMateria.trim() : materiaSelect;

    // Predicción de tiempo funcional reactiva
    const prediccion = useMemo(() => {
        if (!materiaEfectiva) return null;
        return calcularPrediccionTiempo(materiaEfectiva, dificultad, tareasCompletadas);
    }, [materiaEfectiva, dificultad, tareasCompletadas]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre.trim() || !materiaEfectiva || diasRestantes === '' || horasEstimadas === '') {
            alert('Por favor completa todos los campos correctamente.');
            return;
        }

        const nuevaTarea = {
            id: Date.now().toString(),
            nombre: nombre.trim(),
            materia: materiaEfectiva,
            diasRestantes: parseInt(diasRestantes, 10),
            horasEstimadas: parseInt(horasEstimadas, 10),
            dificultad,
            mensajeMotivacional: recordatorio.trim()
        };

        onAgregarTarea(nuevaTarea);

        // Reset
        setNombre('');
        setMateriaSelect('');
        setCustomMateria('');
        setDiasRestantes('');
        setHorasEstimadas('');
        setDificultad('Media');
        setRecordatorio('');
    };

    return (
        <section className="glass-card form-section">
            <div className="card-header">
                <span className="icon">📝</span>
                <h2>Agregar Nueva Tarea</h2>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off">
                <div className="form-group">
                    <label htmlFor="task-name">Nombre de la Tarea</label>
                    <input 
                        type="text" 
                        id="task-name" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        placeholder="Ej. Examen de POO, Proyecto Final..." 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="materia-select">Materia</label>
                    <div className="select-wrapper">
                        <select 
                            id="materia-select" 
                            value={materiaSelect} 
                            onChange={(e) => setMateriaSelect(e.target.value)} 
                            required
                        >
                            <option value="" disabled>Selecciona una materia...</option>
                            <option value="Programación Funcional">Programación Funcional</option>
                            <option value="Física">Física</option>
                            <option value="Programación Orientada a Objetos">Programación Orientada a Objetos</option>
                            <option value="Cálculo Diferencial">Cálculo Diferencial</option>
                            <option value="custom">+ Agregar otra materia...</option>
                        </select>
                    </div>
                    {materiaSelect === 'custom' && (
                        <input 
                            type="text" 
                            className="custom-materia-input" 
                            placeholder="Escribe el nombre de la materia..." 
                            value={customMateria} 
                            onChange={(e) => setCustomMateria(e.target.value)} 
                            required 
                        />
                    )}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="dias-restantes">Días Restantes para Entrega</label>
                        <input 
                            type="number" 
                            id="dias-restantes" 
                            min="0" 
                            max="365" 
                            placeholder="Ej. 2" 
                            value={diasRestantes} 
                            onChange={(e) => setDiasRestantes(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="horas-estimadas">Horas Estimadas de Trabajo</label>
                        <input 
                            type="number" 
                            id="horas-estimadas" 
                            min="1" 
                            max="100" 
                            placeholder="Ej. 4" 
                            value={horasEstimadas} 
                            onChange={(e) => setHorasEstimadas(e.target.value)} 
                            required 
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Nivel de Dificultad</label>
                    <div className="difficulty-options">
                        <label className="diff-btn diff-baja">
                            <input 
                                type="radio" 
                                name="dificultad" 
                                value="Baja" 
                                checked={dificultad === 'Baja'} 
                                onChange={() => setDificultad('Baja')} 
                            />
                            <span>🌱 Baja (1.0)</span>
                        </label>
                        <label className="diff-btn diff-media">
                            <input 
                                type="radio" 
                                name="dificultad" 
                                value="Media" 
                                checked={dificultad === 'Media'} 
                                onChange={() => setDificultad('Media')} 
                            />
                            <span>⚖️ Media (2.0)</span>
                        </label>
                        <label className="diff-btn diff-alta">
                            <input 
                                type="radio" 
                                name="dificultad" 
                                value="Alta" 
                                checked={dificultad === 'Alta'} 
                                onChange={() => setDificultad('Alta')} 
                            />
                            <span>🔥 Alta (3.0)</span>
                        </label>
                    </div>
                </div>

                {prediccion && (
                    <div className="prediction-box">
                        <span className="prediction-icon">📊</span>
                        <span>
                            Basado en {prediccion.muestra} tarea(s) anteriores {prediccion.usoDificultadEspecifica ? `con dificultad ${dificultad}` : ''}, podría tomarte alrededor de <strong>{prediccion.horasSugeridas} hrs</strong>.
                            {' '}
                            <button 
                                type="button" 
                                className="btn-usar-prediccion" 
                                onClick={() => setHorasEstimadas(prediccion.horasSugeridas)}
                            >
                                Usar sugerencia
                            </button>
                        </span>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="task-quote">
                        📌 Recordatorio <span className="label-sub">(un tema o concepto que también quieras repasar)</span>
                    </label>
                    <input 
                        type="text" 
                        id="task-quote" 
                        placeholder="Ej. Recordatorio: también repasar qué es la recursividad" 
                        value={recordatorio} 
                        onChange={(e) => setRecordatorio(e.target.value)} 
                    />
                </div>

                <button type="submit" className="btn-primary">
                    <span>✨ Agregar y Reorganizar Agenda</span>
                </button>
            </form>
        </section>
    );
};

