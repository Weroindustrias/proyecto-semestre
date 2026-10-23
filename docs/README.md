# 📚 Organizador Inteligente de Tareas (Motor Funcional + Pomodoro)

**Materia:** Programación Funcional (3er Semestre)  
**Carrera:** Ingeniería en Computación Inteligente (ICI) - FIME, Universidad de Colima  
**Alumno:** Melvin Jaeen García Camacho  
**Profesor:** Mata López Walter Alexander  

---

## 🎯 Descripción del Proyecto

Este proyecto es una aplicación web híbrida que combina un diseño interactivo (Frontend HTML5/JS/CSS) con un **Motor de Evaluación Basado en Programación Funcional**. La aplicación ayuda al usuario a priorizar sus tareas escolares automáticamente mediante el uso de algoritmos matemáticos e integra la metodología **Pomodoro** para incentivar el enfoque profundo.

## 🧠 Conceptos de Programación Funcional Aplicados

El proyecto fue construido bajo el paradigma declarativo, respetando las leyes de la programación funcional para garantizar un código libre de efectos secundarios y fácil de testear. 

* **Funciones Puras:** El cálculo de la prioridad matemática y la asignación de puntajes se procesan en funciones puras sin alterar variables globales (Transparencia Referencial).
* **Inmutabilidad:** Las listas de tareas pendientes y completadas nunca se modifican directamente; se crean nuevas colecciones utilizando métodos no destructivos.
* **Higher-Order Functions:** Uso extensivo de `.map()`, `.filter()` y `.reduce()` para evaluar las tareas, calcular estadísticas (ahorro de tiempo y eficiencia) y filtrar el historial.
* **Pattern Matching / Enumeraciones:** Estructuras restringidas (Ej. `Alta`, `Media`, `Baja`) para manejar casos sin lugar a errores de tipo.

## 🏗️ Arquitectura del Sistema

El proyecto demuestra el dominio funcional en 2 lenguajes distintos:
1. **Motor en Rust y Python:** El "cerebro" matemático y la lógica pura están implementados y completamente evaluados con *Unit Tests* (`test_organizador.py` y pruebas `#[cfg(test)]` en `.rs`).
2. **Interfaz Gráfica en Navegador:** Se consumieron estos principios en un Frontend limpio, responsivo y dinámico (Vanilla JS), incluyendo una máquina de estados para el modo Pomodoro, guardado en `localStorage` y generación de alertas de audio (Web Audio API).

## 🚀 ¿Cómo Ejecutar la Aplicación?

No necesitas instalar dependencias complicadas. Solo sigue estos pasos:

### 1. Para ver la aplicación web interactiva (Navegador)
1. Puedes hacer doble clic en el archivo `index.html` en la raíz (redirige automáticamente), o abrir `fron/index.html`.
2. Funciona al instante en cualquier navegador web moderno sin necesidad de instalar nada.

### 2. Para ejecutar como Aplicación de Escritorio con Electron
La aplicación ya cuenta con soporte nativo para **Electron**:
```bash
# 1. Instalar dependencias (Electron y empaquetador)
npm install

# 2. Iniciar en modo escritorio (Desktop App)
npm start

# 3. Empaquetar ejecutable para Windows (.exe portable)
npm run dist:win
```
*En modo Electron, la aplicación se ejecuta en su propia ventana aislada e integra notificaciones del sistema operativo y conexión por IPC con el motor de Node.js.*

### 3. Para ejecutar el Backend con Node.js (Servidor Web & API REST)
Si deseas ejecutar la aplicación a través de un servidor backend en Node.js:
```bash
npm run server
# o también: npm run web
```
Esto levantará el servidor HTTP nativo en `http://localhost:3000` con la API REST (`/api/tareas`, `/api/analisis`) y servirá la Web App automáticamente.

### 4. Para correr las Pruebas Unitarias del Motor Funcional
**En Python:**
Puedes ejecutarlas directamente desde la raíz del proyecto o desde la carpeta `Pruebas/`:
```bash
# Opción A: Desde la raíz del repositorio
python Pruebas/test_organizador.py -v

# Opción B: Entrando a la carpeta de pruebas
cd Pruebas
python test_organizador.py -v
```
*(Comprobarás que los **38 tests unitarios** de aserciones de funciones puras pasan exitosamente con status OK).*

---

## 🧪 Evidencias y Casos de Prueba del Motor Funcional

Para garantizar el cumplimiento riguroso de los principios de **Programación Funcional** (*Transparencia Referencial, Inmutabilidad, Ausencia de Efectos Secundarios, Composición Declarativa y Tipado Expresivo*), se diseñó una batería de 38 pruebas unitarias formales divididas en 10 grupos.

### 📋 Tabla de Casos de Prueba (Entrada vs. Salida Esperada)

| ID | Concepto PF Evaluado | Función / Módulo | Entrada (Valores de Prueba) | Salida Esperada | Estado |
|---|---|---|---|---|---|
| **CP-01** | Pattern Matching Puro | `obtener_peso_dificultad` | `Dificultad.ALTA`, `MEDIA`, `BAJA` | `3.0`, `2.0`, `1.0` (Mapeo determinista) | ✅ Aprobado |
| **CP-02** | Función Pura Matemática | `calcular_prioridad` | Tarea urgente: `Alta`, 4 hrs, 1 día | `Score = (3.0 × 4)/(1 + 0.1) ≈ 10.909` | ✅ Aprobado |
| **CP-03** | Función Pura Matemática | `calcular_prioridad` | Tarea holgada: `Baja`, 2 hrs, 5 días | `Score = (1.0 × 2)/(5 + 0.1) ≈ 0.392` | ✅ Aprobado |
| **CP-04** | Manejo de Opcionales (`Option` / `None`) | `calcular_prioridad` | Tarea con `horas_estimadas = None` | Usa 2 hrs por defecto (`score_none == score_2hrs`) | ✅ Aprobado |
| **CP-05** | Clasificación Lógica Declarativa | `generar_razon` | `dias_restantes <= 1` | Mensaje incluye etiqueta `"URGENTE"` | ✅ Aprobado |
| **CP-06** | Clasificación Lógica Declarativa | `generar_razon` | `score > 3.0` y `dias > 1` | Mensaje incluye etiqueta `"IMPORTANTE"` | ✅ Aprobado |
| **CP-07** | Clasificación Lógica Declarativa | `generar_razon` | `score <= 3.0` y `dias > 1` | Mensaje incluye etiqueta `"MODERADO"` | ✅ Aprobado |
| **CP-08** | Pipeline Funcional (`map` + `sorted`) | `procesar_y_priorizar` | Lista de 3 tareas con urgencias variadas | Elemento en índice 0 es el de mayor prioridad | ✅ Aprobado |
| **CP-09** | Inmutabilidad de Colecciones | `procesar_y_priorizar` | Lista de entrada con $N$ elementos | Retorna exactamente $N$ elementos sin descartar ni mutar original | ✅ Aprobado |
| **CP-10** | Manejo de Casos Límite (Lista Vacía) | `procesar_y_priorizar` | Colección vacía `[]` | Retorna `[]` sin lanzar excepciones ni pánicos | ✅ Aprobado |
| **CP-11** | HOF Fold / Reduce Acumulador | `calcular_tiempo_total_estimado` | Lista con horas `[2, 4, 6, 3]` | Total exacto: `15` horas calculadas declarativamente | ✅ Aprobado |
| **CP-12** | HOF Filter Inmutable | `filtrar_por_dificultad` | Lista de 4 tareas (2 Altas, 1 Media, 1 Baja) | Retorna subconjunto con 2 tareas sin mutar original | ✅ Aprobado |
| **CP-13** | Inmutabilidad de Objetos | `Tarea(frozen=True)` | Intento de reasignar `tarea.dias_restantes = 1` | Lanza `FrozenInstanceError` (mutación prohibida) | ✅ Aprobado |
| **CP-14** | Inmutabilidad de Atributos | `Tarea(frozen=True)` | Intento de reasignar `tarea.nombre = "X"` | Lanza `FrozenInstanceError` (inmutabilidad estricta) | ✅ Aprobado |
| **CP-15** | Colecciones No Destructivas | `procesar_y_priorizar` | Lista original antes y después de llamada | La lista original permanece idéntica (`copia == original`) | ✅ Aprobado |
| **CP-16** | Colecciones No Destructivas | `filtrar_por_dificultad` | Lista original antes y después de filtrar | La lista original no sufre mutaciones colaterales | ✅ Aprobado |
| **CP-17** | Transparencia Referencial | `calcular_prioridad` | Llamada reiterada 10 veces seguidas | Resultados idénticos bit a bit en cada invocación | ✅ Aprobado |
| **CP-18** | Sustitución Referencial | `calcular_prioridad` | Reemplazo de llamada por fórmula matemática | `score_funcion == score_directo` con tolerancia $< 10^{-9}$ | ✅ Aprobado |
| **CP-19** | Prevención División entre Cero | `calcular_prioridad` | Tarea con `dias_restantes = 0` | Denominador $0 + 0.1 = 0.1$, sin excepción matemática | ✅ Aprobado |
| **CP-20** | Composición Funcional | `filter` + `reduce` | Tareas mixtas filtradas por `Alta` y reducidas | Suma exacta de horas solo del subconjunto filtrado | ✅ Aprobado |

---

### 📊 Salida de Ejecución de Pruebas Automatizadas (38/38 Tests OK)

A continuación se presenta el registro real de la ejecución de la suite extendida de pruebas unitarias (`unittest` en Python):

```text
> python test_organizador.py -v

test_horas_none_usa_default_2 (TestCalcularPrioridad)
Cuando horas_estimadas=None el sistema asume 2 horas. ... ok
test_mayor_dificultad_mayor_score (TestCalcularPrioridad)
Con los mismos días y horas, Alta debe tener mayor score que Baja. ... ok
test_mayor_urgencia_mayor_score (TestCalcularPrioridad)
Con la misma dificultad y horas, menos días -> mayor score. ... ok
test_tarea_holgada_score_bajo (TestCalcularPrioridad)
Baja=1.0, horas=2, dias=5 -> (1.0*2)/(5+0.1) ≈ 0.392 ... ok
test_tarea_urgente_score_alto (TestCalcularPrioridad)
Alta=3.0, horas=4, dias=1 -> (3.0*4)/(1+0.1) ≈ 10.909 ... ok
test_horas_none_cuenta_como_2 (TestCalcularTiempoTotal)
Una tarea con horas=None aporta 2 al total (valor por defecto) ... ok
test_lista_vacia_devuelve_cero (TestCalcularTiempoTotal)
reduce con lista vacía y acumulador 0 debe devolver 0 ... ok
test_suma_correcta_de_horas (TestCalcularTiempoTotal)
2 + 4 + 6 + 3 = 15 horas en total ... ok
test_cero_dias_no_causa_division_por_cero (TestCasosDeBorde)
Cuando dias_restantes=0, el factor epsilon (+0.1) previene ZeroDivisionError ... ok
test_estabilidad_con_tareas_de_igual_prioridad (TestCasosDeBorde)
Tareas con igual prioridad no causan fallas ni inconsistencias en el pipeline ... ok
test_frontera_score_ligeramente_mayor_a_tres_clasifica_importante (TestCasosDeBorde)
Si score = 3.01 y dias > 1, debe clasificar como IMPORTANTE ... ok
test_frontera_score_tres_exacto_clasifica_moderado (TestCasosDeBorde)
Si score == 3.0 y dias > 1, la condición estricta score > 3.0 no se cumple, clasificando como MODERADO ... ok
test_composicion_filter_y_reduce_horas_por_dificultad (TestComposicionFuncional)
Composición declarativa: filtrar tareas Alta y reducir para obtener solo sus horas acumuladas ... ok
test_reduccion_con_un_solo_elemento (TestComposicionFuncional)
calcular_tiempo_total_estimado con un único elemento retorna sus horas sin fallas de base ... ok
test_filtra_correctamente_altas (TestFiltrarPorDificultad)
De 4 tareas, 2 son Alta -> debe devolver exactamente 2 ... ok
test_filtra_correctamente_baja (TestFiltrarPorDificultad)
Solo 1 tarea es Baja -> lista de un elemento ... ok
test_resultado_solo_contiene_la_dificultad_pedida (TestFiltrarPorDificultad)
Todos los elementos filtrados deben tener la dificultad solicitada ... ok
test_sin_coincidencias_devuelve_lista_vacia (TestFiltrarPorDificultad)
Si no hay tareas de ese nivel, devuelve lista vacía ... ok
test_razon_importante_score_alto (TestGenerarRazon)
Alta=3.0, horas=5, dias=2 -> score ≈ 7.14 (> 3.0 y dias > 1) ... ok
test_razon_moderado_score_bajo (TestGenerarRazon)
Baja=1.0, horas=1, dias=10 -> score ≈ 0.099 (<= 3.0 y dias > 1) ... ok
test_razon_urgente_con_cero_dias (TestGenerarRazon)
días=0 -> la razón SIEMPRE debe contener 'URGENTE' ... ok
test_razon_urgente_con_un_dia (TestGenerarRazon)
días=1 también es urgente (condición <= 1) ... ok
test_filtrar_no_muta_la_lista_original (TestInmutabilidad)
filtrar_por_dificultad debe retornar una nueva colección sin alterar la original ... ok
test_procesar_no_muta_la_lista_original (TestInmutabilidad)
procesar_y_priorizar no debe alterar la colección original (No efectos colaterales) ... ok
test_tarea_es_inmutable_no_permite_modificar_atributos (TestInmutabilidad)
Tarea(frozen=True) no debe permitir mutación de sus atributos ... ok
test_tarea_no_permite_modificar_nombre (TestInmutabilidad)
Comprueba que el nombre es inmutable tras la instanciación ... ok
test_alta_mayor_que_media (TestObtenerPesoDificultad)
El peso Alta siempre debe ser mayor que Media ... ok
test_media_mayor_que_baja (TestObtenerPesoDificultad)
El peso Media siempre debe ser mayor que Baja ... ok
test_peso_alta_es_3 (TestObtenerPesoDificultad)
Alta debe devolver exactamente 3.0 ... ok
test_peso_baja_es_1 (TestObtenerPesoDificultad)
Baja debe devolver exactamente 1.0 ... ok
test_peso_media_es_2 (TestObtenerPesoDificultad)
Media debe devolver exactamente 2.0 ... ok
test_pipeline_devuelve_todos_los_elementos (TestProcesarYPriorizar)
El pipeline no descarta ningún elemento: len entrada = len salida ... ok
test_pipeline_lista_vacia_no_falla (TestProcesarYPriorizar)
Con una lista vacía el resultado debe ser también una lista vacía ... ok
test_pipeline_orden_descendente_de_scores (TestProcesarYPriorizar)
Los scores deben estar en orden DESCENDENTE (mayor a menor) ... ok
test_primer_elemento_es_el_mas_urgente (TestProcesarYPriorizar)
El Examen (Alta/1 día) debe quedar en posición 0 (mayor prioridad) ... ok
test_sustitucion_referencial_expresion_por_valor (TestTransparenciaReferencial)
En PF, f(x) puede sustituirse directamente por su valor calculado sin alterar el programa ... ok
test_transparencia_referencial_calcular_prioridad (TestTransparenciaReferencial)
Llamar a calcular_prioridad N veces con argumentos idénticos siempre produce el mismo valor ... ok
test_transparencia_referencial_obtener_peso (TestTransparenciaReferencial)
obtener_peso_dificultad carece de estado interno y produce resultados deterministas ... ok

----------------------------------------------------------------------
Ran 38 tests in 0.004s

OK (100% de las 38 pruebas pasadas con éxito)
```

### 🦀 Cobertura en Rust (`#[cfg(test)]`)
El archivo fuente en Rust (`.rs`) incluye además **12 pruebas unitarias nativas** compilables con aserciones `assert_eq!` y `assert!`:
* **Pattern Matching exhaustivo:** Comprueba pesos exactos de `Alta`, `Media` y `Baja`.
* **Precisión matemática:** Valida el cálculo de prioridad con tolerancia flotante $\epsilon < 10^{-9}$.
* **Invariantes de texto:** Garantiza que las etiquetas `"URGENTE"`, `"IMPORTANTE"` y `"MODERADO"` se generen deterministamente.
* **Pipeline de Iteradores:** Comprueba ordenamiento descendente y manejo de colecciones vacías.

---

## 📖 Documentación Complementaria

Te invito a consultar los siguientes documentos que he preparado, donde desgloso pedagógicamente el trabajo realizado y las matemáticas detrás de mi código:

* 📘 [Explicación del Código y Guía Pedagógica](./explicacion_codigo.md): Explicación línea por línea del porqué estructural del software y sus fórmulas.
* 📝 [Bitácora y Resumen de Cambios](./resumen_cambios_proyecto.md): Evolución iterativa del proyecto.

---

*«Enfócate en una sola función pura a la vez: sin efectos secundarios y sin mutar tu atención.»*

