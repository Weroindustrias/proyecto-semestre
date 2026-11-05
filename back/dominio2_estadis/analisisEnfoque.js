// ============================================================================
// DOMINIO 2: MÉTRICAS Y ESTADÍSTICAS
// 6. PIPELINE DE ANÁLISIS DE ENFOQUE (¿Estás mejorando tu enfoque?)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

/**
 * Pipeline Funcional: Evalúa la eficiencia global, minutos ahorrados y tendencia
 * @param {Array} completadas Lista de tareas completadas
 * @returns {object} Métricas diagnósticas calculadas
 */
export const analizarEnfoqueFuncional = (completadas) => {
    if (!completadas || completadas.length === 0) {
        return {
            totalCompletadas: 0,
            horasEstimadasTotal: '0.0',
            horasRealesTotal: '0.0',
            minutosAhorradosTotal: 0,
            eficienciaGlobal: 0,
            tareasAntesDeTiempo: 0,
            porcentajeAntesDeTiempo: 0,
            tendencia: 'Sin datos aún. ¡Completa tu primera tarea para desbloquear el análisis!',
            estadoEnfoque: 'Neutro'
        };
    }

    const totalCompletadas = completadas.length;

    const minEstimados = completadas.reduce((acc, t) => acc + (t.minutosEstimados || t.horasEstimadas * 60), 0);
    const minReales = completadas.reduce((acc, t) => acc + (t.minutosReales || (t.horasReales ? t.horasReales * 60 : minEstimados)), 0);
    const minutosAhorradosTotal = completadas.reduce((acc, t) => acc + (Math.max(0, t.minutosAhorrados || 0)), 0);

    const tareasAntesDeTiempo = completadas.filter(t => (t.minutosAhorrados || 0) > 0).length;
    const porcentajeAntesDeTiempo = Math.round((tareasAntesDeTiempo / totalCompletadas) * 100);

    // Eficiencia: % de ahorro de tiempo vs planeado
    const diferencia = minEstimados - minReales;
    const eficienciaGlobal = minEstimados > 0 ? Math.round((diferencia / minEstimados) * 100) : 0;

    // Diagnóstico Pedagógico
    let tendencia = '';
    let estadoEnfoque = 'Óptimo';

    if (eficienciaGlobal >= 15) {
        tendencia = `🔥 ¡Tu enfoque está en franco ascenso! Has ahorrado un total de ${Math.round(minutosAhorradosTotal)} minutos (${eficienciaGlobal}% más rápido de lo estimado). El ${porcentajeAntesDeTiempo}% de tus tareas se terminaron antes de tiempo con gran claridad mental.`;
        estadoEnfoque = 'En Ascenso Imparable';
    } else if (eficienciaGlobal >= 0) {
        tendencia = `🎯 Ritmo sólido y disciplinado: estás cumpliendo tus compromisos dentro del marco temporal estimado (ahorraste ${Math.round(minutosAhorradosTotal)} min). Tu curva de atención es estable y predecible.`;
        estadoEnfoque = 'Enfoque Estable y Preciso';
    } else {
        tendencia = `💪 Esfuerzo profundo y persistente: varias tareas requirieron más tiempo del previsto original. El consejo de los maestros te sugiere planificar descansos estratégicos o elevar ligeramente las horas estimadas iniciales.`;
        estadoEnfoque = 'Requiere Calibración de Tiempo';
    }

    return {
        totalCompletadas,
        horasEstimadasTotal: (minEstimados / 60).toFixed(1),
        horasRealesTotal: (minReales / 60).toFixed(1),
        minutosAhorradosTotal: Math.round(minutosAhorradosTotal),
        eficienciaGlobal,
        tareasAntesDeTiempo,
        porcentajeAntesDeTiempo,
        tendencia,
        estadoEnfoque
    };
};

