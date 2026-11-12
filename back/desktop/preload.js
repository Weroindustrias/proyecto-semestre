const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    isElectron: true,
    platform: process.platform,
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    notify: (title, body) => ipcRenderer.invoke('app:notify', { title, body }),
    motor: {
        procesarTareas: (tareas) => ipcRenderer.invoke('motor:procesar-tareas', tareas),
        analizarEnfoque: (completadas) => ipcRenderer.invoke('motor:analizar-enfoque', completadas),
        calcularPrediccion: (materia, dificultad, completadas) =>
            ipcRenderer.invoke('motor:calcular-prediccion', { materia, dificultad, completadas }),
        calcularRacha: (completadas) => ipcRenderer.invoke('motor:calcular-racha', completadas)
    }
});
