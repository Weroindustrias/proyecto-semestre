// ============================================================================
// DOMINIO 1: TAREAS Y PLANIFICACIÓN
// 4. FUNCIONES PURAS DE PRIORIZACIÓN Y EVALUACIÓN
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

/**
 * Función Pura: Asigna un peso numérico según la dificultad (Pattern Matching funcional)
 * @param {string} dificultad ('Alta', 'Media', 'Baja')
 * @returns {number}
 */
export const obtenerPesoDificultad = (dificultad) => {
    switch (dificultad) {
        case 'Alta': return 3.0;
        case 'Media': return 2.0;
        case 'Baja': return 1.0;
        default: return 1.0;
    }
};

/**
 * Función Pura: Calcula la puntuación matemática de prioridad
 * Fórmula: Score = (Peso * Horas) / (Días Restantes + 0.1)
 * @param {object} tarea 
 * @returns {number} Score redondeado a 2 decimales
 */
export const calcularPrioridad = (tarea) => {
    const peso = obtenerPesoDificultad(tarea.dificultad);
    const horas = tarea.horasEstimadas || 2;
    const score = (peso * horas) / (tarea.diasRestantes + 0.1);
    return Math.round(score * 100) / 100;
};

/**
 * Función Pura: Genera la justificación cualitativa de la prioridad
 * @param {object} tarea 
 * @param {number} score 
 * @returns {string} Razón pedagógica
 */
export const generarRazon = (tarea, score) => {
    if (tarea.diasRestantes <= 1) {
        return `URGENTE. Vence en menos de 24 horas y tiene dificultad ${tarea.dificultad}.`;
    } else if (score > 3.0) {
        return `IMPORTANTE. Requiere tiempo considerable (${tarea.horasEstimadas} hrs estimadas).`;
    } else {
        return `MODERADO. Tarea corta con suficiente tiempo disponible.`;
    }
};

/**
 * Canalización Funcional (Pipeline): Evalúa y ordena las tareas por mayor puntaje
 * @param {Array} listaTareas 
 * @returns {Array} Lista evaluada y ordenada descendentemente por score
 */
export const procesarYPriorizar = (listaTareas) => {
    const evaluadas = listaTareas.map(tarea => {
        const score = calcularPrioridad(tarea);
        const razon = generarRazon(tarea, score);
        return { ...tarea, score, razon };
    });
    return [...evaluadas].sort((a, b) => b.score - a.score);
};

