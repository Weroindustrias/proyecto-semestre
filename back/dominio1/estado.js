// ============================================================================
// DOMINIO 1: TAREAS Y PLANIFICACIÓN
// 2. ESTADOS INMUTABLES INICIALES (Con soporte para LocalStorage)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

export const TAREAS_INICIALES = [
    {
        id: '1',
        nombre: 'Examen Final de POO',
        materia: 'Programación Orientada a Objetos',
        diasRestantes: 1,
        dificultad: 'Alta',
        horasEstimadas: 4,
        mensajeMotivacional: '¡Repasar herencia y polimorfismo con enfoque total!'
    },
    {
        id: '2',
        nombre: 'Proyecto Engine Generativo',
        materia: 'Programación Funcional',
        diasRestantes: 3,
        dificultad: 'Media',
        horasEstimadas: 6,
        mensajeMotivacional: '¡Una sola función pura a la vez sin efectos secundarios!'
    },
    {
        id: '3',
        nombre: 'Investigación de Electrostática',
        materia: 'Física',
        diasRestantes: 5,
        dificultad: 'Baja',
        horasEstimadas: 2,
        mensajeMotivacional: '¡Resolver los ejercicios de campos eléctricos paso a paso!'
    }
];

export const COMPLETADAS_INICIALES = [];

/**
 * Carga de estado de tareas pendientes desde LocalStorage (o valores por defecto)
 * @returns {Array} Lista inmutable de tareas
 */
export const cargarTareas = () => {
    try {
        const guardadas = localStorage.getItem('pf_tareas_pendientes');
        return guardadas ? JSON.parse(guardadas) : TAREAS_INICIALES;
    } catch (e) {
        return TAREAS_INICIALES;
    }
};

/**
 * Carga de estado de tareas completadas desde LocalStorage
 * @returns {Array} Lista inmutable de tareas completadas
 */
export const cargarCompletadas = () => {
    try {
        const guardadas = localStorage.getItem('pf_tareas_completadas');
        if (guardadas) {
            const parsed = JSON.parse(guardadas);
            return parsed.filter(t => t.id !== 'comp-demo-1');
        }
        return COMPLETADAS_INICIALES;
    } catch (e) {
        return COMPLETADAS_INICIALES;
    }
};

/**
 * Persistir listas inmutables en LocalStorage
 * @param {Array} tareas 
 * @param {Array} completadas 
 */
export const persistirEstado = (tareas, completadas) => {
    try {
        if (tareas) localStorage.setItem('pf_tareas_pendientes', JSON.stringify(tareas));
        if (completadas) localStorage.setItem('pf_tareas_completadas', JSON.stringify(completadas));
    } catch (e) {
        console.warn('No se pudo guardar en localStorage', e);
    }
};

