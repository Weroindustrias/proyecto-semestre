// ============================================================================
// DOMINIO 2: MÉTRICAS Y ESTADÍSTICAS
// 6.9 COMPARACIÓN DE EFICIENCIA ENTRE MATERIAS (para la gráfica SVG)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

/**
 * Función Pura: Agrupa por materia y calcula la eficiencia comparativa
 * @param {Array} completadas 
 * @returns {Array} Lista ordenada por mayor eficiencia
 */
export const calcularComparacionMaterias = (completadas = []) => {
    const materias = Array.from(new Set(completadas.map(t => t.materia)));
    return materias.map(materia => {
        const tareasMateria = completadas.filter(t => t.materia === materia);
        const minEstimados = tareasMateria.reduce((acc, t) => acc + (t.minutosEstimados || 0), 0);
        const minReales = tareasMateria.reduce((acc, t) => acc + (t.minutosReales || 0), 0);
        const eficiencia = minEstimados > 0 ? Math.round(((minEstimados - minReales) / minEstimados) * 100) : 0;
        return { materia, eficiencia, totalTareas: tareasMateria.length };
    }).sort((a, b) => b.eficiencia - a.eficiencia);
};

/**
 * Genera el SVG de barras divergentes puro sin librerías externas
 * @param {Array} comparacion 
 * @returns {string} Código SVG incrustable
 */
export const generarGraficaMateriasHTML = (comparacion = []) => {
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

