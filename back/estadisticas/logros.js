// ============================================================================
// DOMINIO 2: MÉTRICAS Y ESTADÍSTICAS
// 6.8 SISTEMA DE INSIGNIAS Y LOGROS (gamificación sobre tu historial)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

import { calcularRacha } from './rachaMapa.js';
import { analizarEnfoqueFuncional } from './analisisEnfoque.js';
import { mostrarNotificacionNavegador } from '../dominio3_pomodoro/notificaciones.js';

export const DEFINICION_LOGROS = [
    {
        id: 'primera-tarea', icono: '🎉', nombre: 'Primer Paso',
        descripcion: 'Completa tu primera tarea.',
        check: (c) => c.length >= 1
    },
    {
        id: 'diez-tareas', icono: '📚', nombre: 'Diez Tareas',
        descripcion: 'Completa 10 tareas en total.',
        check: (c) => c.length >= 10
    },
    {
        id: 'veinticinco-tareas', icono: '🏆', nombre: 'Veinticinco Tareas',
        descripcion: 'Completa 25 tareas en total.',
        check: (c) => c.length >= 25
    },
    {
        id: 'diez-altas', icono: '💪', nombre: 'Cazador de Retos',
        descripcion: 'Completa 10 tareas de dificultad Alta.',
        check: (c) => c.filter(t => t.dificultad === 'Alta').length >= 10
    },
    {
        id: 'racha-3', icono: '🔥', nombre: 'Constancia x3',
        descripcion: 'Alcanza una racha de 3 días seguidos.',
        check: (c, r) => r.mejorRacha >= 3
    },
    {
        id: 'racha-7', icono: '🏅', nombre: 'Semana Perfecta',
        descripcion: 'Alcanza una racha de 7 días seguidos.',
        check: (c, r) => r.mejorRacha >= 7
    },
    {
        id: 'eficiencia-alta', icono: '⚡', nombre: 'Máquina de Enfoque',
        descripcion: 'Alcanza +20% de eficiencia global.',
        check: (c, r, m) => m.eficienciaGlobal >= 20
    },
    {
        id: 'estudiante-integral', icono: '🎓', nombre: 'Estudiante Integral',
        descripcion: 'Completa al menos una tarea en 4 materias distintas.',
        check: (c) => new Set(c.map(t => t.materia)).size >= 4
    }
];

export const obtenerLogrosGuardados = () => {
    try {
        const guardado = localStorage.getItem('pf_logros_desbloqueados');
        return guardado ? JSON.parse(guardado) : [];
    } catch (e) {
        return [];
    }
};

export const guardarLogrosDesbloqueados = (ids) => {
    try {
        localStorage.setItem('pf_logros_desbloqueados', JSON.stringify(ids));
    } catch (e) {
        console.warn('No se pudo guardar los logros', e);
    }
};

/**
 * Revisa el historial, guarda los logros nuevos como permanentes y notifica los recién obtenidos
 * @param {Array} completadas 
 * @returns {Array<string>} Lista de IDs de logros desbloqueados
 */
export const actualizarLogrosDesbloqueados = (completadas = []) => {
    const racha = calcularRacha(completadas);
    const metricas = analizarEnfoqueFuncional(completadas);

    const idsQueCumplenAhora = DEFINICION_LOGROS
        .filter(l => l.check(completadas, racha, metricas))
        .map(l => l.id);

    const idsPrevios = obtenerLogrosGuardados();
    const idsUnion = Array.from(new Set([...idsPrevios, ...idsQueCumplenAhora]));
    const nuevos = idsUnion.filter(id => !idsPrevios.includes(id));

    if (nuevos.length > 0) {
        guardarLogrosDesbloqueados(idsUnion);
        DEFINICION_LOGROS.filter(l => nuevos.includes(l.id)).forEach(l => {
            mostrarNotificacionNavegador(`🏅 ¡Nueva insignia: ${l.nombre}!`, l.descripcion);
        });
    }

    return idsUnion;
};

