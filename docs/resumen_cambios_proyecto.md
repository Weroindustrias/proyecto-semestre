# 📝 Resumen de Cambios Aplicados en el Proyecto

**Alumno:** Melvin Jaeen García Camacho  
**Materia:** Programación Funcional  
**Proyecto:** Organizador Inteligente de Tareas (Motor Funcional + Pomodoro + Web & Desktop App)  
**Última Actualización (Timestamp):** `2026-10-30T23:15:00-06:00`  

---

## 🛠️ 1. Correcciones y Mejoras en el Código Rust (`.rs`)

### ❌ Errores Identificados en el Código Anterior:
1. **Sintaxis Incompleta en Firma de Función:** `pub fn nueva {` faltaba paréntesis de argumentos y tipo de retorno `-> Self`.
2. **Error de Tipografía (Typo):** `nombre.to._string()` contenía un punto extra `._`.
3. **Bloque de Estructura Mal Alineado:** `Self { Tarea { ... } }` tenía doble anidamiento incorrecto.
4. **Código Incompleto:** Faltaba la implementación de las funciones puras de evaluación, el pipeline de iteradores, el `main()` ejecutable y el módulo de pruebas unitarias.

### ✅ Cambios Aplicados:
* **Firma e Implementación de Constructor Limpio:**
  ```rust
  impl Tarea {
      pub fn nueva(
          nombre: &str,
          materia: &str,
          dias_restantes: u32,
          dificultad: Dificultad,
          horas_estimadas: Option<u32>,
      ) -> Self {
          Tarea {
              nombre: nombre.to_string(),
              materia: materia.to_string(),
              dias_restantes,
              dificultad,
              horas_estimadas,
          }
      }
  }
  ```

* **Inclusión de Funciones Puras:**
  1. `obtener_peso_dificultad(&Dificultad) -> f64`: Pattern matching exhaustivo (`match`) para asignar pesos.
  2. `calcular_prioridad(&Tarea) -> f64`: Cálculo del score matemático de prioridad $\text{Score} = \frac{\text{peso} \times \text{horas}}{\text{días} + 0.1}$.
  3. `generar_razon(&Tarea, f64) -> String`: Generador agéntico de explicaciones cualitativas para el estudiante.

* **Canalización Funcional (Pipeline):**
  ```rust
  pub fn procesar_y_priorizar(tareas: &[Tarea]) -> Vec<(&Tarea, f64, String)> {
      let mut lista_evaluada: Vec<(&Tarea, f64, String)> = tareas
          .iter()
          .map(|t| {
              let score = calcular_prioridad(t);
              let razon = generar_razon(t, score);
              (t, score, razon)
          })
          .collect();

      lista_evaluada.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
      lista_evaluada
  }
  ```

* **Adición de Funciones de Alto Orden (`fold` y `filter`):**
  1. `calcular_tiempo_total_estimado(&[Tarea]) -> u32`: Acumula el tiempo total estimado usando el combinador funcional `.iter().fold(...)`.
  2. `filtrar_por_dificultad(&[Tarea], Dificultad) -> Vec<&Tarea>`: Filtra la colección inmutable según la enum deseada mediante `.iter().filter(...)`.

* **Creación de Ejecutable Equivalente en Python:**
  * Se construyó el script [`Pruebas/organizador_tareas.py`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/Pruebas/organizador_tareas.py) que réplica la exactitud del motor de Rust utilizando `dataclasses(frozen=True)`, `match/case`, `map`, `filter`, `reduce` y Type Hints.
  * **Verificación de Ejecución:** Probado y ejecutado exitosamente con **100% de aserciones aprobadas (`SUCCESS: All unit tests with assert passed successfully!`)**.

---

## 🍅 2. Sesión 28-Sep-2026: Implementación Completa de Pomodoro & Mejoras UI

### 📂 Archivos Modificados

| Archivo | Tipo de Cambio |
|---|---|
| `back/app.js` | ✅ Lógica Pomodoro, alarma Web Audio, máquina de estados, prioridad de mensajes |
| `fron/style.css` | ✅ Refactorización de formato (sin cambios visuales) |
| `fron/index.html` | ✅ Nuevos botones Pomodoro en el Focus Banner |
| `docs/explicacion_codigo.md` | ✅ Sección 6 añadida con documentación pedagógica |

### 🔧 Cambios Clave:
* **Máquina de Estados `focusSession`:** Transición limpia entre fases (`config`, `enfoque`, `descanso`).
* **Web Audio API:** Generador de tonos duales (880 Hz / 1046 Hz) sin dependencias ni archivos `.mp3` externos.
* **Separación de Tiempos:** El tiempo de descanso ya no contamina el cálculo de horas reales trabajadas (`segundosEnfoqueAcumulados`).

---

## 🧪 3. Sesión 30-Sep-2026: Cobertura de Pruebas Unitarias

* **Python (`unittest`):** 38 pruebas unitarias formales divididas en 10 grupos temáticos en [`Pruebas/test_organizador.py`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/Pruebas/test_organizador.py), validando funciones puras, inmutabilidad y cálculo de score.
* **Rust (`#[cfg(test)]`):** 12 pruebas unitarias en [`.rs`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/.rs) verificando pattern matching, pipelines con iteradores y evaluación funcional.

---

## ⚡ 4. Sesión Octubre 2026: Migración a Electron, Servidor Web Node.js y Arquitectura Híbrida

### 📂 Archivos Creados y Modificados

| Archivo | Tipo de Cambio | Descripción |
|---|---|---|
| [`package.json`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/package.json) | ✅ Creado en raíz | Configuración del proyecto, dependencias (`electron`, `electron-builder`) y scripts (`start`, `server`, `web`, `dist:win`). |
| [`main.js`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/main.js) | ✅ Creado en raíz | Proceso principal de Electron. Ventana aislada (1280x860), seguridad con contextIsolation y handlers IPC conectados a Node. |
| [`preload.js`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/preload.js) | ✅ Creado en raíz | Puente seguro (`contextBridge`) que expone `electronAPI` (`isElectron`, `notify`, `motor.*`). |
| [`back/motor.js`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/back/motor.js) | ✅ Creado | Motor funcional migrado a módulo CommonJS en Node.js puro (`map`, `filter`, `reduce`, algoritmos de prioridad y racha). |
| [`back/server.js`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/back/server.js) | ✅ Creado | Servidor HTTP nativo en Node.js con API REST (`/api/tareas`, `/api/analisis`) y servidor estático para Web App. |
| [`back/app.js`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/back/app.js) | ✅ Actualizado | Detección de entorno Electron vs Web, disparo de notificaciones de sistema operativo y tag dinámico. |
| [`fron/index.html`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/fron/index.html) | ✅ Actualizado | Limpieza de referencias, enlace al script del backend y compatibilidad completa con navegador y ventana Electron. |
| [`.gitignore`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/.gitignore) | ✅ Actualizado | Protección contra versionado de `node_modules/`, `dist/` y logs. |
| [`docs/README.md`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/docs/README.md) | ✅ Actualizado | Guía paso a paso para ejecutar como Web App en navegador, Desktop App con Electron o Servidor Node. |

---

## 🚀 5. Listado y Clasificación por Nivel de Prototipo

Para contextualizar el grado de madurez del proyecto según los estándares de ingeniería de software (Nivel de Madurez Tecnológica / TRL y fases de prototipado):

| Componente | Nivel de Prototipo | TRL Estimado | Estado Actual | Justificación Técnica |
|---|---|:---:|:---:|---|
| **Motor Matemático en Rust (`.rs`)** | **Prototipo Funcional / Alfa** | TRL 4 | 🟢 Concluido | Modelo formal de evaluación matemática pura con 12 tests unitarios pasando, iteradores y pattern matching. |
| **Suite de Pruebas en Python (`Pruebas/`)** | **Prototipo de Validación / Beta** | TRL 5 | 🟢 Concluido | 38 aserciones unitarias automatizadas que comprueban reproducibilidad y transparencia referencial del algoritmo. |
| **Frontend Web Interactivo (`fron/`)** | **Prototipo Avanzado (Alta Fidelidad)** | TRL 6 | 🟢 Concluido | UI responsiva con modo claro/oscuro, Pomodoro activo, Web Audio API, persistencia en `localStorage` y modales dinámicos. |
| **Backend & API REST Node.js (`back/`)** | **Prototipo Operativo (Beta)** | TRL 6 | 🟢 Concluido | Servidor HTTP nativo (`server.js`) con endpoints REST funcionales, persistencia JSON y exportación modular de funciones puras (`motor.js`). |
| **Aplicación de Escritorio Electron (`main.js` + `preload.js`)** | **Prototipo Pre-Producción (Release Candidate)** | TRL 7 | 🟢 Concluido | Ejecución de escritorio aislada con IPC seguro, notificaciones nativas de Windows/macOS y empaquetado portable listo (`electron-builder`). |

### 📊 Resumen de Madurez Global del Proyecto:
* **Estado Global:** **Prototipo Funcional de Alta Fidelidad / Pre-Producción (TRL 6 - 7)**.
* **Capacidad:** Ejecutable indistintamente en navegador web estándar, cliente servidor HTTP local o binario nativo de escritorio para Windows.

---

## 📌 6. Propuesta de Commit de Git (Avances del Proyecto)

A continuación se detalla el commit estructurado con formato estándar (*Conventional Commits*) que documenta todos los hitos y avances alcanzados:

```git
commit: feat(core): migración completa a arquitectura híbrida con Electron y backend Node.js

- Integración de Electron 33+:
  * Configuración de main.js con ventana nativa de escritorio y preload.js con contextBridge seguro.
  * Añadida compatibilidad con notificaciones del sistema operativo y detección de runtime.
  * Configurado empaquetador electron-builder para generar ejecutable portable de Windows.

- Migración y Refactorización del Backend a Node.js:
  * Creación de back/motor.js con funciones puras y pipeline funcional en formato CommonJS.
  * Implementación de back/server.js con servidor HTTP nativo y endpoints REST (/api/tareas, /api/analisis).
  * Soporte de persistencia en tareas_db.json manteniendo compatibilidad con localStorage en frontend.

- Frontend y Documentación:
  * Soporte dual operativo (ejecución directa en navegador, vía servidor Node o en ventana Electron).
  * Limpieza y organización de package.json en la raíz del repositorio.
  * Actualización de docs/README.md y docs/resumen_cambios_proyecto.md con niveles de prototipo.
```


---

## 🧩 7. Sesión Noviembre 2026: Modularización por Dominios y Migración de Frontend a React

### 📂 Archivos Creados y Modificados

| Archivo / Carpeta | Tipo de Cambio | Descripción |
|---|---|---|
| `back/dominio1/maestros.js` | ✅ Creado | **Dominio 1:** Base pedagógica inmutable de profesores y función pura `obtenerMaestro`. |
| `back/dominio1/estado.js` | ✅ Creado | **Dominio 1:** Estado inicial de tareas y utilidades puras de persistencia en `localStorage`. |
| `back/dominio1/priorizacion.js` | ✅ Creado | **Dominio 1:** Funciones puras de cálculo de prioridad, peso y pipeline `procesarYPriorizar`. |
| `back/dominio2_estadis/metricas.js` | ✅ Creado | **Dominio 2:** Funciones de alto orden (`reduce`, `filter`, `map`) para conteo y materias. |
| `back/dominio2_estadis/analisisEnfoque.js` | ✅ Creado | **Dominio 2:** Pipeline de análisis diagnóstico y cálculo de eficiencia global. |
| `back/dominio2_estadis/prediccion.js` | ✅ Creado | **Dominio 2:** Predicción inteligente de tiempo basada en historial. |
| `back/dominio2_estadis/rachaMapa.js` | ✅ Creado | **Dominio 2:** Algoritmo de racha consecutiva y generación declarativa del mapa de calor (Heatmap). |
| `back/dominio2_estadis/logros.js` | ✅ Creado | **Dominio 2:** Sistema de gamificación e insignias desbloqueables permanentes. |
| `back/dominio2_estadis/graficasEficiencia.js` | ✅ Creado | **Dominio 2:** Gráfica comparativa de barras divergentes en SVG puro. |
| `back/dominio3_pomodoro/notificaciones.js` | ✅ Creado | **Dominio 3:** Web Audio API (alarma dual 880/1046 Hz), notificaciones y formateo de tiempo. |
| `back/dominio3_pomodoro/focusPomodoro.js` | ✅ Creado | **Dominio 3:** Máquina de estados Pomodoro (`config`, `enfoque`, `descanso`, `decision`). |
| `back/dominio4_interfaz/modalCompletar.js` | ✅ Creado | **Dominio 4:** Modal interactivo para registrar tiempo real vs planeado. |
| `back/dominio4_interfaz/flashcards.js` | ✅ Creado | **Dominio 4:** Sistema interactivo de flashcards para repaso de conceptos. |
| `back/dominio4_interfaz/modalesHoras.js` | ✅ Creado | **Dominio 4:** Controladores de apertura y cierre de modales de análisis. |
| `back/dominio4_interfaz/renderApp.js` | ✅ Creado | **Dominio 4:** Renderizado declarativo y actualización de selectores en interfaz. |
| `back/app.js` | ⚡ Refactorizado | Reducido de 1,669 a ~280 líneas limpias como orquestador central que enlaza los dominios. |
| `fron/index.html` | ⚛️ Migrado | Migrado a punto de montaje React 18 con carga reactiva y fallback offline. |
| `fron/index_vanilla.html` | 🛡️ Creado | Respaldo del frontend vanilla original 100% funcional conectado a los nuevos dominios. |
| `fron/src/App.jsx` | ⚛️ Creado | Componente principal React con gestión de estado global y tema claro/oscuro. |
| `fron/src/components/*` | ⚛️ Creado | Componentes modulares (`Header`, `TaskForm`, `FocusBanner`, `TaskList`, `TaskCard`, modales). |
| `fron/src/hooks/*` | ⚛️ Creado | Custom hooks funcionales (`useTasks`, `usePomodoro`) desacoplados de la vista. |
