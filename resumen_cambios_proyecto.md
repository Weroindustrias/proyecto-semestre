# 📝 Resumen de Cambios Aplicados en la Carpeta `Proyecto 1`

**Alumno:** Melvin Jaeen García Camacho  
**Materia:** Programación Funcional  
**Proyecto:** Organizador Inteligente de Tareas (Rust Engine)  
**Última Actualización (Timestamp):** `2026-09-30T13:10:44-06:00`  

---

## 🛠️ 1. Correcciones y Mejoras en el Código Rust (`proyecto 1/.rs`)

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
  * Se construyó el script [`proyecto 1/organizador_tareas.py`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%201/organizador_tareas.py) que réplica la exactitud del motor de Rust utilizando `dataclasses(frozen=True)`, `match/case`, `map`, `filter`, `reduce` y Type Hints.
  * **Verificación de Ejecución:** Probado y ejecutado exitosamente con **100% de aserciones aprobadas (`SUCCESS: All unit tests with assert passed successfully!`)**.

---

## 📄 2. Actualización de Timestamps en Documentación

* **Archivo [`proyecto.md`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%201/proyecto.md):**  
  Se actualizó el encabezado de fecha al timestamp unificado:  
  `**Última Actualización (Timestamp):** 2026-09-17T11:05:26-06:00`

---

## 🎯 3. Estado Final de la Carpeta `proyecto 1`

| Archivo | Estado | Descripción |
|---|---|---|
| [`proyecto 1/.rs`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%201/.rs) | 🟢 100% Funcional | Código fuente completo en Rust con PF, Iteradores, Pattern Matching y Pruebas Unitarias. |
| [`proyecto 1/proyecto parcial.md`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%201/proyecto%20parcial.md) | 🟢 Completado | Propuesta técnica detallada del Organizador de Tareas. |
| [`proyecto 1/proyecto.md`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%201/proyecto.md) | 🟢 Actualizado | Documento de propuesta general con timestamp sincrónico. |
| [`proyecto 1/resumen_cambios_proyecto.md`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%201/resumen_cambios_proyecto.md) | 🟢 Creado | Registro formal de cambios aplicados a la carpeta. |

---

## 🍅 4. Sesión 28-Sep-2026: Implementación Completa de Pomodoro & Mejoras UI

### 📂 Archivos Modificados

| Archivo | Tipo de Cambio |
|---|---|
| `proyecto semestre/app.js` | ✅ Lógica Pomodoro, alarma, máquina de estados, prioridad de mensajes |
| `proyecto semestre/style.css` | ✅ Refactorización de formato (sin cambios visuales) |
| `proyecto semestre/index.html` | ✅ Nuevos botones Pomodoro en el Focus Banner |
| `proyecto semestre/explicacion_codigo.md` | ✅ Sección 6 añadida con documentación pedagógica |
| `proyecto semestre/resumen_cambios_proyecto.md` | ✅ Esta sección |

---

### 🔧 4.1 Cambios en `app.js`

#### A. Estado `focusSession` Rediseñado

El objeto que guarda la sesión de enfoque cambió de un cronómetro simple a una **máquina de estados**:

```javascript
// ANTES
focusSession = { activa, tarea, segundos, intervalId, enPausa }

// DESPUÉS
focusSession = {
    activa, tarea,
    fase: 'config',         // ← NUEVA: 'config'|'enfoque'|'descanso'
    segundosEnfoqueAcumulados: 0, // ← NUEVO: solo tiempo real de trabajo
    segundosRestantes: 0,         // ← NUEVO: cuenta regresiva actual
    duracionEnfoqueMin: 25,       // ← NUEVO: minutos de trabajo
    duracionDescansoMin: 10,      // ← NUEVO: minutos de descanso
    intervalId, enPausa
}
```

#### B. Nuevas Funciones Añadidas

| Función | Responsabilidad |
|---|---|
| `reproducirAlarma()` | Beep doble con Web Audio API (880 Hz + 1046 Hz), sin archivos externos |
| `iniciarFaseEnfoque()` | Lee inputs del usuario y arranca la cuenta regresiva de trabajo |
| `tickearPomodoro()` | Motor del intervalo: descuenta 1s/tick, cambia de fase al llegar a 0 |
| `iniciarFaseDescanso()` | Activa el countdown de descanso y cambia el color del banner a azul-verde |
| `finalizarDescanso()` | Detiene el intervalo y muestra el panel de decisión |
| `reiniciarRondaEnfoque()` | Inicia otra ronda usando los minutos ya configurados |

#### C. Corrección: `abrirModalCompletar` recibe `segundosEnfoqueAcumulados`

Antes se le pasaba `focusSession.segundos` (que incluía tiempo de descanso). Ahora se pasa `focusSession.segundosEnfoqueAcumulados` para que el análisis de eficiencia solo cuente el tiempo real trabajado.

#### D. Prioridad del Mensaje Personal en `actualizarFeedbackModal`

Si el usuario escribió su propio recordatorio, ese texto **sobreescribe** el consejo automático del maestro en el recuadro inferior del modal de completar.

#### E. Listener: input del recordatorio actualiza el feedback en vivo

Se agregó:
```javascript
document.getElementById('modal-custom-quote').addEventListener('input', actualizarFeedbackModal);
```
Esto hace que el recuadro de abajo se actualice **mientras escribes**, sin necesidad de pulsar ningún botón.

#### F. Tres nuevos listeners de botones Pomodoro

```javascript
document.getElementById('btn-start-pomodoro').addEventListener('click', iniciarFaseEnfoque);
document.getElementById('btn-otra-ronda').addEventListener('click', reiniciarRondaEnfoque);
document.getElementById('btn-finish-after-break').addEventListener('click', () => {
    abrirModalCompletar(focusSession.tarea.id, focusSession.segundosEnfoqueAcumulados);
});
```

---

### 🎨 4.2 Cambios en `style.css` (Solo Formato)

Se aplicó una refactorización de estilo en las siguientes reglas. **No se cambió ningún valor visual**:

* `@keyframes pulse` → cada propiedad en su propia línea
* `input:focus, select:focus` → selector separado en dos líneas
* `.diff-X input:checked + span` → eliminado espacio antes de `+`
* `@keyframes slideDown`, `flamePulse`, `fadeIn`, `scaleUp`, `bounce` → mismo formato multilínea
* `.task-item.alta/media/baja` → cada regla en bloque separado
* `.kpi-value.color-pos/neg` → bloques separados
* `background-image:` en `body` → indentación limpia
* Al final del archivo se eliminaron líneas en blanco redundantes

---

### 🏷️ 4.3 Renombrado de Etiquetas (UX)

| Antes | Después | Razón |
|---|---|---|
| `💬 Mi Mensaje Motivacional` | `📌 Recordatorio` | Más útil para guardar temas o conceptos |
| `💬 Mi Mensaje:` (tarjeta) | `📌 Recordatorio:` (tarjeta) | Consistencia visual |
| `bubble-avatar: 💬` (historial) | `bubble-avatar: 📌` (historial) | Consistencia visual |

---

### 🎯 4.4 Estado Final de Archivos del Proyecto Semestre

| Archivo | Estado | Descripción |
|---|---|---|
| `app.js` | 🟢 Actualizado | Motor Pomodoro completo, alarma, máquina de estados |
| `style.css` | 🟢 Actualizado | Formato moderno, sin cambios visuales |
| `index.html` | 🟢 Actualizado | Botones Pomodoro: iniciar, otra ronda, terminar después del descanso |
| `explicacion_codigo.md` | 🟢 Actualizado | Sección 6 con explicación pedagógica de todos los cambios |
| `resumen_cambios_proyecto.md` | 🟢 Actualizado | Esta sección (4) |

---

## 🧪 5. Sesión 30-Sep-2026: Cobertura de Pruebas Unitarias

### 📂 Archivos Modificados / Creados

| Archivo | Tipo de Cambio |
|---|---|
| `proyecto semestre/test_organizador.py` | ✅ Creado | Suite completa de pruebas unitarias en Python. |
| `proyecto semestre/.rs` | ✅ Actualizado | Módulo de pruebas completo añadido al final del archivo. |
| `proyecto semestre/explicacion_codigo.md` | ✅ Actualizado | Sección 7 añadida con documentación sobre pruebas. |
| `proyecto semestre/resumen_cambios_proyecto.md` | ✅ Actualizado | Esta sección (5) |

### 🔧 5.1 Pruebas en Python (`unittest`)

Se crearon **25 pruebas unitarias** utilizando la librería estándar `unittest`, cubriendo las 6 funciones puras principales.

- **`obtener_peso_dificultad`**: 5 tests comprobando la asignación de pesos (`Alta=3.0`, `Media=2.0`, `Baja=1.0`).
- **`calcular_prioridad`**: 5 tests comprobando la matemática de la fórmula (comprobando urgencias, holguras, y el valor por defecto).
- **`generar_razon`**: 4 tests para probar que los mensajes corresponden a los umbrales de score y días restantes.
- **`procesar_y_priorizar`**: 4 tests comprobando que la salida está correctamente ordenada (mayor score primero).
- **`calcular_tiempo_total_estimado`**: 3 tests verificando el comportamiento de `reduce` (suma acumulada).
- **`filtrar_por_dificultad`**: 4 tests validando el comportamiento de `filter` al filtrar listas según Dificultad.

### 🦀 5.2 Pruebas en Rust (`#[cfg(test)]`)

Se añadió un módulo de pruebas exhaustivo (`mod tests`) con `use super::*;`.

- Se crearon **12 pruebas unitarias** divididas en 4 grupos.
- Comprobación del pattern matching (`obtener_peso_dificultad`).
- Tests de cálculo matemático comprobando divisiones con decimales (`calcular_prioridad`).
- Tests para generación de string condicionales (`generar_razon`).
- Tests de integración del pipeline completo de Iteradores (`procesar_y_priorizar`), con validación de mutabilidad y de `.unwrap_or()`.
