import React, { useState, useMemo } from 'react';
import { recolectarFlashcards } from '../../../back/dominio4_interfaz/flashcards.js';

export const ModalFlashcards = ({ 
    isOpen, 
    tareas = [], 
    completadas = [], 
    onCerrar 
}) => {
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const cards = useMemo(() => {
        return recolectarFlashcards(tareas, completadas);
    }, [tareas, completadas]);

    if (!isOpen) return null;

    const actual = cards[index];

    const handleFlip = () => {
        setIsFlipped(prev => !prev);
    };

    const handleNext = () => {
        if (!cards.length) return;
        setIsFlipped(false);
        setIndex(prev => (prev + 1) % cards.length);
    };

    const handlePrev = () => {
        if (!cards.length) return;
        setIsFlipped(false);
        setIndex(prev => (prev - 1 + cards.length) % cards.length);
    };

    return (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-card glass-card modal-flashcards-card">
                <div className="modal-header space-between">
                    <div className="modal-title-group">
                        <span className="modal-emoji">📚</span>
                        <div>
                            <h3>Repaso de Recordatorios</h3>
                            <p className="modal-sub">Los temas y conceptos que fuiste guardando en tus tareas</p>
                        </div>
                    </div>
                    <button type="button" className="btn-close-modal" onClick={onCerrar}>✕</button>
                </div>

                <div className="modal-body">
                    {cards.length === 0 ? (
                        <div className="flashcard-empty">
                            <p>Todavía no tienes ningún Recordatorio guardado. Agrega uno al crear o completar una tarea.</p>
                        </div>
                    ) : (
                        <div>
                            <p className="flashcard-counter">{index + 1} / {cards.length}</p>
                            <div className="flashcard-wrapper" onClick={handleFlip}>
                                <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
                                    <div className="flashcard-face flashcard-front">
                                        <span className="flashcard-hint">Tarea</span>
                                        <p>{actual ? `${actual.materia} — ${actual.nombre}` : ''}</p>
                                        <span className="flashcard-tap-hint">👆 Toca para ver el recordatorio</span>
                                    </div>
                                    <div className="flashcard-face flashcard-back">
                                        <span className="flashcard-hint">📌 Recordatorio</span>
                                        <p>{actual ? actual.recordatorio : ''}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flashcard-nav">
                                <button type="button" className="btn-secondary" onClick={handlePrev}>
                                    ⬅️ Anterior
                                </button>
                                <button type="button" className="btn-secondary" onClick={handleNext}>
                                    Siguiente ➡️
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn-primary" onClick={onCerrar}>
                        <span>← Regresar al Organizador</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

