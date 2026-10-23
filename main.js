const { app, BrowserWindow, ipcMain, shell, Notification } = require('electron');
const path = require('path');

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 860,
        minWidth: 980,
        minHeight: 700,
        title: 'Organizador Inteligente de Tareas | Programación Funcional',
        backgroundColor: '#0f172a',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            spellcheck: true
        },
        show: false
    });

    const indexPath = path.join(__dirname, 'fron', 'index.html');
    mainWindow.loadFile(indexPath);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http:') || url.startsWith('https:')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Integrar el motor funcional de Node directamente en el proceso principal
const motor = require('./back/motor');

// IPC Handlers para funciones del sistema nativo
ipcMain.handle('app:get-version', () => app.getVersion());

ipcMain.handle('app:notify', (_event, { title, body }) => {
    if (Notification.isSupported()) {
        new Notification({
            title: title || 'Organizador de Tareas',
            body: body || ''
        }).show();
        return true;
    }
    return false;
});

// IPC Handlers para invocar el Motor Funcional en Node
ipcMain.handle('motor:procesar-tareas', (_event, tareas) => {
    return motor.procesarYPriorizar(tareas);
});

ipcMain.handle('motor:analizar-enfoque', (_event, completadas) => {
    return motor.analizarEnfoqueFuncional(completadas);
});

ipcMain.handle('motor:calcular-prediccion', (_event, { materia, dificultad, completadas }) => {
    return motor.calcularPrediccionTiempo(materia, dificultad, completadas);
});

ipcMain.handle('motor:calcular-racha', (_event, completadas) => {
    return motor.calcularRacha(completadas);
});
