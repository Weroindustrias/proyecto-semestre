// ============================================================================
// MOTOR FUNCIONAL (BACKEND NODE.JS)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

// 1. Base de Conocimiento Pedagógica
const MAESTROS = {
    'Programación Funcional': {
        nombre: 'Prof. Lambda (Funcional)',
        titulo: 'Cátedra de Paradigmas Declarativos',
        avatar: '⚡',
        enfoque: '«Enfócate en una sola función pura a la vez: sin efectos secundarios y sin mutar tu atención.»',
        completadoAntes: '«¡Sublime recursión mental! Minimizaste la complejidad temporal y terminaste antes de lo previsto.»',
        completadoNormal: '«Código elegante y sin bugs. Tu esfuerzo es una constante inmutable de triunfo.»',
        analisis: '«Tu mente opera con inmutabilidad y orden. Al eliminar distracciones, tu flujo de pensamiento alcanza la máxima optimización.»'
    },
    'Programación Orientada a Objetos': {
        nombre: 'Prof. Turing (POO)',
        titulo: 'Cátedra de Arquitectura & Software',
        avatar: '☕',
        enfoque: '«Encapsula tus distracciones, hereda la disciplina y mantén alta cohesión en cada hora de trabajo.»',
        completadoAntes: '«¡Sobrecarga de productividad! Diseñaste una solución limpia y eficiente mucho antes de lo presupuestado.»',
        completadoNormal: '«Tu arquitectura de trabajo es sólida y modular. Excelente entrega.»',
        analisis: '«Has encapsulado tus prioridades con rigor. La abstracción de tus problemas está en nivel de desarrollador Senior.»'
    },
    'Física': {
        nombre: 'Prof. Newton (Física)',
        titulo: 'Cátedra de Mecánica & Energía',
        avatar: '⚛️',
        enfoque: '«El primer paso vence la inercia estática. Una vez en movimiento, tu aceleración hacia la meta es imparable.»',
        completadoAntes: '«¡Velocidad supersónica! Tu vector de trabajo no tuvo fricción y conquistaste la meta con tiempo a tu favor.»',
        completadoNormal: '«La energía se transformó en conocimiento exacto. Ley inquebrantable de conservación del esfuerzo.»',
        analisis: '«Tu concentración genera un potente campo de inercia positiva que neutraliza cualquier distracción externa.»'
    },
    'Cálculo Diferencial': {
        nombre: 'Prof. Leibniz (Cálculo)',
        titulo: 'Cátedra de Análisis Matemático',
        avatar: '📐',
        enfoque: '«Cada minuto es un diferencial de tiempo: integrando pequeños lapsos constantes construyes un éxito monumental.»',
        completadoAntes: '«¡Optimizaste al máximo la función del tiempo! Encontraste el punto crítico ideal de máxima eficiencia.»',
        completadoNormal: '«El límite de tu constancia convergió con precisión matemática absoluta. Ni un paso en falso.»',
        analisis: '«La derivada de tu rendimiento diario es estrictamente positiva: estás en una trayectoria de crecimiento exponencial.»'
    },
    'default': {
        nombre: 'Mentor Académico ICI',
        titulo: 'Consejo de Ingeniería en Computación',
        avatar: '🎓',
        enfoque: '«La maestría no es un accidente, es el resultado de minutos de concentración deliberada. ¡Tú tienes el control!»',
        completadoAntes: '«¡Eficiencia de clase mundial! Superaste el cronómetro y conquistaste este reto con tiempo a tu favor.»',
        completadoNormal: '«Meta completada con honores. La disciplina que forjas hoy es el éxito de tu carrera mañana.»',
        analisis: '«Tu constancia demuestra madurez profesional y una formidable capacidad de entrega bajo cualquier estándar.»'
    }
};

const obtenerMaestro = (materia) => MAESTROS[materia] || MAESTROS['default'];

// 2. Funciones Puras de Priorización y Evaluación
const obtenerPesoDificultad = (dificultad) => {
    switch (dificultad) {
        case 'Alta': return 3.0;
        case 'Media': return 2.0;
        case 'Baja': return 1.0;
        default: return 1.0;
    }
};

const calcularPrioridad = (tarea) => {
    const peso = obtenerPesoDificultad(tarea.dificultad);
    const horas = Number(tarea.horasEstimadas) || 2;
    const dias = Number(tarea.diasRestantes) >= 0 ? Number(tarea.diasRestantes) : 1;
    const score = (peso * horas) / (dias + 0.1);
    return Math.round(score * 100) / 100;
};

const generarRazon = (tarea, score) => {
    if (Number(tarea.diasRestantes) <= 1) {
        return `URGENTE. Vence en menos de 24 horas y tiene dificultad ${tarea.dificultad}.`;
    } else if (score > 3.0) {
        return `IMPORTANTE. Requiere tiempo considerable (${tarea.horasEstimadas} hrs estimadas).`;
    } else {
        return `MODERADO. Tarea corta con suficiente tiempo disponible.`;
    }
};

const procesarYPriorizar = (listaTareas = []) => {
    const evaluadas = listaTareas.map(tarea => {
        const score = calcularPrioridad(tarea);
        const razon = generarRazon(tarea, score);
        return { ...tarea, score, razon };
    });
    return [...evaluadas].sort((a, b) => b.score - a.score);
};

// 3. Funciones Puras de Alto Orden (reduce, filter, map)
const calcularHorasTotales = (listaTareas = []) => {
    return listaTareas.reduce((acum, t) => acum + (Number(t.horasEstimadas) || 2), 0);
};

const contarTareasAltaDificultad = (listaTareas = []) => {
    return listaTareas.filter(t => t.dificultad === 'Alta').length;
};

const obtenerMateriasUnicas = (pendientes = [], completadas = []) => {
    const todas = [...pendientes, ...completadas];
    return Array.from(new Set(todas.map(t => t.materia).filter(Boolean)));
};

// 4. Pipeline de Análisis de Enfoque y Eficiencia
const analizarEnfoqueFuncional = (completadas = []) => {
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
    const minEstimados = completadas.reduce((acc, t) => acc + (t.minutosEstimados || (Number(t.horasEstimadas) || 1) * 60), 0);
    const minReales = completadas.reduce((acc, t) => acc + (t.minutosReales || (t.horasReales ? Number(t.horasReales) * 60 : minEstimados)), 0);
    const minutosAhorradosTotal = completadas.reduce((acc, t) => acc + (Math.max(0, t.minutosAhorrados || 0)), 0);

    const tareasAntesDeTiempo = completadas.filter(t => (t.minutosAhorrados || 0) > 0).length;
    const porcentajeAntesDeTiempo = Math.round((tareasAntesDeTiempo / totalCompletadas) * 100);

    const diferencia = minEstimados - minReales;
    const eficienciaGlobal = minEstimados > 0 ? Math.round((diferencia / minEstimados) * 100) : 0;

    let tendencia = '';
    let estadoEnfoque = 'Óptimo';

    if (eficienciaGlobal >= 15) {
        tendencia = `🔥 ¡Tu enfoque está en franco ascenso! Has ahorrado un total de ${Math.round(minutosAhorradosTotal)} minutos (${eficienciaGlobal}% más rápido de lo estimado). El ${porcentajeAntesDeTiempo}% de tus tareas se terminaron antes de tiempo.`;
        estadoEnfoque = 'En Ascenso Imparable';
    } else if (eficienciaGlobal >= 0) {
        tendencia = `🎯 Ritmo sólido y disciplinado: estás cumpliendo tus compromisos dentro del marco temporal estimado (ahorraste ${Math.round(minutosAhorradosTotal)} min).`;
        estadoEnfoque = 'Enfoque Estable y Preciso';
    } else {
        tendencia = `💪 Esfuerzo profundo y persistente: varias tareas requirieron más tiempo del previsto original. Se recomienda planificar descansos estratégicos.`;
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

// 5. Predicción Funcional de Tiempo
const calcularPrediccionTiempo = (materia, dificultad, completadas = []) => {
    if (!materia) return null;
    const historicoMateria = completadas.filter(t => t.materia === materia && t.minutosReales);
    if (historicoMateria.length === 0) return null;

    const mismaMateriaYDificultad = historicoMateria.filter(t => t.dificultad === dificultad);
    const muestraUsada = mismaMateriaYDificultad.length >= 2 ? mismaMateriaYDificultad : historicoMateria;

    const promedioMinutos = muestraUsada.reduce((acc, t) => acc + t.minutosReales, 0) / muestraUsada.length;
    const horasSugeridas = Math.max(0.5, Math.round((promedioMinutos / 60) * 2) / 2);

    return {
        horasSugeridas,
        muestra: muestraUsada.length,
        usoDificultadEspecifica: mismaMateriaYDificultad.length >= 2
    };
};

// 6. Cálculo de Racha de Días
const calcularRacha = (completadas = []) => {
    const fechasUnicas = Array.from(new Set(completadas.map(t => t.fechaISO).filter(Boolean)));
    if (fechasUnicas.length === 0) return { rachaActual: 0, mejorRacha: 0 };

    const fechasSet = new Set(fechasUnicas);
    const formatoISO = (d) => d.toISOString().split('T')[0];

    let rachaActual = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    if (!fechasSet.has(formatoISO(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }
    while (fechasSet.has(formatoISO(cursor))) {
        rachaActual += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    const fechasOrdenadas = fechasUnicas.map(f => new Date(`${f}T00:00:00`)).sort((a, b) => a - b);
    let mejorRacha = 1;
    let rachaTemp = 1;
    for (let i = 1; i < fechasOrdenadas.length; i++) {
        const diffDias = Math.round((fechasOrdenadas[i] - fechasOrdenadas[i - 1]) / 86400000);
        rachaTemp = diffDias === 1 ? rachaTemp + 1 : 1;
        mejorRacha = Math.max(mejorRacha, rachaTemp);
    }

    return { rachaActual, mejorRacha: Math.max(mejorRacha, rachaActual) };
};

// Exportación modular para Node.js (CommonJS y Browser universal)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MAESTROS,
        obtenerMaestro,
        obtenerPesoDificultad,
        calcularPrioridad,
        generarRazon,
        procesarYPriorizar,
        calcularHorasTotales,
        contarTareasAltaDificultad,
        obtenerMateriasUnicas,
        analizarEnfoqueFuncional,
        calcularPrediccionTiempo,
        calcularRacha
    };
}
