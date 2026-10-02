# 📘 Guía Pedagógica y Explicación Detallada del Código del Proyecto

**Alumno:** Melvin Jaeen García Camacho  
**Materia:** Programación Funcional (3er Semestre - ICI, FIME UdeC)  
**Profesor:** Mata López Walter Alexander  
**Última Actualización (Timestamp):** `2026-09-30T13:10:44-06:00`  

---

## 💡 1. ¿Por qué se hizo cada cosa en el programa? (Explicación Paso a Paso)

Hola Melvin. Como tu maestro personal, aquí te explico con lenguaje sencillo y analogías claras el porqué de cada bloque en tu programa:

### 📦 A. La Estructura de Datos Inmutable (`Tarea` y `Dificultad`)
* **¿Por qué un `Enum Dificultad`?**  
  En lugar de usar números sueltos (1, 2, 3) o texto que el usuario podría escribir mal ("altasi", "altaa"), usamos una **Enumeración (`Enum`)**. Esto restringe las opciones estrictamente a `Alta`, `Media` y `Baja`.
* **¿Por qué `Option<u32>` para las horas estimadas?**  
  En Rust no existe el valor `null` o `None` inseguro que causa fallos de sistema. Usamos `Option<T>` porque si el usuario no especifica las horas, la función le asigna automáticamente un valor por defecto (2 horas) usando `.unwrap_or(2)`.

---

### 🧮 B. La Función Pura de Evaluación (`calcular_prioridad`)
* **¿Por qué es una Función Pura?**  
  Porque no modifica variables globales ni altera la memoria. Si le pasas la misma tarea 100 veces, siempre devolverá exactamente la misma puntuación (*Transparencia Referencial*).
* **El porqué de la fórmula matemática:**
  $$\text{Score} = \frac{\text{Peso Dificultad} \times \text{Horas Estimadas}}{\text{Días Restantes} + 0.1}$$
  * Multiplicamos $\text{Peso} \times \text{Horas}$ porque una tarea difícil que requiere mucho tiempo es más pesada.
  * Dividimos entre $\text{Días Restantes}$ porque entre menos días falten (ej. 1 día), la división hace que el resultado sea gigante (**mayor urgencia**).
  * Le sumamos `+ 0.1` en el denominador para evitar el error de dividir entre cero si la tarea vence hoy (`dias_restantes = 0`).

---

### 🔄 C. El Pipeline de Iteradores (`.iter().map().collect()`)
* **¿Por qué no usamos un bucle `for` tradicional con un contador `i`?**  
  En Programación Funcional no se usan bucles imperativos con contadores mutables. Usamos una **canalización (Pipeline)**:
  1. `.iter()` ➔ Toma la colección inmutable elemento por elemento.
  2. `.map()` ➔ Transforma cada tarea calculándole su score y su razón.
  3. `.collect()` ➔ Empaqueta todo en una nueva lista priorizada sin tocar la lista original.

---

### 📊 D. Funciones de Alto Orden Adicionales (`fold` / `reduce` y `filter`)
* **¿Por qué usamos `fold` / `reduce` para el tiempo total?**  
  En lugar de hacer `total = 0` e ir sumando en un bucle, `fold` es una función de alto orden que "pliega" o acumula toda la lista en un solo valor numérico final.
* **¿Por qué usamos `filter`?**  
  Permite filtrar la lista de tareas extrayendo únicamente las de dificultad `Alta` sin necesidad de escribir condicionales manuales.

---

## 🚀 2. Nuevas Mejoras Solicitadas: Control del Usuario & Interfaz Limpia

Melvin, adaptamos el código exactamente a las dos prioridades que me indicaste:

### 🔘 A. El Apartado de "Horas que dio en Realizar" Protegido Bajo un Botón (Oculto al Entrar)
* **El Requisito:** Que el apartado de las horas realizadas no apareciera encima ni estorbara al ingresar a la página; debía estar resguardado bajo un botón.
* **Solución Funcional y de Interfaz:**
  1. **Vista Inicial Limpia:** Al entrar a la aplicación, la pantalla muestra únicamente tu formulario y la lista priorizada de tareas pendientes. No hay paneles de estadísticas invasivos ni tareas completadas falsas.
  2. **Botón Principal:** En la cabecera agregamos el botón interactivo **`⏱️ Ver Horas Realizadas & Análisis`** (junto con un contador en tiempo real).
  3. **Modal Dedicado (`#modal-horas-realizadas`):** Solo cuando haces clic en ese botón se despliega la ventana con el detalle completo de las horas invertidas, el tiempo ahorrado al terminar antes y tu diagnóstico de rendimiento. Al pulsar *Regresar*, vuelves a tu agenda limpia.

### ✍️ B. Mensajes Motivacionales Propios (Tú los Escribes)
* **El Requisito:** En lugar de que el sistema imponga frases automáticas, tú tienes el control de poner tus propios mensajes motivacionales.
* **Solución Implementada:**
  1. **En el Formulario de Agregar Tarea:** Agregamos el campo **`💬 Mi Mensaje Motivacional`**, donde escribes tu frase de aliento personal o el consejo del profesor que tú decidas.
  2. **En la Tarjeta de la Tarea:** Tu mensaje se muestra con una burbuja destacada (`💬 Mi Mensaje: "..."`).
  3. **En el Registro de Horas (`complete-modal`):** Al presionar **`⏱️ Registrar Horas`**, puedes volver a editar o escribir tu reflexión final antes de guardarla.
  4. **Persistencia Inmutable:** Tu mensaje queda registrado de por vida en el historial de tareas completadas.

### ⏱️ C. Registro Preciso de Horas Reales Invertidas
* En cada tarea pendiente hay un botón directo: **`⏱️ Registrar Horas`**.
* Al pulsarlo, indicas cuántas horas y minutos te tomó realizarla.
* El sistema calcula de forma pura (`horasEstimadas - horasReales`) si terminaste antes de tiempo y cuánto tiempo ganaste.

---

## ⚔️ 3. Rust vs Web Frontend: ¿Qué te recomiendo y por qué?

Melvin, me preguntaste si es mejor en **Rust** o en **Sitio Web / Aplicación**, y aquí está mi recomendación técnica:

### 🏆 Mi Recomendación: **Arquitectura Híbrida (Frontend Web + Engine Funcional)**

| Enfoque | Ventajas | Desventajas |
|---|---|---|
| **Consola de Rust puro (`cargo run`)** | • 100% de cumplimiento en la rúbrica backend.<br>• Ultrarrápido y seguro. | • Solo se ve en una terminal de texto en blanco y negro.<br>• El usuario final tiene que escribir comandos. |
| **Sitio Web / App Interactiva (HTML5 + CSS + JS Engine)** | • **WOW Visual:** El usuario puede seleccionar materias dinámicas, mover sliders de horas, activar cronómetros, escribir sus propias frases motivacionales y ver el apartado de horas bajo un botón.<br>• Se ejecuta en cualquier navegador en un clic. | • Requiere un diseño UI/UX interactivo. |

#### ✅ La Solución Ideal para tu Proyecto:
Tu proyecto ahora cuenta con **Ambas Capas**:
1. **El Motor en Rust / Python (`organizador_tareas.py` y `.rs`):** Demuestra ante el profesor tu dominio de estructuras algebraicas, pattern matching y funciones de orden superior puras.
2. **La Interfaz Web Interactiva (`index.html`, `app.js`, `style.css`):** Le permite al usuario interactuar en tiempo real, escribir sus mensajes motivacionales y consultar sus horas realizadas con un clic.

---

## 🖥️ 4. ¿Cómo ejecutar y ver tu programa funcionando?

Tienes **dos formas sencillas** de abrir y usar tu aplicación:

### Método 1: Servidor Local (Activo en vivo)
1. El servidor local de Python ya se encuentra corriendo en segundo plano en el puerto 8080.
2. Abre tu navegador favorito (Chrome, Edge, Firefox, Brave) e ingresa a:
   👉 **`http://localhost:8080`**

### Método 2: Abrir directamente el archivo HTML (Sin depender de ningún comando)
1. Abre tu explorador de archivos de Windows y dirígete a la carpeta del proyecto:  
   `c:\Users\melvi\Documents\antigravity\charming-borg\progrmacion_funcional\proyecto semestre\`
2. Haz doble clic en el archivo [`index.html`](file:///c:/Users/melvi/Documents/antigravity/charming-borg/progrmacion_funcional/proyecto%20semestre/index.html).
3. ¡Se abrirá inmediatamente en tu navegador con todas sus funciones activas!

---

## 🎯 5. Flujo de Uso Rápido en la Aplicación
1. **Crear una Tarea:** Escribe el nombre, elige la materia, ingresa días restantes, horas estimadas, selecciona dificultad y **escribe tu propio mensaje motivacional**.
2. **Priorización Automática:** Verás cómo el motor funcional ubica las tareas más urgentes e importantes al principio con tu frase motivacional visible.
3. **Registrar Horas Realizadas:** Pulsa **"⏱️ Registrar Horas"** en cualquier tarea, ingresa el tiempo real que tardaste y tu nota de logro.
4. **Consultar Horas & Logros:** Cuando tú lo decidas, pulsa el botón **"⏱️ Ver Horas Realizadas & Análisis"** en la parte superior para consultar el historial completo y cerrarlo cuando gustes.

---

## 🍅 6. Sesión 28-Sep-2026: Metodología Pomodoro + Mejoras de UI

Melvin, en esta sesión hicimos varios cambios importantes que te explico uno por uno:

---

### ⏱️ A. Motor Pomodoro en `app.js` (La Gran Novedad)

Antes el cronómetro era simplemente un **reloj que subía** (0, 1, 2, 3... segundos). Eso era un **cronómetro**, no un Pomodoro.

Ahora el sistema tiene una **máquina de estados** con 4 fases:

```
[ config ] ──►  [ enfoque ]  ──►  [ descanso ]  ──►  [ decisión ]
  ⚙️                🔥                 ☕                ❓
  Ajustas         Cuenta              Cuenta            ¿Otra ronda
  tus minutos     hacia atrás         hacia atrás       o terminar?
```

* **`fase: 'config'`** → Aparecen dos inputs: minutos de enfoque (por defecto 25) y minutos de descanso (por defecto 10). El usuario los puede cambiar y luego pulsa **"Iniciar Pomodoro"**.
* **`fase: 'enfoque'`** → El reloj cuenta hacia **abajo** desde, por ejemplo, `25:00`. Cada segundo que pasa se acumula en `segundosEnfoqueAcumulados` (solo el tiempo real de trabajo, NO el descanso).
* **`fase: 'descanso'`** → Cuando llega a `00:00`, suena una alarma, el banner se pone azul-verde (`focus-descanso`) y el reloj baja desde `10:00`.
* **`fase: 'decisión'`** → Al terminar el descanso aparece el panel: **"¿Otra Ronda?"** o **"Terminé la Tarea"**.

**Nuevas funciones creadas:**

| Función | ¿Qué hace? |
|---|---|
| `iniciarFaseEnfoque()` | Lee los inputs del usuario, arranca el countdown de trabajo |
| `tickearPomodoro()` | Motor del reloj: cuenta hacia atrás y cambia de fase al llegar a 0 |
| `iniciarFaseDescanso()` | Activa la fase de descanso con su propio countdown |
| `finalizarDescanso()` | Muestra el panel de decisión (otra ronda o completar) |
| `reiniciarRondaEnfoque()` | Inicia otra ronda reutilizando los minutos ya configurados |
| `reproducirAlarma()` | Genera un beep con la Web Audio API (sin archivos .mp3 externos) |

---

### 🔊 B. Alarma Sonora sin Archivos Externos (`reproducirAlarma`)

```javascript
// ¿Por qué Web Audio API y no un <audio> tag?
// Porque no necesitamos ningún archivo .mp3 ni .wav.
// El navegador genera el sonido matemáticamente en tiempo real.
const reproducirAlarma = () => {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.frequency.value = 880; // La nota A5
    osc.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.25);
};
```

Se tocan dos beeps seguidos (880 Hz y 1046 Hz) para que sea una señal clara y agradable.

---

### 🎨 C. Cambios en `style.css` (Refactorización de Formato)

Todos los cambios en CSS fueron **solo de formato** (cómo se escribe el código), **sin cambiar el comportamiento visual**. Se hizo para seguir las convenciones modernas de CSS:

* Cada propiedad dentro de `@keyframes` va en su propia línea (antes estaban en una sola línea).
* Los selectores con coma (`input:focus, select:focus`) ahora van en líneas separadas.
* Los selectores de pseudo-clase (`input:checked + span`) ya no llevan espacio antes del `+`.
* Se eliminaron líneas en blanco extra al final del archivo.

> **Analogía:** Es como cuando reformateas un párrafo en Word para que se vea más ordenado, pero el contenido sigue siendo el mismo.

---

### 🧠 D. Prioridad del Mensaje Personal en el Modal de Completar

Antes: el sistema siempre mostraba el consejo automático del maestro (ej. "Excelente, terminaste antes de tiempo").

Ahora: **si tú escribiste tu propio recordatorio**, ese tiene PRIORIDAD y se muestra en lugar del consejo automático.

```javascript
if (mensajePersonal) {
    titleEl.textContent = '📌 Tu Recordatorio:';   // Muestra TU texto
    quoteEl.textContent = `«${mensajePersonal}»`;
} else {
    titleEl.textContent = `Consejo del ${maestro.nombre}:`; // Consejo automático
    quoteEl.textContent = mensajeMaestro;
}
```

**¿Por qué?** Porque si escribiste "Estudiar el capítulo 3 antes de rendir", eso es más útil para ti que un mensaje genérico del sistema.

---

### 🏷️ E. Cambio de Etiqueta: "Mensaje Motivacional" → "Recordatorio"

El campo que antes decía `💬 Mi Mensaje Motivacional` ahora dice `📌 Recordatorio`. Esto se hizo porque el campo es más útil para guardar **recordatorios de temas o conceptos importantes** que frases motivacionales genéricas.

---

### 📊 F. `segundosEnfoqueAcumulados` → El Tiempo Real de Trabajo

Este campo es muy importante. Guarda **únicamente el tiempo que estuviste trabajando**, sin contar los descansos. Cuando completas una tarea, el análisis de eficiencia usa este número, no el tiempo total de sesión.

```javascript
// Solo se suma durante la fase de ENFOQUE, no durante el descanso
if (focusSession.fase === 'enfoque') {
    focusSession.segundosEnfoqueAcumulados += 1;
}
```

---

### 🔗 Nuevos Botones Conectados en el HTML/JS

| ID del Botón | Función que Llama | ¿Cuándo aparece? |
|---|---|---|
| `btn-start-pomodoro` | `iniciarFaseEnfoque()` | Fase de configuración |
| `btn-otra-ronda` | `reiniciarRondaEnfoque()` | Panel de decisión post-descanso |
| `btn-finish-after-break` | `abrirModalCompletar(...)` | Panel de decisión post-descanso |
| `btn-finish-focus` | `abrirModalCompletar(...)` | Durante la fase de enfoque |

---

## 🧪 7. Pruebas y Validación (Unit Tests)

Melvin, para asegurar la calidad de tu código aplicamos pruebas unitarias. Esto nos permite comprobar matemáticamente que las funciones hacen exactamente lo que prometen, ¡antes de siquiera abrir la aplicación!

### 🐍 A. Las Pruebas en Python (`test_organizador.py`)

Usamos la librería estándar `unittest`. Escribimos 25 tests cubriendo el 100% de las funciones puras de nuestro motor funcional.

| Función | ¿Qué probamos? (Ejemplos) |
|---------|----------------------------|
| `obtener_peso_dificultad` | Verificamos que siempre devuelva `Alta = 3.0, Media = 2.0, Baja = 1.0`. |
| `calcular_prioridad` | Revisamos que una tarea a vencer mañana obtenga un puntaje altísimo (ej. `> 10`). |
| `generar_razon` | Aseguramos que retorne mensajes coherentes como `"URGENTE"` o `"MODERADO"`. |
| `procesar_y_priorizar` | Comprobamos que el orden del arreglo devuelto sea descendente (el más urgente en la cima). |
| `calcular_tiempo_total_estimado` | Probamos que el `reduce()` sume correctamente las horas, asumiendo 2 horas si el campo está vacío. |
| `filtrar_por_dificultad` | Validamos que el `filter()` devuelva listas solo con la dificultad indicada. |

### 🦀 B. Las Pruebas en Rust (`.rs`)

En Rust utilizamos el sistema integrado de testing `#[cfg(test)]`. 
Al igual que en Python, creamos 12 pruebas divididas por cada función pura para verificar que el pattern matching, las matemáticas y el iterador pipeline se comporten perfectamente. 

> **Analogía:** Hacer pruebas unitarias es como tener al profesor revisando cada pequeña función de tu examen por separado. Así, cuando entregas el proyecto completo, sabes que cada engranaje funciona a la perfección.
