// ============================================================================
// DOMINIO 2: MÉTRICAS Y ESTADÍSTICAS
// 6.6 RACHA DE ENFOQUE Y MAPA DE CALOR (Ideas 3 y 4)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

/**
 * Función Pura: Calcula la racha actual y mejor racha histórica
 * @param {Array} completadas 
 * @returns {{ rachaActual: number, mejorRacha: number }}
 */
export const calcularRacha = (completadas = []) => {
    const fechasUnicas = Array.from(new Set(completadas.map(t => t.fechaISO).filter(Boolean)));
    if (fechasUnicas.length === 0) return { rachaActual: 0, mejorRacha: 0 };

    const fechasSet = new Set(fechasUnicas);
    const formatoISO = (d) => d.toISOString().split('T')[0];

    // Racha actual: cuenta hacia atrás desde hoy (o ayer)
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

    // Mejor racha histórica
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

/**
 * Genera el mapa de calor (Heatmap) en HTML declarativo
 * @param {Array} completadas 
 * @param {number} semanas 
 * @returns {string} HTML del mapa de calor
 */
export const generarMapaCalorHTML = (completadas = [], semanas = 18) => {
    const conteoPorFecha = {};
    completadas.forEach(t => {
        if (!t.fechaISO) return;
        conteoPorFecha[t.fechaISO] = (conteoPorFecha[t.fechaISO] || 0) + 1;
    });

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const finGrid = new Date(hoy);
    finGrid.setDate(hoy.getDate() + (6 - hoy.getDay())); // termina en sábado

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

