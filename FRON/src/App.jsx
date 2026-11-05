import React, { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks.js';
import { usePomodoro } from './hooks/usePomodoro.js';
import { Header } from './components/Header.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import { FocusBanner } from './components/FocusBanner.jsx';
import { TaskList } from './components/TaskList.jsx';
import { ModalHorasRealizadas } from './components/ModalHorasRealizadas.jsx';
import { ModalCompletar } from './components/ModalCompletar.jsx';
import { ModalFlashcards } from './components/ModalFlashcards.jsx';

export const App = () => {
    // 1. Tema Claro / Oscuro
    const [tema, setTema] = useState(() => {
        try {
            return localStorage.getItem('pf_theme') === 'dark' ? 'dark' : 'light';
        } catch {
            return 'light';
        }
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', tema);
        try {
            localStorage.setItem('pf_theme', tema);
        } catch {}
    }, [tema]);

    const toggleTema = () => {
        setTema(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    // 2. Tareas y Métricas
    const {
        tareas,
        completadas,
        filtroMateria,
        setFiltroMateria,
        materiasDisponibles,
        agendaPriorizada,
        metricas,
        agregarTarea,
        eliminarTarea,
        eliminarCompletada,
        restaurarTarea,
        completarTarea,
        limpiarHistorial
    } = useTasks();

    // 3. Modales
    const [horasModalOpen, setHorasModalOpen] = useState(false);
    const [flashcardsModalOpen, setFlashcardsModalOpen] = useState(false);
    const [completarModalOpen, setCompletarModalOpen] = useState(false);
    const [tareaACompletar, setTareaACompletar] = useState(null);
    const [segundosCompletar, setSegundosCompletar] = useState(0);

    // 4. Pomodoro Focus
    const pomodoro = usePomodoro();

    const handleIniciarPomodoro = (tarea) => {
        pomodoro.iniciarSesion(tarea);
    };

    const handleAbrirCompletar = (tareaId, segundosCronometro = 0) => {
        const target = tareas.find(t => String(t.id) === String(tareaId)) || tareas[0];
        if (!target) return;
        setTareaACompletar(target);
        setSegundosCompletar(segundosCronometro || 0);
        setCompletarModalOpen(true);
    };

    const handleCerrarCompletar = () => {
        setCompletarModalOpen(false);
        setTareaACompletar(null);
        setSegundosCompletar(0);
    };

    const handleConfirmarCompletar = (tareaCompletada) => {
        completarTarea(tareaCompletada);
        if (pomodoro.activa && pomodoro.tarea && String(pomodoro.tarea.id) === String(tareaCompletada.idOriginal)) {
            pomodoro.cancelar();
        }
        handleCerrarCompletar();
        setHorasModalOpen(true);
    };

    // Detección de entorno Electron
    const isElectron = typeof window !== 'undefined' && window.electronAPI && window.electronAPI.isElectron;

    return (
        <div className="app-container">
            <Header 
                tema={tema} 
                onToggleTema={toggleTema} 
                totalCompletadas={completadas.length} 
                onOpenHorasModal={() => setHorasModalOpen(true)} 
                onOpenFlashcards={() => setFlashcardsModalOpen(true)} 
                isElectron={isElectron} 
            />

            <main className="dashboard-grid">
                <TaskForm 
                    onAgregarTarea={agregarTarea} 
                    tareasCompletadas={completadas} 
                />

                <section className="results-section">
                    <FocusBanner 
                        pomodoro={pomodoro} 
                        onAbrirCompletar={handleAbrirCompletar} 
                    />

                    <TaskList 
                        agendaPriorizada={agendaPriorizada} 
                        filtroMateria={filtroMateria} 
                        setFiltroMateria={setFiltroMateria} 
                        materiasDisponibles={materiasDisponibles} 
                        totalCompletadas={completadas.length} 
                        focusTareaId={pomodoro.activa && pomodoro.tarea ? pomodoro.tarea.id : null} 
                        onIniciarPomodoro={handleIniciarPomodoro} 
                        onAbrirCompletar={handleAbrirCompletar} 
                        onEliminar={eliminarTarea} 
                        onOpenHorasModal={() => setHorasModalOpen(true)} 
                    />
                </section>
            </main>

            <ModalHorasRealizadas 
                isOpen={horasModalOpen} 
                completadas={completadas} 
                metricas={metricas} 
                onCerrar={() => setHorasModalOpen(false)} 
                onRestaurar={restaurarTarea} 
                onEliminarCompletada={eliminarCompletada} 
                onLimpiarHistorial={limpiarHistorial} 
            />

            <ModalCompletar 
                isOpen={completarModalOpen} 
                tarea={tareaACompletar} 
                segundosCronometro={segundosCompletar} 
                onCerrar={handleCerrarCompletar} 
                onConfirmar={handleConfirmarCompletar} 
            />

            <ModalFlashcards 
                isOpen={flashcardsModalOpen} 
                tareas={tareas} 
                completadas={completadas} 
                onCerrar={() => setFlashcardsModalOpen(false)} 
            />
        </div>
    );
};

