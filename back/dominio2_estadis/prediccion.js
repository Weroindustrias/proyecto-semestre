// ============================================================================
// DOMINIO 2: MÉTRICAS Y ESTADÍSTICAS
// 6.5 PREDICCIÓN DE TIEMPO BASADA EN HISTORIAL (Idea 1)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

/**
 * Función Pura con filter y reduce: Estima el tiempo necesario según tareas previas
 * @param {string} materia 
 * @param {string} dificultad 
 * @param {Array} completadas 
 * @returns {object|null}
 */
export const calcularPrediccionTiempo = (materia, dificultad, completadas = []) => {
    if (!materia || !completadas || completadas.length === 0) return null;
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

/**
 * Muestra la sugerencia en la interfaz del formulario
 * @param {string} materia 
 * @param {string} dificultad 
 * @param {Array} completadas 
 */
export const mostrarPrediccionTiempo = (materia, dificultad, completadas = []) => {
    const box = document.getElementById('prediction-box');
    const textEl = document.getElementById('prediction-text');
    if (!box || !textEl) return;

    const prediccion = calcularPrediccionTiempo(materia, dificultad, completadas);
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

