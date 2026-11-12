// ============================================================================
// DOMINIO 4: INTERFAZ Y MODALES
// MODAL DE HORAS REALIZADAS Y ANÁLISIS
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

export const abrirModalHorasRealizadas = () => {
    const modal = document.getElementById('modal-horas-realizadas');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
};

export const cerrarModalHorasRealizadas = () => {
    const modal = document.getElementById('modal-horas-realizadas');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
};

