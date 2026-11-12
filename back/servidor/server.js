const http = require('http');
const fs = require('fs');
const path = require('path');
const motor = require('./motor');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, '..');
const DATA_FILE = path.join(__dirname, 'tareas_db.json');

// Inicializar almacén persistente si no existe
if (!fs.existsSync(DATA_FILE)) {
    const initialState = {
        pendientes: [
            {
                id: '1',
                nombre: 'Examen Final de POO',
                materia: 'Programación Orientada a Objetos',
                diasRestantes: 1,
                dificultad: 'Alta',
                horasEstimadas: 4,
                mensajeMotivacional: '¡Repasar herencia y polimorfismo con enfoque total!'
            },
            {
                id: '2',
                nombre: 'Proyecto Engine Generativo',
                materia: 'Programación Funcional',
                diasRestantes: 3,
                dificultad: 'Media',
                horasEstimadas: 6,
                mensajeMotivacional: '¡Una sola función pura a la vez sin efectos secundarios!'
            },
            {
                id: '3',
                nombre: 'Investigación de Electrostática',
                materia: 'Física',
                diasRestantes: 5,
                dificultad: 'Baja',
                horasEstimadas: 2,
                mensajeMotivacional: '¡Resolver los ejercicios de campos eléctricos paso a paso!'
            }
        ],
        completadas: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialState, null, 2), 'utf-8');
}

const leerDatos = () => {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { pendientes: [], completadas: [] };
    }
};

const guardarDatos = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const responderJSON = (res, statusCode, body) => {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(body));
};

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Manejo de CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return res.end();
    }

    // ========================================================================
    // RUTAS DE LA API REST (BACKEND NODE.JS)
    // ========================================================================
    if (pathname.startsWith('/api/')) {
        // GET /api/tareas -> Obtener tareas evaluadas con el motor funcional
        if (pathname === '/api/tareas' && req.method === 'GET') {
            const db = leerDatos();
            const evaluadas = motor.procesarYPriorizar(db.pendientes);
            return responderJSON(res, 200, {
                pendientes: evaluadas,
                completadas: db.completadas,
                metricas: {
                    horasTotales: motor.calcularHorasTotales(db.pendientes),
                    tareasAlta: motor.contarTareasAltaDificultad(db.pendientes),
                    materias: motor.obtenerMateriasUnicas(db.pendientes, db.completadas)
                }
            });
        }

        // GET /api/analisis -> Métricas de enfoque y rachas
        if (pathname === '/api/analisis' && req.method === 'GET') {
            const db = leerDatos();
            const analisis = motor.analizarEnfoqueFuncional(db.completadas);
            const racha = motor.calcularRacha(db.completadas);
            return responderJSON(res, 200, { analisis, racha });
        }

        // POST /api/tareas -> Agregar una nueva tarea
        if (pathname === '/api/tareas' && req.method === 'POST') {
            let buffer = '';
            req.on('data', chunk => { buffer += chunk; });
            req.on('end', () => {
                try {
                    const nueva = JSON.parse(buffer);
                    const db = leerDatos();
                    const tarea = {
                        id: Date.now().toString(),
                        nombre: nueva.nombre,
                        materia: nueva.materia,
                        diasRestantes: Number(nueva.diasRestantes) || 1,
                        dificultad: nueva.dificultad || 'Media',
                        horasEstimadas: Number(nueva.horasEstimadas) || 2,
                        mensajeMotivacional: nueva.mensajeMotivacional || ''
                    };
                    db.pendientes = [tarea, ...db.pendientes];
                    guardarDatos(db);
                    return responderJSON(res, 201, { success: true, tarea });
                } catch (e) {
                    return responderJSON(res, 400, { error: 'Payload JSON inválido' });
                }
            });
            return;
        }

        // PUT /api/tareas/sincronizar -> Persistir el estado completo desde el front
        if (pathname === '/api/tareas/sincronizar' && req.method === 'PUT') {
            let buffer = '';
            req.on('data', chunk => { buffer += chunk; });
            req.on('end', () => {
                try {
                    const payload = JSON.parse(buffer);
                    const db = {
                        pendientes: Array.isArray(payload.pendientes) ? payload.pendientes : [],
                        completadas: Array.isArray(payload.completadas) ? payload.completadas : []
                    };
                    guardarDatos(db);
                    return responderJSON(res, 200, { success: true, count: db.pendientes.length });
                } catch {
                    return responderJSON(res, 400, { error: 'Error al sincronizar' });
                }
            });
            return;
        }

        return responderJSON(res, 404, { error: 'Endpoint no encontrado' });
    }

    // ========================================================================
    // SERVIDOR DE ARCHIVOS ESTÁTICOS (WEB APP)
    // ========================================================================
    let filePath = pathname === '/' ? path.join(ROOT_DIR, 'fron', 'index.html') : path.join(ROOT_DIR, pathname);

    // Si la ruta no tiene extensión y no existe, buscar en fron/
    if (!fs.existsSync(filePath)) {
        filePath = path.join(ROOT_DIR, 'fron', pathname);
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    } else {
        // Redirección por defecto a fron/index.html
        const fallback = path.join(ROOT_DIR, 'fron', 'index.html');
        if (fs.existsSync(fallback)) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(fallback).pipe(res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }
});

server.listen(PORT, () => {
    console.log(`⚡ Servidor Backend Node.js activo en: http://localhost:${PORT}`);
    console.log(`📁 API REST disponible en: http://localhost:${PORT}/api/tareas`);
});

module.exports = server;
