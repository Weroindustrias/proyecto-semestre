// ============================================================================
// DOMINIO 2: MÉTRICAS Y ESTADÍSTICAS
// 5. FUNCIONES PURAS DE ALTO ORDEN PARA MÉTRICAS (reduce, filter, map)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

/**
 * Función Pura con reduce: Calcula la sumatoria total de horas estimadas
 * @param {Array} listaTareas 
 * @returns {number}
 */
export const calcularHorasTotales = (listaTareas) => {
    return listaTareas.reduce((acum, t) => acum + (Number(t.horasEstimadas) || 2), 0);
};

/**
 * Función Pura con filter: Cuenta cuántas tareas tienen dificultad 'Alta'
 * @param {Array} listaTareas 
 * @returns {number}
 */
export const contarTareasAltaDificultad = (listaTareas) => {
    return listaTareas.filter(t => t.dificultad === 'Alta').length;
};

/**
 * Función Pura con map y Set: Extrae el conjunto de materias sin duplicados
 * @param {Array} listaTareas 
 * @param {Array} completadas 
 * @returns {Array<string>}
 */
export const obtenerMateriasUnicas = (listaTareas = [], completadas = []) => {
    const todas = [...listaTareas, ...completadas];
    const materiasSet = new Set(todas.map(t => t.materia));
    return Array.from(materiasSet);
};

