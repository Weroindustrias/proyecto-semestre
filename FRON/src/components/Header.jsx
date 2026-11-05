import React from 'react';

export const Header = ({ 
    tema, 
    onToggleTema, 
    totalCompletadas, 
    onOpenHorasModal, 
    onOpenFlashcards,
    isElectron 
}) => {
    return (
        <header className="main-header">
            <div className="logo-area">
                <div className="logo-badge">⚡ PF</div>
                <div>
                    <h1>Organizador Inteligente de Tareas</h1>
                    <p className="subtitle">Programacion Funcional en Rust & JS | ICI - FIME UdeC</p>
                </div>
            </div>

            <div className="header-right-group">
                <button 
                    type="button" 
                    className="btn-theme-toggle" 
                    onClick={onToggleTema} 
                    title="Cambiar entre modo claro y modo oscuro"
                >
                    <span>{tema === 'light' ? '🌙' : '☀️'}</span>
                    <span>{tema === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</span>
                </button>

                <div className="header-tag">
                    <span className="pulse-dot"></span>
                    <span>{isElectron ? 'Desktop App (Electron)' : 'Paradigma Declarativo'}</span>
                </div>

                <button 
                    type="button" 
                    className="btn-ver-horas" 
                    onClick={onOpenHorasModal} 
                    title="Abrir apartado de horas que dio en realizar y análisis"
                >
                    <span className="btn-icon">⏱️</span>
                    <span>Ver Horas Realizadas & Análisis</span>
                    <span className="badge-horas-count">{totalCompletadas}</span>
                </button>

                <button 
                    type="button" 
                    className="btn-ver-horas btn-flashcards" 
                    onClick={onOpenFlashcards} 
                    title="Repasar tus recordatorios de temas/conceptos"
                >
                    <span className="btn-icon">📚</span>
                    <span>Repasar Recordatorios</span>
                </button>
            </div>
        </header>
    );
};

