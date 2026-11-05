import { useState, useEffect, useMemo } from 'react';
import { cargarTareas, cargarCompletadas, persistirEstado } from '../../../back/dominio1/estado.js';
import { procesarYPriorizar } from '../../../back/dominio1/priorizacion.js';
import { analizarEnfoqueFuncional } from '../../../back/dominio2_estadis/analisisEnfoque.js';
import { obtenerMateriasUnicas } from '../../../back/dominio2_estadis/metricas.js';

export const useTasks = () => {
    const [tareas, setTareas] = useState(() => cargarTareas());
    const [completadas, setCompletadas] = useState(() => cargarCompletadas());
    const [filtroMateria, setFiltroMateria] = useState('all');

    useEffect(() => {
        persistirEstado(tareas, completadas);
    }, [tareas, completadas]);

    const agregarTarea = (nuevaTarea) => {
        setTareas(prev => [nuevaTarea, ...prev]);
        if (window.electronAPI && typeof window.electronAPI.notify === 'function') {
            window.electronAPI.notify('Tarea Registrada ⚡', `Se agregó: "${nuevaTarea.nombre}" para ${nuevaTarea.materia}`);
        }
    };

    const eliminarTarea = (id) => {
        setTareas(prev => prev.filter(t => String(t.id) !== String(id)));
    };

    const eliminarCompletada = (id) => {
        setCompletadas(prev => prev.filter(t => String(t.id) !== String(id)));
    };

    const restaurarTarea = (id) => {
        const target = completadas.find(t => String(t.id) === String(id));
        if (!target) return;

        const tareaRestaurada = {
            id: Date.now().toString(),
            nombre: target.nombre,
            materia: target.materia,
            diasRestantes: target.diasRestantes || 2,
            dificultad: target.dificultad || 'Media',
            horasEstimadas: target.horasEstimadas || 2,
            mensajeMotivacional: target.mensajeMotivacional || ''
        };

        setCompletadas(prev => prev.filter(t => String(t.id) !== String(id)));
        setTareas(prev => [tareaRestaurada, ...prev]);
    };

    const completarTarea = (tareaCompletada) => {
        setTareas(prev => prev.filter(t => String(t.id) !== String(tareaCompletada.idOriginal || tareaCompletada.id)));
        setCompletadas(prev => [tareaCompletada, ...prev]);
    };

    const limpiarHistorial = () => {
        if (window.confirm('¿Deseas limpiar el historial de tareas completadas?')) {
            setCompletadas([]);
        }
    };

    const materiasDisponibles = useMemo(() => {
        return obtenerMateriasUnicas(tareas, completadas);
    }, [tareas, completadas]);

    const tareasFiltradas = useMemo(() => {
        if (filtroMateria === 'all') return tareas;
        return tareas.filter(t => t.materia === filtroMateria);
    }, [tareas, filtroMateria]);

    const agendaPriorizada = useMemo(() => {
        return procesarYPriorizar(tareasFiltradas);
    }, [tareasFiltradas]);

    const metricas = useMemo(() => {
        return analizarEnfoqueFuncional(completadas);
    }, [completadas]);

    return {
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
    };
};

