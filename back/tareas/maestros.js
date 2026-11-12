// ============================================================================
// DOMINIO 1: TAREAS Y PLANIFICACIÓN
// 1. BASE DE DATOS PEDAGÓGICA: MAESTROS Y MENSAJES MOTIVACIONALES
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

export const MAESTROS = {
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

/**
 * Función Pura: Obtener Maestro por Materia
 * @param {string} materia 
 * @returns {object} Objeto con datos del maestro
 */
export const obtenerMaestro = (materia) => {
    return MAESTROS[materia] || MAESTROS['default'];
};

