import { useState, useEffect, useRef } from 'react';
import { reproducirAlarma, mostrarNotificacionNavegador, formatearTiempo } from '../../../back/dominio3_pomodoro/notificaciones.js';
import { obtenerMaestro } from '../../../back/dominio1/maestros.js';

export const usePomodoro = (onCompletarConTiempo) => {
    const [activa, setActiva] = useState(false);
    const [tarea, setTarea] = useState(null);
    const [fase, setFase] = useState('config'); // 'config' | 'enfoque' | 'descanso' | 'decision'
    const [segundosEnfoqueAcumulados, setSegundosEnfoqueAcumulados] = useState(0);
    const [segundosRestantes, setSegundosRestantes] = useState(0);
    const [duracionEnfoqueMin, setDuracionEnfoqueMin] = useState(() => parseInt(localStorage.getItem('pf_pomodoro_work'), 10) || 25);
    const [duracionDescansoMin, setDuracionDescansoMin] = useState(() => parseInt(localStorage.getItem('pf_pomodoro_break'), 10) || 10);
    const [enPausa, setEnPausa] = useState(false);

    const timerRef = useRef(null);

    const limpiarIntervalo = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const iniciarSesion = (targetTarea) => {
        limpiarIntervalo();
        setTarea(targetTarea);
        setActiva(true);
        setFase('config');
        setSegundosEnfoqueAcumulados(0);
        setSegundosRestantes(0);
        setEnPausa(false);
    };

    const arrancarEnfoque = (workMin, breakMin) => {
        const wMin = Math.max(1, parseInt(workMin, 10) || duracionEnfoqueMin);
        const bMin = Math.max(1, parseInt(breakMin, 10) || duracionDescansoMin);

        localStorage.setItem('pf_pomodoro_work', wMin);
        localStorage.setItem('pf_pomodoro_break', bMin);

        setDuracionEnfoqueMin(wMin);
        setDuracionDescansoMin(bMin);
        setFase('enfoque');
        setSegundosRestantes(wMin * 60);
        setEnPausa(false);
    };

    const otraRonda = () => {
        setFase('enfoque');
        setSegundosRestantes(duracionEnfoqueMin * 60);
        setEnPausa(false);
    };

    const pausarReanudar = () => {
        setEnPausa(prev => !prev);
    };

    const cancelar = () => {
        limpiarIntervalo();
        setActiva(false);
        setTarea(null);
        setFase('config');
        setSegundosEnfoqueAcumulados(0);
        setSegundosRestantes(0);
        setEnPausa(false);
    };

    // Motor de intervalo
    useEffect(() => {
        if (!activa || enPausa || (fase !== 'enfoque' && fase !== 'descanso')) {
            limpiarIntervalo();
            return;
        }

        timerRef.current = setInterval(() => {
            setSegundosRestantes(prev => {
                if (prev <= 1) {
                    reproducirAlarma();
                    if (fase === 'enfoque') {
                        setFase('descanso');
                        mostrarNotificacionNavegador('⏰ ¡Tiempo de enfoque terminado!', `Tómate ${duracionDescansoMin} min de descanso.`);
                        return duracionDescansoMin * 60;
                    } else if (fase === 'descanso') {
                        setFase('decision');
                        mostrarNotificacionNavegador('☕ ¡Descanso terminado!', '¿Otra ronda o completar tarea?');
                        return 0;
                    }
                }
                return prev - 1;
            });

            if (fase === 'enfoque') {
                setSegundosEnfoqueAcumulados(prev => prev + 1);
            }
        }, 1000);

        return () => limpiarIntervalo();
    }, [activa, enPausa, fase, duracionDescansoMin]);

    return {
        activa,
        tarea,
        fase,
        enPausa,
        segundosRestantes,
        segundosEnfoqueAcumulados,
        duracionEnfoqueMin,
        duracionDescansoMin,
        relojFormateado: formatearTiempo(Math.max(0, segundosRestantes)),
        maestro: tarea ? obtenerMaestro(tarea.materia) : null,
        iniciarSesion,
        arrancarEnfoque,
        otraRonda,
        pausarReanudar,
        cancelar
    };
};

