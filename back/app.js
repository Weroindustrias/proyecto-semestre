// ============================================================================
// ENGINE FUNCIONAL EN JAVASCRIPT / RUST CLIENT ENGINE CON ANÁLISIS DE ENFOQUE
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

// 1. BASE DE DATOS PEDAGÓGICA: MAESTROS Y MENSAJES MOTIVACIONALES
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

// Función Pura: Obtener Maestro por Materia
const obtenerMaestro = (materia) => {
    return MAESTROS[materia] || MAESTROS['default'];
};

// 2. ESTADOS INMUTABLES INICIALES (Con soporte para LocalStorage)
const TAREAS_INICIALES = [
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

// Iniciar limpio sin demos predefinidos como solicitó Melvin
const COMPLETADAS_INICIALES = [];

// Carga de estado
let tareasState = (() => {
    try {
        const guardadas = localStorage.getItem('pf_tareas_pendientes');
        return guardadas ? JSON.parse(guardadas) : TAREAS_INICIALES;
    } catch (e) {
        return TAREAS_INICIALES;
    }
})();

let tareasCompletadasState = (() => {
    try {
        const guardadas = localStorage.getItem('pf_tareas_completadas');
        if (guardadas) {
            const parsed = JSON.parse(guardadas);
            // Limpiar demo previo para iniciar limpio
            return parsed.filter(t => t.id !== 'comp-demo-1');
        }
        return COMPLETADAS_INICIALES;
    } catch (e) {
        return COMPLETADAS_INICIALES;
    }
})();

const persistirEstado = () => {
    try {
        localStorage.setItem('pf_tareas_pendientes', JSON.stringify(tareasState));
        localStorage.setItem('pf_tareas_completadas', JSON.stringify(tareasCompletadasState));
    } catch (e) {
        console.warn('No se pudo guardar en localStorage', e);
    }
};

// 3. ESTADO DEL CRONÓMETRO DE ENFOQUE (Focus Mode / Pomodoro)
let focusSession = {
    activa: false,
    tarea: null,
    fase: 'config', // 'config' | 'enfoque' | 'descanso'
    segundosEnfoqueAcumulados: 0,
    segundosRestantes: 0,
    duracionEnfoqueMin: 25,
    duracionDescansoMin: 10,
    intervalId: null,
    enPausa: false
};

// 4. FUNCIONES PURAS DE PRIORIZACIÓN Y EVALUACIÓN
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
    const horas = tarea.horasEstimadas || 2;
    const score = (peso * horas) / (tarea.diasRestantes + 0.1);
    return Math.round(score * 100) / 100;
};

const generarRazon = (tarea, score) => {
    if (tarea.diasRestantes <= 1) {
        return `URGENTE. Vence en menos de 24 horas y tiene dificultad ${tarea.dificultad}.`;
    } else if (score > 3.0) {
        return `IMPORTANTE. Requiere tiempo considerable (${tarea.horasEstimadas} hrs estimadas).`;
    } else {
        return `MODERADO. Tarea corta con suficiente tiempo disponible.`;
    }
};

const procesarYPriorizar = (listaTareas) => {
    const evaluadas = listaTareas.map(tarea => {
        const score = calcularPrioridad(tarea);
        const razon = generarRazon(tarea, score);
        return { ...tarea, score, razon };
    });
    return [...evaluadas].sort((a, b) => b.score - a.score);
};

// 5. FUNCIONES PURAS DE ALTO ORDEN PARA MÉTRICAS (reduce, filter, map)
const calcularHorasTotales = (listaTareas) => {
    return listaTareas.reduce((acum, t) => acum + (Number(t.horasEstimadas) || 2), 0);
};

const contarTareasAltaDificultad = (listaTareas) => {
    return listaTareas.filter(t => t.dificultad === 'Alta').length;
};

const obtenerMateriasUnicas = (listaTareas) => {
    const todas = [...listaTareas, ...tareasCompletadasState];
    const materiasSet = new Set(todas.map(t => t.materia));
    return Array.from(materiasSet);
};

// 6. PIPELINE DE ANÁLISIS DE ENFOQUE (¿Estás mejorando tu enfoque?)
const analizarEnfoqueFuncional = (completadas) => {
    if (!completadas || completadas.length === 0) {
        return {
            totalCompletadas: 0,
            horasEstimadasTotal: 0,
            horasRealesTotal: 0,
            minutosAhorradosTotal: 0,
            eficienciaGlobal: 0,
            tareasAntesDeTiempo: 0,
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

    // Diagnóstico del Maestro
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

// 6.5 PREDICCIÓN DE TIEMPO BASADA EN HISTORIAL (Idea 1: usando filter/reduce sobre tareasCompletadasState)
const calcularPrediccionTiempo = (materia, dificultad) => {
    if (!materia) return null;
    const historicoMateria = tareasCompletadasState.filter(t => t.materia === materia && t.minutosReales);
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

const mostrarPrediccionTiempo = (materia, dificultad) => {
    const box = document.getElementById('prediction-box');
    const textEl = document.getElementById('prediction-text');
    if (!box || !textEl) return;

    const prediccion = calcularPrediccionTiempo(materia, dificultad);
    if (!prediccion) {
        box.classList.add('hidden');
        return;
    }

    const detalle = prediccion.usoDificultadEspecifica
        ? `de "${materia}" con dificultad ${dificultad}`
        : `de "${materia}"`;

    textEl.innerHTML = `Basado en ${prediccion.muestra} tarea(s) anteriores ${detalle}, podría tomarte alrededor de <strong>${prediccion.horasSugeridas} hrs</strong>. <button type="button" class="btn-usar-prediccion" id="btn-usar-prediccion">Usar sugerencia</button>`;
    box.classList.remove('hidden');

    const btnUsar = document.getElementById('btn-usar-prediccion');
    if (btnUsar) {
        btnUsar.addEventListener('click', () => {
            const horasInput = document.getElementById('horas-estimadas');
            if (horasInput) horasInput.value = prediccion.horasSugeridas;
        });
    }
};

// 6.6 RACHA DE ENFOQUE Y MAPA DE CALOR (Ideas 3 y 4)
const calcularRacha = (completadas) => {
    const fechasUnicas = Array.from(new Set(completadas.map(t => t.fechaISO).filter(Boolean)));
    if (fechasUnicas.length === 0) return { rachaActual: 0, mejorRacha: 0 };

    const fechasSet = new Set(fechasUnicas);
    const formatoISO = (d) => d.toISOString().split('T')[0];

    // Racha actual: cuenta hacia atrás desde hoy (o ayer, para no romperla si aún no completas nada hoy)
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

    // Mejor racha histórica: recorre las fechas ordenadas buscando la secuencia consecutiva más larga
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

const generarMapaCalorHTML = (completadas, semanas = 18) => {
    const conteoPorFecha = {};
    completadas.forEach(t => {
        if (!t.fechaISO) return;
        conteoPorFecha[t.fechaISO] = (conteoPorFecha[t.fechaISO] || 0) + 1;
    });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const finGrid = new Date(hoy);
    finGrid.setDate(hoy.getDate() + (6 - hoy.getDay())); // termina en el sábado de esta semana

    const totalDias = semanas * 7;
    const celdas = [];
    for (let i = totalDias - 1; i >= 0; i--) {
        const fecha = new Date(finGrid);
        fecha.setDate(finGrid.getDate() - i);
        const iso = fecha.toISOString().split('T')[0];
        const conteo = conteoPorFecha[iso] || 0;
        let nivel = 0;
        if (conteo >= 4) nivel = 4;
        else if (conteo === 3) nivel = 3;
        else if (conteo === 2) nivel = 2;
        else if (conteo === 1) nivel = 1;
        celdas.push({ iso, conteo, nivel, esFuturo: fecha > hoy });
    }

    let html = '<div class="heatmap-grid">';
    for (let semana = 0; semana < celdas.length / 7; semana++) {
        html += '<div class="heatmap-week">';
        for (let dia = 0; dia < 7; dia++) {
            const celda = celdas[semana * 7 + dia];
            if (!celda || celda.esFuturo) {
                html += `<div class="heatmap-cell nivel-vacio"></div>`;
            } else {
                const etiqueta = celda.conteo > 0 ? `${celda.conteo} tarea(s) completada(s)` : 'Sin actividad';
                html += `<div class="heatmap-cell nivel-${celda.nivel}" title="${celda.iso}: ${etiqueta}"></div>`;
            }
        }
        html += '</div>';
    }
    html += '</div>';
    return html;
};

// 6.7 NOTIFICACIONES DEL NAVEGADOR (para el Pomodoro, aunque cambies de pestaña)
const solicitarPermisoNotificaciones = () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
    }
};

const mostrarNotificacionNavegador = (titulo, cuerpo) => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    try {
        new Notification(titulo, { body: cuerpo, tag: 'pf-organizador' });
    } catch (e) {
        console.warn('No se pudo mostrar la notificación', e);
    }
};

// 6.8 SISTEMA DE INSIGNIAS Y LOGROS (gamificación sobre tu historial)
const DEFINICION_LOGROS = [
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

const obtenerLogrosGuardados = () => {
    try {
        const guardado = localStorage.getItem('pf_logros_desbloqueados');
        return guardado ? JSON.parse(guardado) : [];
    } catch (e) {
        return [];
    }
};

const guardarLogrosDesbloqueados = (ids) => {
    try {
        localStorage.setItem('pf_logros_desbloqueados', JSON.stringify(ids));
    } catch (e) {
        console.warn('No se pudo guardar los logros', e);
    }
};

// Revisa el historial, guarda los logros nuevos como permanentes y notifica los recién obtenidos
const actualizarLogrosDesbloqueados = (completadas) => {
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

// 6.9 COMPARACIÓN DE EFICIENCIA ENTRE MATERIAS (para la gráfica SVG)
const calcularComparacionMaterias = (completadas) => {
    const materias = Array.from(new Set(completadas.map(t => t.materia)));
    return materias.map(materia => {
        const tareasMateria = completadas.filter(t => t.materia === materia);
        const minEstimados = tareasMateria.reduce((acc, t) => acc + (t.minutosEstimados || 0), 0);
        const minReales = tareasMateria.reduce((acc, t) => acc + (t.minutosReales || 0), 0);
        const eficiencia = minEstimados > 0 ? Math.round(((minEstimados - minReales) / minEstimados) * 100) : 0;
        return { materia, eficiencia, totalTareas: tareasMateria.length };
    }).sort((a, b) => b.eficiencia - a.eficiencia);
};

// Genera el SVG de barras divergentes (sin librerías externas)
const generarGraficaMateriasHTML = (comparacion) => {
    if (!comparacion.length) {
        return `<p class="section-subtitle">Aún no hay suficientes tareas completadas para comparar materias.</p>`;
    }

    const anchoTotal = 580;
    const altoFila = 46;
    const margenIzq = 170;
    const margenDer = 65;
    const anchoUtil = anchoTotal - margenIzq - margenDer;
    const anchoMitad = anchoUtil / 2;
    const centroX = margenIzq + anchoMitad;
    const maxAbs = Math.max(25, ...comparacion.map(c => Math.abs(c.eficiencia)));
    const alto = comparacion.length * altoFila + 16;

    const filas = comparacion.map((c, i) => {
        const y = i * altoFila + 8;
        const altoBarra = altoFila - 16;
        const anchoBarra = Math.max(2, (Math.abs(c.eficiencia) / maxAbs) * anchoMitad);
        const esPositivo = c.eficiencia >= 0;
        const x = esPositivo ? centroX : centroX - anchoBarra;
        const color = esPositivo ? '#10b981' : '#ef4444';
        const textoValor = `${c.eficiencia > 0 ? '+' : ''}${c.eficiencia}%`;
        const xTexto = esPositivo ? x + anchoBarra + 8 : x - 8;
        const anclaje = esPositivo ? 'start' : 'end';

        return `
            <text x="${margenIzq - 12}" y="${y + altoBarra / 2 + 4}" text-anchor="end" class="chart-label">${c.materia}</text>
            <rect x="${x}" y="${y}" width="${anchoBarra}" height="${altoBarra}" rx="4" fill="${color}"></rect>
            <text x="${xTexto}" y="${y + altoBarra / 2 + 4}" text-anchor="${anclaje}" class="chart-value" fill="${color}">${textoValor}</text>
        `;
    }).join('');

    return `
        <svg viewBox="0 0 ${anchoTotal} ${alto}" class="materias-chart-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
            <line x1="${centroX}" y1="0" x2="${centroX}" y2="${alto}" class="chart-axis-line" />
            ${filas}
        </svg>
    `;
};

const formatearTiempo = (segundosTotales) => {
    const hrs = Math.floor(segundosTotales / 3600);
    const mins = Math.floor((segundosTotales % 3600) / 60);
    const secs = segundosTotales % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

// Alarma sonora (beep) generada con Web Audio API, sin archivos externos
const reproducirAlarma = () => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const tocarBeep = (frecuencia, inicio, duracion) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = frecuencia;
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.001, ctx.currentTime + inicio);
            gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + inicio + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + inicio + duracion);
            osc.start(ctx.currentTime + inicio);
            osc.stop(ctx.currentTime + inicio + duracion);
        };
        tocarBeep(880, 0, 0.25);
        tocarBeep(1046, 0.3, 0.35);
    } catch (e) {
        console.warn('No se pudo reproducir la alarma', e);
    }
};

const iniciarSesionEnfoque = (tareaId) => {
    const tarea = tareasState.find(t => t.id === tareaId);
    if (!tarea) return;

    const maestro = obtenerMaestro(tarea.materia);

    // Si ya había una corriendo, limpiamos su intervalo
    if (focusSession.intervalId) {
        clearInterval(focusSession.intervalId);
    }

    // Cargar config guardada
    const savedWork = localStorage.getItem('pf_pomodoro_work') || 25;
    const savedBreak = localStorage.getItem('pf_pomodoro_break') || 10;
    
    const workInputEl = document.getElementById('focus-work-minutes');
    if (workInputEl) workInputEl.value = savedWork;
    const breakInputEl = document.getElementById('focus-break-minutes');
    if (breakInputEl) breakInputEl.value = savedBreak;

    focusSession = {
        activa: true,
        tarea: tarea,
        fase: 'config', // 'config' | 'enfoque' | 'descanso'
        segundosEnfoqueAcumulados: 0, // tiempo real de trabajo (sin contar descansos)
        segundosRestantes: 0,
        duracionEnfoqueMin: parseInt(savedWork, 10) || 25,
        duracionDescansoMin: parseInt(savedBreak, 10) || 10,
        intervalId: null,
        enPausa: false
    };

    // Actualizar Banner en UI con la frase motivacional de Melvin
    const banner = document.getElementById('focus-banner');
    banner.classList.remove('focus-descanso');
    document.getElementById('focus-task-name').textContent = tarea.nombre;
    document.getElementById('focus-task-meta').textContent = `${tarea.materia} • Estimado: ${tarea.horasEstimadas} hrs • Dificultad: ${tarea.dificultad}`;
    document.getElementById('focus-teacher-avatar').textContent = '💬';
    document.getElementById('focus-teacher-name').textContent = 'Tu Recordatorio';
    document.getElementById('focus-teacher-quote').textContent = tarea.mensajeMotivacional 
        ? `«${tarea.mensajeMotivacional}»` 
        : `«${maestro.enfoque}»`;

    document.getElementById('focus-phase-icon').textContent = '⚙️';
    document.getElementById('focus-phase-badge').textContent = 'CONFIGURA TU POMODORO';
    document.getElementById('focus-timer-clock').textContent = '00:00:00';
    document.getElementById('focus-timer-sub').textContent = 'Ajusta tus minutos y presiona Iniciar';
    document.getElementById('btn-pause-focus').innerHTML = '<span>⏸️ Pausar</span>';

    document.getElementById('focus-config-row').classList.remove('hidden');
    document.getElementById('focus-actions-row').classList.add('hidden');
    document.getElementById('focus-decision-row').classList.add('hidden');

    banner.classList.remove('hidden');
    banner.style.display = 'block';
    banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Arranca el primer bloque de enfoque usando los minutos elegidos por el usuario
const iniciarFaseEnfoque = () => {
    if (!focusSession.activa) return;

    const workInput = document.getElementById('focus-work-minutes');
    const breakInput = document.getElementById('focus-break-minutes');
    const minutosEnfoque = Math.max(1, parseInt(workInput.value, 10) || 25);
    const minutosDescanso = Math.max(1, parseInt(breakInput.value, 10) || 10);

    // Guardar para la próxima vez
    localStorage.setItem('pf_pomodoro_work', minutosEnfoque);
    localStorage.setItem('pf_pomodoro_break', minutosDescanso);

    focusSession.duracionEnfoqueMin = minutosEnfoque;
    focusSession.duracionDescansoMin = minutosDescanso;
    focusSession.fase = 'enfoque';
    focusSession.segundosRestantes = minutosEnfoque * 60;
    focusSession.enPausa = false;

    const banner = document.getElementById('focus-banner');
    banner.classList.remove('focus-descanso');
    document.getElementById('focus-config-row').classList.add('hidden');
    document.getElementById('focus-decision-row').classList.add('hidden');
    document.getElementById('focus-actions-row').classList.remove('hidden');
    document.getElementById('focus-phase-icon').textContent = '🔥';
    document.getElementById('focus-phase-badge').textContent = 'SESIÓN DE ENFOQUE EN VIVO';
    document.getElementById('focus-timer-sub').textContent = 'Tiempo restante de enfoque';
    document.getElementById('focus-timer-clock').textContent = formatearTiempo(focusSession.segundosRestantes);

    tickearPomodoro();
};

// Reinicia otra ronda de enfoque reutilizando los minutos ya configurados
const reiniciarRondaEnfoque = () => {
    if (!focusSession.activa) return;
    focusSession.fase = 'enfoque';
    focusSession.segundosRestantes = focusSession.duracionEnfoqueMin * 60;
    focusSession.enPausa = false;

    const banner = document.getElementById('focus-banner');
    banner.classList.remove('focus-descanso');
    document.getElementById('focus-decision-row').classList.add('hidden');
    document.getElementById('focus-actions-row').classList.remove('hidden');
    document.getElementById('focus-phase-icon').textContent = '🔥';
    document.getElementById('focus-phase-badge').textContent = 'SESIÓN DE ENFOQUE EN VIVO';
    document.getElementById('focus-timer-sub').textContent = 'Tiempo restante de enfoque';
    document.getElementById('focus-timer-clock').textContent = formatearTiempo(focusSession.segundosRestantes);

    tickearPomodoro();
};

// Motor del cronómetro: cuenta hacia atrás la fase actual y cambia de fase al llegar a 0
const tickearPomodoro = () => {
    if (focusSession.intervalId) {
        clearInterval(focusSession.intervalId);
    }
    focusSession.intervalId = setInterval(() => {
        if (focusSession.enPausa) return;

        focusSession.segundosRestantes -= 1;
        if (focusSession.fase === 'enfoque') {
            focusSession.segundosEnfoqueAcumulados += 1;
        }

        const clockEl = document.getElementById('focus-timer-clock');
        if (clockEl) {
            clockEl.textContent = formatearTiempo(Math.max(0, focusSession.segundosRestantes));
        }

        if (focusSession.segundosRestantes <= 0) {
            reproducirAlarma();
            if (focusSession.fase === 'enfoque') {
                iniciarFaseDescanso();
            } else if (focusSession.fase === 'descanso') {
                finalizarDescanso();
            }
        }
    }, 1000);
};

// Al terminar el bloque de enfoque, arranca el descanso con los minutos configurados
const iniciarFaseDescanso = () => {
    focusSession.fase = 'descanso';
    focusSession.segundosRestantes = focusSession.duracionDescansoMin * 60;

    mostrarNotificacionNavegador(
        '⏰ ¡Tiempo de enfoque terminado!',
        `Buen trabajo. Tómate ${focusSession.duracionDescansoMin} min de descanso antes de seguir.`
    );

    const banner = document.getElementById('focus-banner');
    banner.classList.add('focus-descanso');
    document.getElementById('focus-phase-icon').textContent = '☕';
    document.getElementById('focus-phase-badge').textContent = '¡TIEMPO DE DESCANSO!';
    document.getElementById('focus-timer-sub').textContent = 'Tiempo restante de descanso';
    document.getElementById('focus-teacher-name').textContent = 'Consejo de Descanso';
    document.getElementById('focus-teacher-quote').textContent = '«Levántate, estira las piernas, hidrátate y descansa la vista. Tu mente lo agradecerá en la siguiente ronda.»';
};

// Al terminar el descanso, muestra el panel de decisión (otra ronda o completar tarea)
const finalizarDescanso = () => {
    if (focusSession.intervalId) {
        clearInterval(focusSession.intervalId);
    }
    mostrarNotificacionNavegador(
        '☕ ¡Descanso terminado!',
        '¿Otra ronda de enfoque o completar la tarea? Vuelve a la pestaña para decidir.'
    );
    document.getElementById('focus-timer-sub').textContent = 'Descanso completo';
    document.getElementById('focus-actions-row').classList.add('hidden');
    document.getElementById('focus-decision-row').classList.remove('hidden');
};

const pausarReanudarEnfoque = () => {
    if (!focusSession.activa || focusSession.fase === 'config') return;
    focusSession.enPausa = !focusSession.enPausa;
    const btn = document.getElementById('btn-pause-focus');
    if (focusSession.enPausa) {
        btn.innerHTML = '<span>▶️ Reanudar</span>';
    } else {
        btn.innerHTML = '<span>⏸️ Pausar</span>';
    }
};

const cancelarEnfoque = () => {
    if (focusSession.intervalId) {
        clearInterval(focusSession.intervalId);
    }
    focusSession = {
        activa: false,
        tarea: null,
        fase: 'config',
        segundosEnfoqueAcumulados: 0,
        segundosRestantes: 0,
        duracionEnfoqueMin: 25,
        duracionDescansoMin: 10,
        intervalId: null,
        enPausa: false
    };
    const banner = document.getElementById('focus-banner');
    if (banner) {
        banner.classList.add('hidden');
        banner.classList.remove('focus-descanso');
        banner.style.display = 'none';
    }
};

// 8. MODAL DE COMPLETAR TAREA (Tiempo real, antes de tiempo y maestro)
let tareaPendienteDeCompletar = null;

const abrirModalCompletar = (tareaId, segundosCronometro = null) => {
    let tarea = tareasState.find(t => String(t.id) === String(tareaId));
    if (!tarea && tareasState.length > 0) {
        tarea = tareasState[0];
    }
    if (!tarea) {
        cerrarModalCompletar();
        return;
    }

    tareaPendienteDeCompletar = tarea;
    const maestro = obtenerMaestro(tarea.materia);

    const modal = document.getElementById('complete-modal');
    if (!modal) return;

    document.getElementById('modal-task-title').textContent = `Registrar Horas: "${tarea.nombre}"`;
    document.getElementById('modal-task-info').textContent = `${tarea.materia} • Horas estimadas: ${tarea.horasEstimadas} hrs`;
    document.getElementById('modal-teacher-avatar').textContent = maestro.avatar;
    // El título y la frase reales se calculan en actualizarFeedbackModal() para
    // dar prioridad al mensaje personal que tú escribas arriba, en vez del consejo fijo.

    // Cargar el mensaje motivacional propio de la tarea para que Melvin lo pueda editar o conservar
    const quoteInput = document.getElementById('modal-custom-quote');
    if (quoteInput) {
        quoteInput.value = tarea.mensajeMotivacional || '';
    }

    // Calcular valores por defecto
    let horasDefault = tarea.horasEstimadas;
    let minutosDefault = 0;

    if (segundosCronometro !== null && segundosCronometro > 0) {
        horasDefault = Math.floor(segundosCronometro / 3600);
        minutosDefault = Math.max(1, Math.round((segundosCronometro % 3600) / 60));
    }

    document.getElementById('modal-time-hours').value = horasDefault;
    document.getElementById('modal-time-minutes').value = minutosDefault;

    actualizarFeedbackModal();
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
};

const actualizarFeedbackModal = () => {
    if (!tareaPendienteDeCompletar) return;

    const horas = parseInt(document.getElementById('modal-time-hours').value, 10) || 0;
    const minutos = parseInt(document.getElementById('modal-time-minutes').value, 10) || 0;
    const totalMinutosReales = horas * 60 + minutos;
    const totalMinutosEstimados = tareaPendienteDeCompletar.horasEstimadas * 60;
    const diferenciaMinutos = totalMinutosEstimados - totalMinutosReales;

    const maestro = obtenerMaestro(tareaPendienteDeCompletar.materia);
    const feedbackBox = document.getElementById('modal-diff-feedback');
    const quoteEl = document.getElementById('modal-teacher-quote');
    const titleEl = document.getElementById('modal-teacher-title');

    let mensajeMaestro;
    if (diferenciaMinutos > 0) {
        const porcentaje = Math.round((diferenciaMinutos / totalMinutosEstimados) * 100);
        feedbackBox.className = 'feedback-badge-box badge-ahorro';
        feedbackBox.innerHTML = `
            <div class="feedback-badge-header">
                <span class="badge-icon">⚡</span>
                <strong>¡Terminaste ${diferenciaMinutos} min antes de tiempo! (+${porcentaje}% de enfoque ganado)</strong>
            </div>
            <p>Ahorraste tiempo valioso para descansar o avanzar en otras materias.</p>
        `;
        mensajeMaestro = maestro.completadoAntes;
    } else if (diferenciaMinutos === 0) {
        feedbackBox.className = 'feedback-badge-box badge-exacto';
        feedbackBox.innerHTML = `
            <div class="feedback-badge-header">
                <span class="badge-icon">🎯</span>
                <strong>¡Cumplimiento Exacto! Realizada en las ${tareaPendienteDeCompletar.horasEstimadas} hrs planeadas.</strong>
            </div>
            <p>Precisión impecable en tu estimación.</p>
        `;
        mensajeMaestro = maestro.completadoNormal;
    } else {
        const extra = Math.abs(diferenciaMinutos);
        feedbackBox.className = 'feedback-badge-box badge-extra';
        feedbackBox.innerHTML = `
            <div class="feedback-badge-header">
                <span class="badge-icon">💪</span>
                <strong>Completada con tenacidad (+${extra} min adicionales requeridos).</strong>
            </div>
            <p>La dificultad era alta, pero no te rendiste hasta terminarla.</p>
        `;
        mensajeMaestro = maestro.completadoNormal;
    }

    // PRIORIDAD: si escribiste tu propio mensaje arriba, ese es el que se muestra aquí
    // en vez del consejo fijo del maestro (esto es lo que pediste ajustar).
    const customQuoteEl = document.getElementById('modal-custom-quote');
    const mensajePersonal = customQuoteEl ? customQuoteEl.value.trim() : '';

    if (mensajePersonal) {
        titleEl.textContent = '📌 Tu Recordatorio:';
        quoteEl.textContent = `«${mensajePersonal}»`;
    } else {
        titleEl.textContent = `Consejo del ${maestro.nombre}:`;
        quoteEl.textContent = mensajeMaestro;
    }
};

const cerrarModalCompletar = () => {
    const modal = document.getElementById('complete-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
    tareaPendienteDeCompletar = null;
};

const confirmarCompletarTarea = () => {
    if (!tareaPendienteDeCompletar) {
        if (tareasState.length > 0) {
            tareaPendienteDeCompletar = tareasState[0];
        } else {
            cerrarModalCompletar();
            return;
        }
    }

    const horasInput = document.getElementById('modal-time-hours');
    const minutosInput = document.getElementById('modal-time-minutes');
    const horas = horasInput ? parseInt(horasInput.value, 10) || 0 : 0;
    const minutos = minutosInput ? parseInt(minutosInput.value, 10) || 0 : 0;
    const totalMinutosReales = Math.max(1, horas * 60 + minutos);
    const totalMinutosEstimados = (tareaPendienteDeCompletar.horasEstimadas || 2) * 60;
    const minutosAhorrados = totalMinutosEstimados - totalMinutosReales;
    const eficienciaPorcentaje = Math.round((minutosAhorrados / totalMinutosEstimados) * 100);

    const maestro = obtenerMaestro(tareaPendienteDeCompletar.materia);
    const ahora = new Date();
    const formatoFecha = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')} - ${ahora.toLocaleDateString()}`;
    const fechaISO = ahora.toISOString().split('T')[0];

    // Mensaje motivacional personalizado que Melvin escribió
    const customQuoteEl = document.getElementById('modal-custom-quote');
    const mensajePersonal = (customQuoteEl && customQuoteEl.value.trim()) 
        ? customQuoteEl.value.trim() 
        : (tareaPendienteDeCompletar.mensajeMotivacional || (minutosAhorrados > 0 ? maestro.completadoAntes : maestro.completadoNormal));

    const tareaCompletada = {
        ...tareaPendienteDeCompletar,
        id: `comp-${Date.now()}`,
        minutosEstimados: totalMinutosEstimados,
        horasReales: (totalMinutosReales / 60).toFixed(1),
        minutosReales: totalMinutosReales,
        minutosAhorrados: minutosAhorrados,
        eficienciaPorcentaje: eficienciaPorcentaje,
        fechaCompletada: formatoFecha,
        fechaISO: fechaISO,
        maestro: maestro,
        mensajeMotivacional: mensajePersonal
    };

    // 1. Quitar de tareas pendientes (inmutabilidad con filter y comparación flexible de id)
    tareasState = tareasState.filter(t => String(t.id) !== String(tareaPendienteDeCompletar.id));

    // 2. Agregar a tareas completadas (inmutabilidad con spread)
    tareasCompletadasState = [tareaCompletada, ...tareasCompletadasState];

    // 3. Persistir en localStorage
    persistirEstado();

    // 4. Si la tarea que se completó era la activa en el cronómetro, cancelar sesión
    if (focusSession.activa && focusSession.tarea && String(focusSession.tarea.id) === String(tareaPendienteDeCompletar.id)) {
        cancelarEnfoque();
    }

    // 5. Cerrar modal y limpiar
    cerrarModalCompletar();

    // 6. Renderizar toda la aplicación
    renderApp();

    // 7. Abrir el apartado de horas realizadas para que Melvin vea su nuevo registro
    abrirModalHorasRealizadas();
};

// 7.5 REPASO DE RECORDATORIOS EN MODO FLASHCARDS (Idea 2)
let flashcardIndex = 0;
let flashcardsData = [];

const recolectarFlashcards = () => {
    const desdeTareas = (lista) => lista
        .filter(t => t.mensajeMotivacional && t.mensajeMotivacional.trim())
        .map(t => ({ materia: t.materia, nombre: t.nombre, recordatorio: t.mensajeMotivacional.trim() }));

    return [...desdeTareas(tareasState), ...desdeTareas(tareasCompletadasState)];
};

const renderFlashcardActual = () => {
    if (!flashcardsData.length) return;
    const actual = flashcardsData[flashcardIndex];
    document.getElementById('flashcard-front-text').textContent = `${actual.materia} — ${actual.nombre}`;
    document.getElementById('flashcard-back-text').textContent = actual.recordatorio;
    document.getElementById('flashcard-contador').textContent = `${flashcardIndex + 1} / ${flashcardsData.length}`;
    document.getElementById('flashcard-inner').classList.remove('flipped');
};

const moverFlashcard = (direccion) => {
    if (!flashcardsData.length) return;
    flashcardIndex = (flashcardIndex + direccion + flashcardsData.length) % flashcardsData.length;
    renderFlashcardActual();
};

const abrirModalFlashcards = () => {
    flashcardsData = recolectarFlashcards();
    flashcardIndex = 0;

    const emptyState = document.getElementById('flashcard-empty');
    const content = document.getElementById('flashcard-content');

    if (flashcardsData.length === 0) {
        emptyState.classList.remove('hidden');
        content.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        content.classList.remove('hidden');
        renderFlashcardActual();
    }

    const modal = document.getElementById('modal-flashcards');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
};

const cerrarModalFlashcards = () => {
    const modal = document.getElementById('modal-flashcards');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
};


const abrirModalHorasRealizadas = () => {
    const modal = document.getElementById('modal-horas-realizadas');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
};

const cerrarModalHorasRealizadas = () => {
    const modal = document.getElementById('modal-horas-realizadas');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
};

// 10. RENDERIZADO DECLARATIVO DE LA APLICACIÓN
const renderApp = () => {
    const filterMateriaSelect = document.getElementById('filter-materia');
    const selectedFilter = filterMateriaSelect ? filterMateriaSelect.value : 'all';

    // 1. Filtrado declarativo por materia
    const tareasFiltradas = selectedFilter === 'all' 
        ? tareasState 
        : tareasState.filter(t => t.materia === selectedFilter);

    // 2. Procesar agenda priorizada con pipeline funcional
    const agendaPriorizada = procesarYPriorizar(tareasFiltradas);

    // 3. Métricas de Análisis de Enfoque con HOF
    const metricas = analizarEnfoqueFuncional(tareasCompletadasState);

    // 4. Actualizar Badges y Contadores principales de la página
    const badgeTotal = document.getElementById('badge-total-pendientes');
    if (badgeTotal) badgeTotal.textContent = `${agendaPriorizada.length} pendiente(s)`;

    const headerBadge = document.getElementById('header-badge-completadas');
    if (headerBadge) headerBadge.textContent = tareasCompletadasState.length;

    const quickCount = document.getElementById('quick-horas-count');
    if (quickCount) quickCount.textContent = tareasCompletadasState.length;

    // 5. Actualizar Barra de Estadísticas interna del Modal de Horas Realizadas
    const totalHorasReales = (tareasCompletadasState.reduce((acum, t) => acum + (t.minutosReales || 0), 0) / 60).toFixed(1);
    const totalMinutosAhorrados = tareasCompletadasState.reduce((acum, t) => acum + Math.max(0, t.minutosAhorrados || 0), 0);
    const totalHorasAhorradas = (totalMinutosAhorrados / 60).toFixed(1);

    const mStatComp = document.getElementById('modal-stat-completadas');
    if (mStatComp) mStatComp.textContent = tareasCompletadasState.length;

    const mStatHoras = document.getElementById('modal-stat-horas-reales');
    if (mStatHoras) mStatHoras.textContent = `${totalHorasReales} hrs`;

    const mStatAhorro = document.getElementById('modal-stat-tiempo-ahorrado');
    if (mStatAhorro) mStatAhorro.textContent = totalMinutosAhorrados >= 60 ? `${totalHorasAhorradas} hrs` : `${totalMinutosAhorrados} min`;

    const mStatEficiencia = document.getElementById('modal-stat-eficiencia');
    if (mStatEficiencia) {
        if (metricas.eficienciaGlobal > 0) {
            mStatEficiencia.textContent = `+${metricas.eficienciaGlobal}%`;
            mStatEficiencia.style.color = 'var(--diff-baja)';
        } else if (metricas.eficienciaGlobal === 0) {
            mStatEficiencia.textContent = `0%`;
            mStatEficiencia.style.color = 'var(--accent-cyan)';
        } else {
            mStatEficiencia.textContent = `${metricas.eficienciaGlobal}%`;
            mStatEficiencia.style.color = 'var(--diff-media)';
        }
    }

    // 6. Actualizar Filtro de Materias
    actualizarFiltroMaterias();

    // 7. Renderizar Lista de Tareas Pendientes (Vista limpia en pantalla principal)
    const tasksContainer = document.getElementById('tasks-list');
    if (tasksContainer) {
        if (agendaPriorizada.length === 0) {
            tasksContainer.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🎉</span>
                    <p>¡No tienes tareas pendientes en esta categoría! Todo organizado.</p>
                </div>
            `;
        } else {
            tasksContainer.innerHTML = agendaPriorizada.map((tarea, index) => {
                const estaEnfocada = focusSession.activa && focusSession.tarea && focusSession.tarea.id === tarea.id;

                return `
                    <div class="task-item ${tarea.dificultad.toLowerCase()} ${estaEnfocada ? 'task-focused' : ''}">
                        <div class="task-main">
                            <div class="task-badge-row">
                                <span class="priority-rank">#${index + 1} Prioridad</span>
                                <span class="materia-tag">${tarea.materia}</span>
                                ${estaEnfocada ? '<span class="live-tag">🔥 Enfoque Activo</span>' : ''}
                            </div>
                            <h3 class="task-title">${tarea.nombre}</h3>
                            <div class="task-meta">
                                <span>⏱️ Vence en <strong>${tarea.diasRestantes} día(s)</strong></span>
                                <span>⌛ Estimado: <strong>${tarea.horasEstimadas} hrs</strong></span>
                                <span>📊 Dificultad: <strong>${tarea.dificultad}</strong></span>
                            </div>
                            
                            <!-- Recordatorio de tema/concepto que Melvin puso -->
                            ${tarea.mensajeMotivacional ? `
                                <div class="custom-user-quote-box">
                                    <span class="quote-icon">📌</span>
                                    <span><strong>Recordatorio:</strong> "${tarea.mensajeMotivacional}"</span>
                                </div>
                            ` : `
                                <div class="reason-box">
                                    <span class="reason-icon">💡</span>
                                    <span>${tarea.razon}</span>
                                </div>
                            `}
                        </div>

                        <div class="task-actions-col">
                            <span class="score-tag">${tarea.score} pts</span>
                            
                            <div class="task-btns-group">
                                <button type="button" class="btn-action btn-check" onclick="abrirModalCompletar('${tarea.id}')" title="Registrar las horas que te dio en realizarla">
                                    <span>⏱️ Registrar Horas</span>
                                </button>
                                <button type="button" class="btn-action btn-timer" onclick="iniciarSesionEnfoque('${tarea.id}')" title="Medir tiempo en vivo con cronómetro">
                                    <span>▶️ Cronómetro</span>
                                </button>
                                <button type="button" class="btn-delete" onclick="eliminarTarea('${tarea.id}')" title="Eliminar tarea">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // 8. Renderizar Historial de Tareas Realizadas (Dentro del Modal)
    const completedContainer = document.getElementById('completed-list');
    if (completedContainer) {
        if (tareasCompletadasState.length === 0) {
            completedContainer.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📝</span>
                    <p>Aún no has registrado tareas realizadas. Usa el botón "⏱️ Registrar Horas" en cualquier tarea para registrar tu primer logro.</p>
                </div>
            `;
        } else {
            completedContainer.innerHTML = tareasCompletadasState.map(t => {
                const ahorroTexto = t.minutosAhorrados > 0 
                    ? `<span class="badge-saving">⚡ Ahorraste ${t.minutosAhorrados} min (+${t.eficienciaPorcentaje}% enfoque)</span>`
                    : (t.minutosAhorrados === 0 ? `<span class="badge-ontime">🎯 A tiempo exacto</span>` : `<span class="badge-extra-time">💪 +${Math.abs(t.minutosAhorrados)} min dedicados</span>`);

                const horasStr = t.minutosReales >= 60 
                    ? `${Math.floor(t.minutosReales / 60)}h ${t.minutosReales % 60}m`
                    : `${t.minutosReales} min`;

                return `
                    <div class="completed-task-card">
                        <div class="completed-main">
                            <div class="task-badge-row">
                                <span class="materia-tag">${t.materia}</span>
                                <span class="completed-date">🕒 ${t.fechaCompletada}</span>
                                ${ahorroTexto}
                            </div>
                            <h3 class="completed-title">✅ ${t.nombre}</h3>
                            <div class="completed-meta">
                                <span>⌛ Estimado inicial: <strong>${t.horasEstimadas} hrs (${t.horasEstimadas * 60} min)</strong></span>
                                <span>⏱️ Horas que dio en realizar: <strong class="highlight-time">${horasStr}</strong></span>
                            </div>
                            
                            <!-- Recordatorio puesto por Melvin -->
                            <div class="master-congrats-bubble">
                                <span class="bubble-avatar">📌</span>
                                <div class="bubble-text">
                                    <strong>Recordatorio:</strong>
                                    <p>${t.mensajeMotivacional || '¡Tarea realizada con éxito!'}</p>
                                </div>
                            </div>
                        </div>

                        <div class="completed-side">
                            <button type="button" class="btn-restore" onclick="restaurarTarea('${t.id}')" title="Regresar a tareas pendientes">
                                ↩️ Restaurar
                            </button>
                            <button type="button" class="btn-delete" onclick="eliminarCompletada('${t.id}')" title="Eliminar del historial">
                                🗑️
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // 9. Renderizar Dashboard de Análisis de Enfoque (TAB 3)
    const analysisDashboard = document.getElementById('analysis-dashboard');
    if (analysisDashboard) {
        // Obtenemos materias cursadas en completadas
        const materiasCompletadas = Array.from(new Set(tareasCompletadasState.map(t => t.materia)));

        analysisDashboard.innerHTML = `
            <!-- Focus Score Highlights -->
            <div class="analysis-kpis-grid">
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">⚡</span>
                    <div class="kpi-info">
                        <span class="kpi-value ${metricas.eficienciaGlobal >= 0 ? 'color-pos' : 'color-neg'}">${metricas.eficienciaGlobal >= 0 ? '+' : ''}${metricas.eficienciaGlobal}%</span>
                        <span class="kpi-label">Índice de Eficiencia Global</span>
                    </div>
                </div>
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">⏱️</span>
                    <div class="kpi-info">
                        <span class="kpi-value">${metricas.minutosAhorradosTotal} min</span>
                        <span class="kpi-label">Tiempo Ahorrado (Enfoque)</span>
                    </div>
                </div>
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">🏆</span>
                    <div class="kpi-info">
                        <span class="kpi-value">${metricas.tareasAntesDeTiempo} de ${metricas.totalCompletadas}</span>
                        <span class="kpi-label">Terminadas Antes de Tiempo</span>
                    </div>
                </div>
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">⌛</span>
                    <div class="kpi-info">
                        <span class="kpi-value">${metricas.horasRealesTotal} hrs</span>
                        <span class="kpi-label">Horas Reales de Enfoque</span>
                    </div>
                </div>
            </div>

            <!-- Intelligent Focus Diagnostic Card -->
            <div class="focus-diagnostic-card glass-card">
                <div class="diagnostic-header">
                    <div class="diagnostic-badge">
                        <span class="pulse-dot"></span>
                        <span>Diagnóstico Agéntico: ${metricas.estadoEnfoque}</span>
                    </div>
                </div>
                <h3 class="diagnostic-title">¿Cómo estás mejorando tu enfoque?</h3>
                <p class="diagnostic-text">${metricas.tendencia}</p>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${Math.min(100, Math.max(10, metricas.porcentajeAntesDeTiempo || 20))}%;"></div>
                </div>
                <span class="progress-label">${metricas.porcentajeAntesDeTiempo || 0}% de tus tareas se resuelven a velocidad superior al promedio</span>
            </div>

            <!-- Comparación de Eficiencia entre Materias (gráfica SVG) -->
            <div class="materias-chart-section glass-card">
                <h3 class="section-title">📊 Comparación de Eficiencia entre Materias</h3>
                <p class="section-subtitle">Verde = terminas más rápido de lo estimado. Rojo = te toma más tiempo del planeado.</p>
                ${generarGraficaMateriasHTML(calcularComparacionMaterias(tareasCompletadasState))}
            </div>

            <!-- The Council of Masters (Feedback from each Teacher) -->
            <div class="masters-council-section">
                <h3 class="section-title">🎓 Feedback y Sabiduría de Cada Maestro</h3>
                <p class="section-subtitle">Tus maestros evalúan cómo aplicas la disciplina mental en cada una de sus materias:</p>
                
                <div class="masters-grid">
                    ${Object.keys(MAESTROS).filter(k => k !== 'default').map(key => {
                        const m = MAESTROS[key];
                        const tareasMateria = tareasCompletadasState.filter(t => t.materia === key);
                        const tieneCompletadas = tareasMateria.length > 0;
                        const ahorroMateria = tareasMateria.reduce((acc, t) => acc + Math.max(0, t.minutosAhorrados), 0);

                        return `
                            <div class="master-card glass-card ${tieneCompletadas ? 'active-master' : ''}">
                                <div class="master-card-header">
                                    <span class="master-avatar">${m.avatar}</span>
                                    <div>
                                        <h4>${m.nombre}</h4>
                                        <span class="master-title">${key}</span>
                                    </div>
                                </div>
                                <p class="master-analysis">"${m.analisis}"</p>
                                <div class="master-stats">
                                    <span>Completadas: <strong>${tareasMateria.length}</strong></span>
                                    <span>Ahorro: <strong>${ahorroMateria} min</strong></span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // 9.5 Renderizar Dashboard de Racha, Mapa de Calor e Insignias (Ideas 3, 4 y Logros)
    const rachaContainer = document.getElementById('racha-dashboard');
    if (rachaContainer) {
        const racha = calcularRacha(tareasCompletadasState);
        const heatmapHtml = generarMapaCalorHTML(tareasCompletadasState);
        const logrosDesbloqueados = actualizarLogrosDesbloqueados(tareasCompletadasState);

        rachaContainer.innerHTML = `
            <div class="analysis-kpis-grid">
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">🔥</span>
                    <div class="kpi-info">
                        <span class="kpi-value">${racha.rachaActual} día(s)</span>
                        <span class="kpi-label">Racha Actual de Enfoque</span>
                    </div>
                </div>
                <div class="kpi-card glass-card">
                    <span class="kpi-icon">🏅</span>
                    <div class="kpi-info">
                        <span class="kpi-value">${racha.mejorRacha} día(s)</span>
                        <span class="kpi-label">Mejor Racha Histórica</span>
                    </div>
                </div>
            </div>

            <div class="heatmap-section glass-card">
                <h3 class="section-title">🗺️ Mapa de Calor de Productividad</h3>
                <p class="section-subtitle">Cada cuadro es un día; mientras más intenso el color, más tareas completaste ese día.</p>
                <div class="heatmap-scroll">
                    ${heatmapHtml}
                </div>
                <div class="heatmap-legend">
                    <span>Menos</span>
                    <span class="heatmap-cell nivel-0"></span>
                    <span class="heatmap-cell nivel-1"></span>
                    <span class="heatmap-cell nivel-2"></span>
                    <span class="heatmap-cell nivel-3"></span>
                    <span class="heatmap-cell nivel-4"></span>
                    <span>Más</span>
                </div>
            </div>

            <!-- Insignias / Logros desbloqueables -->
            <div class="logros-section glass-card">
                <h3 class="section-title">🏅 Insignias Desbloqueadas</h3>
                <p class="section-subtitle">Cada insignia se desbloquea sola conforme avanzas; se queda guardada aunque borres tu historial.</p>
                <div class="logros-grid">
                    ${DEFINICION_LOGROS.map(logro => {
                        const desbloqueada = logrosDesbloqueados.includes(logro.id);
                        return `
                            <div class="logro-card ${desbloqueada ? 'logro-desbloqueado' : 'logro-bloqueado'}">
                                <span class="logro-icono">${desbloqueada ? logro.icono : '🔒'}</span>
                                <div class="logro-info">
                                    <strong>${logro.nombre}</strong>
                                    <p>${logro.descripcion}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
};

// 11. ACTUALIZAR OPCIONES DEL FILTRO DE MATERIAS
const actualizarFiltroMaterias = () => {
    const filterSelect = document.getElementById('filter-materia');
    if (!filterSelect) return;
    const valorActual = filterSelect.value;
    const materias = obtenerMateriasUnicas(tareasState);

    let html = '<option value="all">Todas las materias</option>';
    materias.forEach(mat => {
        html += `<option value="${mat}" ${mat === valorActual ? 'selected' : ''}>${mat}</option>`;
    });

    filterSelect.innerHTML = html;
};

// 12. ACCIONES GLOBALES EXPUESTAS EN WINDOW
window.eliminarTarea = (id) => {
    tareasState = tareasState.filter(t => t.id !== id);
    persistirEstado();
    renderApp();
};

window.eliminarCompletada = (id) => {
    tareasCompletadasState = tareasCompletadasState.filter(t => t.id !== id);
    persistirEstado();
    renderApp();
};

window.restaurarTarea = (id) => {
    const tarea = tareasCompletadasState.find(t => t.id === id);
    if (!tarea) return;

    // Crear tarea pendiente nuevamente
    const tareaRestaurada = {
        id: Date.now().toString(),
        nombre: tarea.nombre,
        materia: tarea.materia,
        diasRestantes: tarea.diasRestantes || 2,
        dificultad: tarea.dificultad || 'Media',
        horasEstimadas: tarea.horasEstimadas || 2
    };

    tareasCompletadasState = tareasCompletadasState.filter(t => t.id !== id);
    tareasState = [tareaRestaurada, ...tareasState];
    persistirEstado();
    renderApp();
};

window.iniciarSesionEnfoque = iniciarSesionEnfoque;
window.abrirModalCompletar = abrirModalCompletar;
window.cerrarModalCompletar = cerrarModalCompletar;
window.confirmarCompletarTarea = confirmarCompletarTarea;
window.abrirModalHorasRealizadas = abrirModalHorasRealizadas;
window.cerrarModalHorasRealizadas = cerrarModalHorasRealizadas;

// 13. INICIALIZACIÓN DE EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const materiaSelect = document.getElementById('materia-select');
    const customMateriaInput = document.getElementById('custom-materia');
    const filterMateriaSelect = document.getElementById('filter-materia');

    // Alternar entre modo claro (post-its) y modo oscuro (original)
    const aplicarTema = (tema) => {
        document.documentElement.setAttribute('data-theme', tema);
        try {
            localStorage.setItem('pf_theme', tema);
        } catch (e) {
            console.warn('No se pudo guardar el tema', e);
        }
        const icon = document.getElementById('theme-toggle-icon');
        const label = document.getElementById('theme-toggle-label');
        if (icon) icon.textContent = tema === 'light' ? '🌙' : '☀️';
        if (label) label.textContent = tema === 'light' ? 'Modo Oscuro' : 'Modo Claro';
    };

    // Sincronizar el ícono/etiqueta con el tema que ya aplicó el script del <head>
    aplicarTema(document.documentElement.getAttribute('data-theme') || 'light');

    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    if (btnThemeToggle) {
        btnThemeToggle.addEventListener('click', () => {
            const actual = document.documentElement.getAttribute('data-theme') || 'light';
            aplicarTema(actual === 'light' ? 'dark' : 'light');
        });
    }

    // Botón principal de la página para abrir el Apartado de Horas Realizadas
    const btnOpenHorasModal = document.getElementById('btn-open-horas-modal');
    if (btnOpenHorasModal) {
        btnOpenHorasModal.addEventListener('click', abrirModalHorasRealizadas);
    }

    const btnQuickHorasLink = document.getElementById('btn-quick-horas-link');
    if (btnQuickHorasLink) {
        btnQuickHorasLink.addEventListener('click', abrirModalHorasRealizadas);
    }

    // Botones para cerrar el Modal de Horas Realizadas
    const btnCloseHorasModal = document.getElementById('btn-close-horas-modal');
    if (btnCloseHorasModal) {
        btnCloseHorasModal.addEventListener('click', cerrarModalHorasRealizadas);
    }

    const btnCloseHorasFooter = document.getElementById('btn-close-horas-footer');
    if (btnCloseHorasFooter) {
        btnCloseHorasFooter.addEventListener('click', cerrarModalHorasRealizadas);
    }

    // Tabs internas del Modal de Horas Realizadas (historial / análisis / racha)
    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.modaltab;
            document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const vistas = {
                historial: document.getElementById('modal-view-historial'),
                analisis: document.getElementById('modal-view-analisis'),
                racha: document.getElementById('modal-view-racha')
            };

            Object.keys(vistas).forEach(key => {
                const el = vistas[key];
                if (!el) return;
                if (key === targetTab) {
                    el.classList.remove('hidden');
                    el.classList.add('active');
                } else {
                    el.classList.add('hidden');
                    el.classList.remove('active');
                }
            });
        });
    });

    // Botón de repaso de Recordatorios en modo flashcards (Idea 2)
    const btnOpenFlashcards = document.getElementById('btn-open-flashcards');
    if (btnOpenFlashcards) btnOpenFlashcards.addEventListener('click', abrirModalFlashcards);

    const btnCloseFlashcards = document.getElementById('btn-close-flashcards');
    if (btnCloseFlashcards) btnCloseFlashcards.addEventListener('click', cerrarModalFlashcards);

    const btnCloseFlashcardsFooter = document.getElementById('btn-close-flashcards-footer');
    if (btnCloseFlashcardsFooter) btnCloseFlashcardsFooter.addEventListener('click', cerrarModalFlashcards);

    const btnFlipFlashcard = document.getElementById('btn-flip-flashcard');
    if (btnFlipFlashcard) {
        btnFlipFlashcard.addEventListener('click', () => {
            document.getElementById('flashcard-inner').classList.toggle('flipped');
        });
    }

    const btnPrevFlashcard = document.getElementById('btn-prev-flashcard');
    if (btnPrevFlashcard) btnPrevFlashcard.addEventListener('click', () => moverFlashcard(-1));

    const btnNextFlashcard = document.getElementById('btn-next-flashcard');
    if (btnNextFlashcard) btnNextFlashcard.addEventListener('click', () => moverFlashcard(1));

    // Botones del Focus Banner
    document.getElementById('btn-finish-focus').addEventListener('click', () => {
        if (focusSession.tarea) {
            abrirModalCompletar(focusSession.tarea.id, focusSession.segundosEnfoqueAcumulados);
        }
    });

    document.getElementById('btn-pause-focus').addEventListener('click', pausarReanudarEnfoque);
    document.getElementById('btn-cancel-focus').addEventListener('click', cancelarEnfoque);

    // Botones del Modal de Completar Tarea / Horas
    document.getElementById('modal-btn-confirm').addEventListener('click', confirmarCompletarTarea);
    document.getElementById('modal-btn-cancel').addEventListener('click', () => {
        document.getElementById('complete-modal').classList.add('hidden');
        tareaPendienteDeCompletar = null;
    });

    // Escucha cambios en los inputs del modal para recalcular feedback en vivo
    document.getElementById('modal-time-hours').addEventListener('input', actualizarFeedbackModal);
    document.getElementById('modal-time-minutes').addEventListener('input', actualizarFeedbackModal);
    // Si escribes tu propio mensaje, el recuadro de abajo lo muestra al instante
    document.getElementById('modal-custom-quote').addEventListener('input', actualizarFeedbackModal);

    // Botones de la máquina de estados Pomodoro (config -> enfoque -> descanso -> decisión)
    document.getElementById('btn-start-pomodoro').addEventListener('click', () => {
        solicitarPermisoNotificaciones();
        iniciarFaseEnfoque();
    });
    document.getElementById('btn-otra-ronda').addEventListener('click', reiniciarRondaEnfoque);
    document.getElementById('btn-finish-after-break').addEventListener('click', () => {
        if (focusSession.tarea) {
            abrirModalCompletar(focusSession.tarea.id, focusSession.segundosEnfoqueAcumulados);
        }
    });

    // Limpiar historial
    const btnClearHistory = document.getElementById('btn-clear-history');
    if (btnClearHistory) {
        btnClearHistory.addEventListener('click', () => {
            if (confirm('¿Deseas limpiar el historial de tareas completadas?')) {
                tareasCompletadasState = [];
                persistirEstado();
                renderApp();
            }
        });
    }

    // Mostrar/ocultar input para materia personalizada + Predicción de tiempo (Idea 1)
    const actualizarPrediccionDesdeFormulario = () => {
        let materia = materiaSelect.value;
        if (materia === 'custom') materia = customMateriaInput.value.trim();
        const dificultadInput = document.querySelector('input[name="dificultad"]:checked');
        const dificultad = dificultadInput ? dificultadInput.value : null;
        mostrarPrediccionTiempo(materia, dificultad);
    };

    materiaSelect.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            customMateriaInput.classList.remove('hidden');
            customMateriaInput.required = true;
            customMateriaInput.focus();
        } else {
            customMateriaInput.classList.add('hidden');
            customMateriaInput.required = false;
        }
        actualizarPrediccionDesdeFormulario();
    });

    customMateriaInput.addEventListener('input', actualizarPrediccionDesdeFormulario);
    document.querySelectorAll('input[name="dificultad"]').forEach(radio => {
        radio.addEventListener('change', actualizarPrediccionDesdeFormulario);
    });

    // Evento de filtro por materia
    filterMateriaSelect.addEventListener('change', () => {
        renderApp();
    });

    // Agregar nueva tarea (Con mensaje motivacional puesto por Melvin)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('task-name').value.trim();
        let materia = materiaSelect.value;
        if (materia === 'custom') {
            materia = customMateriaInput.value.trim();
        }

        const diasRestantes = parseInt(document.getElementById('dias-restantes').value, 10);
        const horasEstimadas = parseInt(document.getElementById('horas-estimadas').value, 10);
        const dificultad = document.querySelector('input[name="dificultad"]:checked').value;
        
        // Mensaje motivacional personalizado que Melvin escribió
        const quoteEl = document.getElementById('task-quote');
        const mensajeMotivacional = quoteEl ? quoteEl.value.trim() : '';

        if (!nombre || !materia || isNaN(diasRestantes) || isNaN(horasEstimadas)) {
            alert('Por favor completa todos los campos correctamente.');
            return;
        }

        const nuevaTarea = {
            id: Date.now().toString(),
            nombre,
            materia,
            diasRestantes,
            dificultad,
            horasEstimadas,
            mensajeMotivacional
        };

        // Agregar al estado inmutablemente
        tareasState = [nuevaTarea, ...tareasState];
        persistirEstado();

        // Reset del formulario
        form.reset();
        customMateriaInput.classList.add('hidden');
        customMateriaInput.required = false;
        document.getElementById('prediction-box').classList.add('hidden');

        // Renderizar cambios
        renderApp();

        // Notificación nativa si corre en Electron
        if (window.electronAPI && typeof window.electronAPI.notify === 'function') {
            window.electronAPI.notify('Tarea Registrada ⚡', `Se agregó: "${nombre}" para ${materia}`);
        }
    });

    // Indicar si se está ejecutando dentro de Electron
    if (window.electronAPI && window.electronAPI.isElectron) {
        document.body.classList.add('is-electron');
        const tag = document.querySelector('.header-tag span:last-child');
        if (tag) {
            tag.textContent = 'Desktop App (Electron)';
        }
    }

    // Inicializar renderizado
    renderApp();
});

