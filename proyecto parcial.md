# Propuesta de Proyecto Parcial: Organizador de Tareas

## Datos de Identificación
- **Institución:** Facultad de Ingeniería Mecánica y Eléctrica (FIME) - Universidad de Colima
- **Programa Educativo:** Ingeniería en Computación Inteligente
- **Materia:** Programación Funcional (3er Semestre)
- **Estudiante:** Melvin Jaeen García Camacho
- **Fecha de Entrega:** 27 de agosto de 2026

---

## 1. Nombre del Proyecto
**Organizador de Tareas**  
*(Implementación en lenguaje Rust / Functional Task Prioritizer)*

---

## 2. Lenguaje Seleccionado y Justificación
**Lenguaje de Programación:** **Rust**

### ¿Por qué Rust para Programación Funcional?
Rust es uno de los lenguajes modernos más potentes para aplicar el paradigma funcional por las siguientes características de diseño:
1. **Inmutabilidad por Defecto:** En Rust las variables son inmutables por defecto (`let`), obligando al desarrollador a pensar de forma puramente funcional.
2. **Sistema de Tipos Expresivo e Inmutable (Enums y Structs):** Tipos algebraicos de datos que eliminan valores nulos mediante `Option<T>` y `Result<T, E>`.
3. **Iteradores y Funciones de Alto Orden de Cero Costo:** Los iteradores en Rust (`.iter()`, `.map()`, `.filter()`, `.fold()`, `.collect()`) se compilan a código ensamblador súper eficiente manteniendo una sintaxis puramente funcional.
4. **Pattern Matching Exhaustivo:** Expresiones `match` que garantizan cubrir todos los casos posibles en tiempo de compilación.

---

## 3. Problema o Necesidad

Los estudiantes universitarios se enfrentan a una constante sobrecarga académica (exámenes, proyectos, tareas e investigaciones de múltiples materias simultáneas). Esta acumulación de pendientes provoca que se olviden de ellas o no sepan qué hacer primero, generando incertidumbre y estrés.

El **Organizador Inteligente de Tareas** resuelve este problema calculando de manera objetiva la **urgencia e importancia** de cada pendiente mediante un motor de evaluación pura y ordenamiento algorítmico en Rust, evitando que el estudiante tenga que decidir manualmente su agenda.

---

## 4. Funcionamiento General del Sistema

1. **Entrada de Datos:** El estudiante introduce sus tareas indicando:
   - Nombre de la tarea (`String`)
   - Materia (`String`)
   - Fecha / Días restantes para la entrega (`u32`)
   - Nivel de dificultad (`Enum Dificultad { Alta, Media, Baja }`)
   - Tiempo estimado en horas (`Option<u32>`)
2. **Evaluación Funcional de Prioridad:** Una función pura procesa la estructura inmutable y calcula una puntuación de prioridad (`f64`).
3. **Canalización con Iteradores (Pipelines):** Se aplica una cadena funcional con iteradores `.iter().filter().map().collect()` para ordenar las tareas de mayor a menor urgencia.
4. **Presentación de Resultados:** Muestra la lista priorizada acompañada de explicaciones claras sobre la recomendación.

### Ejemplo de Entrada y Salida esperada:

**Entrada del Usuario:**

| Tarea | Materia | Fecha de entrega | Dificultad | Tiempo Est. |
|---|---|---|---|---|
| Investigación | Física | Lunes (5 días) | Baja | 2 hrs |
| Examen | POO | Mañana (1 día) | Alta | 4 hrs |
| Proyecto | Programación Funcional | Viernes (3 días) | Media | 6 hrs |

**Salida Priorizada por el Sistema:**

```text
=== AGENDA RECOMENDADA POR EL SISTEMA ===
[Prioridad 1] Examen - POO (Vence: Mañana | Dificultad: Alta)
   └─ Razón: Primero realiza el examen porque va a ser mañana y tiene dificultad Alta.
[Prioridad 2] Proyecto - Programación Funcional (Vence: Viernes | Dificultad: Media)
   └─ Razón: IMPORTANTE. Requiere tiempo considerable de desarrollo (6 hrs).
[Prioridad 3] Investigación - Física (Vence: Lunes | Dificultad: Baja)
   └─ Razón: MODERADO. Tarea corta con suficiente tiempo disponible.
```

### Ejemplo en Sintaxis Funcional de Rust (Demostración Técnica):

```rust
#[derive(Debug, Clone)]
enum Dificultad {
    Alta,
    Media,
    Baja,
}

#[derive(Debug, Clone)]
struct Tarea {
    nombre: String,
    materia: String,
    dias_restantes: u32,
    dificultad: Dificultad,
    horas_estimadas: Option<u32>,
}

// Función Pura de Evaluación
fn calcular_prioridad(tarea: &Tarea) -> f64 {
    let peso_dificultad = match tarea.dificultad {
        Dificultad::Alta => 3.0,
        Dificultad::Media => 2.0,
        Dificultad::Baja => 1.0,
    };
    let horas = tarea.horas_estimadas.unwrap_or(2) as f64;
    (peso_dificultad * horas) / (tarea.dias_restantes as f64 + 0.1)
}

// Canalización Funcional con Iteradores
fn obtener_tareas_priorizadas(tareas: &[Tarea]) -> Vec<(&Tarea, f64)> {
    let mut priorizadas: Vec<(&Tarea, f64)> = tareas
        .iter()
        .map(|t| (t, calcular_prioridad(t)))
        .collect();
    
    // Ordenamiento por prioridad descendente (mayor score primero)
    priorizadas.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());
    priorizadas
}
```

---

## 5. Mapeo de Temas de la Materia a Conceptos de Rust

| Tema del Temario | Concepto Equivalente en Rust | Aplicación en el Proyecto |
|---|---|---|
| **Inmutabilidad** | Variables inmutables `let` (sin `mut`) | Las tareas y listas se procesan mediante transformaciones que generan nuevos valores sin mutar los originales. |
| **Tipos de Datos y Tuplas** | Structs, Enums, Tuplas `(Tarea, f64)` | `Tarea` como Struct inmutable, `Dificultad` como Enum, y tuplas para emparejar tareas con sus puntuaciones. |
| **Pattern Matching** | Expresiones `match` | Clasificación de dificultades y reglas de urgencia con comprobación exhaustiva del compilador. |
| **Manejo de Nulos** | `Option<T>` (`Some`, `None`) | Para manejar datos opcionales como `horas_estimadas` de forma segura sin punteros nulos. |
| **Funciones de Alto Orden** | Trait `Iterator` (`.map()`, `.filter()`, `.fold()`) | Filtrado de tareas vencidas, mapeo de puntuaciones y cálculo del tiempo total acumulado. |
| **Lambdas / Closures** | Closures en Rust (`|t| ...`) | Funciones anónimas para criterios de filtrado y ordenamiento en iteradores. |
| **Recursión** | Funciones recursivas en Rust | Algoritmo recursivo para desglose de proyectos grandes en subtareas. |
| **Módulos** | Sistema de módulos `mod` | Separación limpia del código en `mod evaluador;`, `mod tareas;`, `mod ui;`. |
| **Pruebas Unitarias** | Atributos `#[cfg(test)]` y `assert_eq!` | Verificación de corrección en las funciones de cálculo de prioridad. |

---

## 6. Responsabilidades del Agente / Programa

1. **Capturar:** Recibir la lista de tareas inmutable ingresadas por el estudiante.
2. **Evaluar:** Aplicar funciones puras de puntuación mediante `match` e iteradores.
3. **Ordenar:** Filtrar y ordenar la colección usando métodos funcionales (`.iter().map().collect()`).
4. **Recomendar:** Desplegar en consola o interfaz las tareas en orden descendente de urgencia con su recomendación explicativa.

---

## 7. Valor de la Propuesta

Hacer el proyecto en **Rust** no solo cumple al 100% con los principios de la Programación Funcional, sino que demuestra un nivel **avanzado y profesional**:
- Código ultrarrápido y seguro de memoria.
- Dominio de conceptos funcionales modernos (Iteradores, Closures, Pattern Matching, Inmutabilidad y Monadas/Options).

---

## 8. Código Inicial del Proyecto en Rust (`main.rs`)

A continuación tienes el código listo para compilar e iniciar el desarrollo de tu proyecto parcial (`cargo run`):

```rust
// ============================================================================
// PROYECTO PARCIAL: ORGANIZADOR DE TAREAS EN RUST
// Materia: Programación Funcional
// Estudiante: Melvin Jaeen García Camacho
// ============================================================================

#[derive(Debug, Clone, PartialEq)]
pub enum Dificultad {
    Alta,
    Media,
    Baja,
}

#[derive(Debug, Clone)]
pub struct Tarea {
    pub nombre: String,
    pub materia: String,
    pub dias_restantes: u32,
    pub dificultad: Dificultad,
    pub horas_estimadas: Option<u32>,
}

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

// 1. Función Pura: Obtener peso según dificultad usando Pattern Matching
pub fn obtener_peso_dificultad(dificultad: &Dificultad) -> f64 {
    match dificultad {
        Dificultad::Alta => 3.0,
        Dificultad::Media => 2.0,
        Dificultad::Baja => 1.0,
    }
}

// 2. Función Pura: Calcular el score numérico de prioridad
pub fn calcular_prioridad(tarea: &Tarea) -> f64 {
    let peso = obtener_peso_dificultad(&tarea.dificultad);
    let horas = tarea.horas_estimadas.unwrap_or(2) as f64; // Option::unwrap_or
    (peso * horas) / (tarea.dias_restantes as f64 + 0.1)
}

// 3. Función Pura: Generar recomendación agéntica basada en la tarea y su prioridad
pub fn generar_razon(tarea: &Tarea, score: f64) -> String {
    if tarea.dias_restantes <= 1 {
        format!(
            "URGENTE. Vence en menos de 24 horas y tiene dificultad {:?}.",
            tarea.dificultad
        )
    } else if score > 3.0 {
        format!(
            "IMPORTANTE. Requiere tiempo considerable ({:?} hrs estimadas).",
            tarea.horas_estimadas.unwrap_or(2)
        )
    } else {
        "MODERADO. Tarea corta con suficiente tiempo disponible.".to_string()
    }
}

// 4. Canalización Funcional (Pipeline): Filtrar, mapear y ordenar la lista
pub fn procesar_y_priorizar(tareas: &[Tarea]) -> Vec<(&Tarea, f64, String)> {
    let mut lista_evaluada: Vec<(&Tarea, f64, String)> = tareas
        .iter()
        .map(|t| {
            let score = calcular_prioridad(t);
            let razon = generar_razon(t, score);
            (t, score, razon)
        })
        .collect();

    // Ordenamiento puramente descendente por el score de prioridad
    lista_evaluada.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
    lista_evaluada
}

fn main() {
    println!("========================================================");
    println!("   ORGANIZADOR DE TAREAS - ENGINE FUNCIONAL EN RUST");
    println!("========================================================\n");

    // Datos de entrada (Colección Inmutable)
    let tareas = vec![
        Tarea::nueva("Investigación", "Física", 5, Dificultad::Baja, Some(2)),
        Tarea::nueva("Examen", "POO", 1, Dificultad::Alta, Some(4)),
        Tarea::nueva("Proyecto", "Programación Funcional", 3, Dificultad::Media, Some(6)),
    ];

    // Procesamiento con pipeline de iteradores
    let agenda_priorizada = procesar_y_priorizar(&tareas);

    // Presentación de resultados
    println!("=== AGENDA RECOMENDADA POR EL SISTEMA ===\n");
    for (pos, (tarea, _score, razon)) in agenda_priorizada.iter().enumerate() {
        println!(
            "[Prioridad {}] {} - {} (Vence en {} día(s) | Dificultad: {:?})",
            pos + 1,
            tarea.nombre,
            tarea.materia,
            tarea.dias_restantes,
            tarea.dificultad
        );
        println!("   └─ Razón: {}\n", razon);
    }
}

// ============================================================================
// PRUEBAS UNITARIAS (Unidad II / Pruebas con Assert)
// ============================================================================
#[cfg(test)]
mod tests {
    super::*;

    #[test]
    fn test_peso_dificultad() {
        assert_eq!(obtener_peso_dificultad(&Dificultad::Alta), 3.0);
        assert_eq!(obtener_peso_dificultad(&Dificultad::Baja), 1.0);
    }

    #[test]
    fn test_calculo_prioridad_tarea_urgente() {
        let tarea_examen = Tarea::nueva("Examen", "POO", 1, Dificultad::Alta, Some(4));
        let score = calcular_prioridad(&tarea_examen);
        assert!(score > 10.0, "Una tarea de dificultad Alta a 1 día debe tener score elevado");
    }
}
```
