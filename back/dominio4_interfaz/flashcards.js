// ============================================================================
// DOMINIO 4: INTERFAZ Y MODALES
// 7.5 REPASO DE RECORDATORIOS EN MODO FLASHCARDS (Idea 2)
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

let flashcardIndex = 0;
let flashcardsData = [];

export const recolectarFlashcards = (tareas = [], completadas = []) => {
    const desdeTareas = (lista) => lista
        .filter(t => t.mensajeMotivacional && t.mensajeMotivacional.trim())
        .map(t => ({ materia: t.materia, nombre: t.nombre, recordatorio: t.mensajeMotivacional.trim() }));

    return [...desdeTareas(tareas), ...desdeTareas(completadas)];
};

export const renderFlashcardActual = () => {
    if (!flashcardsData.length) return;
    const actual = flashcardsData[flashcardIndex];
    const frontEl = document.getElementById('flashcard-front-text');
    const backEl = document.getElementById('flashcard-back-text');
    const contEl = document.getElementById('flashcard-contador');
    const innerEl = document.getElementById('flashcard-inner');

    if (frontEl) frontEl.textContent = `${actual.materia} — ${actual.nombre}`;
    if (backEl) backEl.textContent = actual.recordatorio;
    if (contEl) contEl.textContent = `${flashcardIndex + 1} / ${flashcardsData.length}`;
    if (innerEl) innerEl.classList.remove('flipped');
};

export const moverFlashcard = (direccion) => {
    if (!flashcardsData.length) return;
    flashcardIndex = (flashcardIndex + direccion + flashcardsData.length) % flashcardsData.length;
    renderFlashcardActual();
};

export const abrirModalFlashcards = (tareas = [], completadas = []) => {
    flashcardsData = recolectarFlashcards(tareas, completadas);
    flashcardIndex = 0;

    const emptyState = document.getElementById('flashcard-empty');
    const content = document.getElementById('flashcard-content');

    if (flashcardsData.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        if (content) content.classList.add('hidden');
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        if (content) content.classList.remove('hidden');
        renderFlashcardActual();
    }

    const modal = document.getElementById('modal-flashcards');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
};

export const cerrarModalFlashcards = () => {
    const modal = document.getElementById('modal-flashcards');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
};

