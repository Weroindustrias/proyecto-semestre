//programa parcial//

#[derive(Debug, Clone, PartialEq)]
pub enum Dificultad {
    Alta,
    Media,
    Baja,
}


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
// Para correr: pega este archivo como src/main.rs y ejecuta `cargo test`
// ============================================================================
#[cfg(test)]
mod tests {
    use super::*;   // ← "use" es obligatorio para importar todo del módulo padre

    // ------------------------------------------------------------------
    // GRUPO 1: obtener_peso_dificultad (función pura / pattern matching)
    // ------------------------------------------------------------------

    /// Verifica que Alta => 3.0  (el peso más alto)
    #[test]
    fn test_peso_alta() {
        assert_eq!(obtener_peso_dificultad(&Dificultad::Alta), 3.0);
    }

    /// Verifica que Media => 2.0
    #[test]
    fn test_peso_media() {
        assert_eq!(obtener_peso_dificultad(&Dificultad::Media), 2.0);
    }

    /// Verifica que Baja => 1.0  (el peso más bajo)
    #[test]
    fn test_peso_baja() {
        assert_eq!(obtener_peso_dificultad(&Dificultad::Baja), 1.0);
    }

    // ------------------------------------------------------------------
    // GRUPO 2: calcular_prioridad (función pura / fórmula matemática)
    // ------------------------------------------------------------------

    /// Fórmula: (peso * horas) / (dias + 0.1)
    /// Alta=3.0, horas=4, dias=1 => (3.0*4)/(1.0+0.1) = 12/1.1 ≈ 10.909
    #[test]
    fn test_prioridad_tarea_urgente_alta() {
        let tarea = Tarea::nueva("Examen", "POO", 1, Dificultad::Alta, Some(4));
        let score = calcular_prioridad(&tarea);
        // Debe ser mayor que 10 porque es difícil y vence mañana
        assert!(score > 10.0, "Esperaba score > 10, obtuvo: {}", score);
    }

    /// Baja=1.0, horas=2 (default), dias=5 => (1.0*2)/(5.0+0.1) ≈ 0.392
    #[test]
    fn test_prioridad_tarea_con_dias_holgados() {
        let tarea = Tarea::nueva("Investigación", "Física", 5, Dificultad::Baja, Some(2));
        let score = calcular_prioridad(&tarea);
        // Score bajo: poco urgente y poca dificultad
        assert!(score < 1.0, "Esperaba score < 1.0, obtuvo: {}", score);
    }

    /// Prueba que Option::None usa el valor por defecto de 2 horas (unwrap_or(2))
    /// Media=2.0, horas=None=>2, dias=3 => (2.0*2)/(3.0+0.1) ≈ 1.29
    #[test]
    fn test_prioridad_con_horas_none_usa_default() {
        let tarea_sin_horas = Tarea::nueva("Tarea sin horas", "Álgebra", 3, Dificultad::Media, None);
        let tarea_con_dos  = Tarea::nueva("Tarea con 2hrs",  "Álgebra", 3, Dificultad::Media, Some(2));
        // Ambas deben tener el MISMO score porque None => 2 por defecto
        let score_none = calcular_prioridad(&tarea_sin_horas);
        let score_dos  = calcular_prioridad(&tarea_con_dos);
        assert!(
            (score_none - score_dos).abs() < 1e-9,
            "None y Some(2) deben dar el mismo score. Got {} vs {}",
            score_none, score_dos
        );
    }

    // ------------------------------------------------------------------
    // GRUPO 3: generar_razon (función pura / lógica de clasificación)
    // ------------------------------------------------------------------

    /// Si dias_restantes <= 1 => debe decir "URGENTE"
    #[test]
    fn test_razon_urgente_cuando_vence_hoy() {
        let tarea = Tarea::nueva("Entrega", "Cálculo", 0, Dificultad::Alta, Some(3));
        let razon = generar_razon(&tarea, calcular_prioridad(&tarea));
        assert!(
            razon.contains("URGENTE"),
            "Con dias=0 la razón debe contener URGENTE. Obtuvo: {}", razon
        );
    }

    /// Si score > 3.0 y dias > 1 => debe decir "IMPORTANTE"
    #[test]
    fn test_razon_importante_cuando_score_alto() {
        // Alta=3.0, horas=5, dias=2 => (3.0*5)/(2.0+0.1) ≈ 7.14  (> 3.0 y dias>1)
        let tarea = Tarea::nueva("Proyecto", "POO", 2, Dificultad::Alta, Some(5));
        let score = calcular_prioridad(&tarea);
        let razon = generar_razon(&tarea, score);
        assert!(
            razon.contains("IMPORTANTE"),
            "Con score alto la razón debe contener IMPORTANTE. Score={}, Razón: {}", score, razon
        );
    }

    /// Si score <= 3.0 y dias > 1 => debe decir "MODERADO"
    #[test]
    fn test_razon_moderado_cuando_score_bajo() {
        // Baja=1.0, horas=1, dias=10 => (1.0*1)/(10.0+0.1) ≈ 0.099  (<= 3.0)
        let tarea = Tarea::nueva("Lectura", "Historia", 10, Dificultad::Baja, Some(1));
        let score = calcular_prioridad(&tarea);
        let razon = generar_razon(&tarea, score);
        assert!(
            razon.contains("MODERADO"),
            "Con score bajo la razón debe contener MODERADO. Score={}, Razón: {}", score, razon
        );
    }

    // ------------------------------------------------------------------
    // GRUPO 4: procesar_y_priorizar (pipeline: map + collect + sort)
    // ------------------------------------------------------------------

    /// La tarea más urgente (Alta/1 día) debe quedar en la posición 0
    #[test]
    fn test_pipeline_ordena_correctamente() {
        let tareas = vec![
            Tarea::nueva("Investigación", "Física",                5, Dificultad::Baja,  Some(2)),
            Tarea::nueva("Examen",        "POO",                   1, Dificultad::Alta,  Some(4)),
            Tarea::nueva("Proyecto",      "Programación Funcional", 3, Dificultad::Media, Some(6)),
        ];
        let agenda = procesar_y_priorizar(&tareas);
        // El primero debe ser el Examen (mayor urgencia)
        assert_eq!(
            agenda[0].0.nombre, "Examen",
            "La primera prioridad debe ser el Examen. Obtuvo: {}", agenda[0].0.nombre
        );
    }

    /// El pipeline debe devolver TODOS los elementos (ninguno se descarta)
    #[test]
    fn test_pipeline_devuelve_todos_los_elementos() {
        let tareas = vec![
            Tarea::nueva("A", "Mat", 3, Dificultad::Baja,  Some(1)),
            Tarea::nueva("B", "Mat", 2, Dificultad::Media, Some(2)),
            Tarea::nueva("C", "Mat", 1, Dificultad::Alta,  Some(3)),
        ];
        let agenda = procesar_y_priorizar(&tareas);
        assert_eq!(agenda.len(), 3, "El pipeline debe devolver los 3 elementos");
    }

    /// Con una lista vacía no debe fallar ni entrar en pánico
    #[test]
    fn test_pipeline_con_lista_vacia_no_falla() {
        let tareas: Vec<Tarea> = vec![];
        let agenda = procesar_y_priorizar(&tareas);
        assert!(agenda.is_empty(), "Con lista vacía el resultado también debe estar vacío");
    }
}