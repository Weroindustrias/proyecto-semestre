// ============================================================================
// DOMINIO 3: POMODORO Y NOTIFICACIONES
// 6.7 NOTIFICACIONES DEL NAVEGADOR & Web Audio Alarma
// Materia: Programación Funcional | FIME UdeC
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

/**
 * Solicita permiso para emitir notificaciones del navegador
 */
export const solicitarPermisoNotificaciones = () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
    }
};

/**
 * Muestra una notificación del navegador para alertar cambios de fase
 * @param {string} titulo 
 * @param {string} cuerpo 
 */
export const mostrarNotificacionNavegador = (titulo, cuerpo) => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    try {
        new Notification(titulo, { body: cuerpo, tag: 'pf-organizador' });
    } catch (e) {
        console.warn('No se pudo mostrar la notificación', e);
    }
};

/**
 * Formatea segundos totales a formato estándar HH:MM:SS
 * @param {number} segundosTotales 
 * @returns {string}
 */
export const formatearTiempo = (segundosTotales) => {
    const hrs = Math.floor(segundosTotales / 3600);
    const mins = Math.floor((segundosTotales % 3600) / 60);
    const secs = segundosTotales % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

/**
 * Alarma sonora (beep dual) generada con Web Audio API sin dependencias de audio externas
 */
export const reproducirAlarma = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
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

