# ============================================================================
# PROYECTO PARCIAL: ORGANIZADOR DE TAREAS (EQUIVALENTE EN PYTHON)
# Materia: Programacion Funcional
# Estudiante: Melvin Jaeen Garcia Camacho
# ============================================================================

from dataclasses import dataclass
from enum import Enum
from functools import reduce
from typing import Optional, List, Tuple

# 1. Enums y DataClasses Inmutables (frozen=True)
class Dificultad(Enum):
    ALTA = "Alta"
    MEDIA = "Media"
    BAJA = "Baja"

@dataclass(frozen=True)
class Tarea:
    nombre: str
    materia: str
    dias_restantes: int
    dificultad: Dificultad
    horas_estimadas: Optional[int] = None

# 2. Funcion Pura: Obtener peso usando Pattern Matching (match/case)
def obtener_peso_dificultad(dificultad: Dificultad) -> float:
    match dificultad:
        case Dificultad.ALTA:
            return 3.0
        case Dificultad.MEDIA:
            return 2.0
        case Dificultad.BAJA:
            return 1.0

# 3. Funcion Pura: Calcular el score numerico de prioridad
def calcular_prioridad(tarea: Tarea) -> float:
    peso = obtener_peso_dificultad(tarea.dificultad)
    horas = tarea.horas_estimadas if tarea.horas_estimadas is not None else 2
    return (peso * horas) / (tarea.dias_restantes + 0.1)

# 4. Funcion Pura: Generar recomendacion agentica basada en la tarea
def generar_razon(tarea: Tarea, score: float) -> str:
    if tarea.dias_restantes <= 1:
        return f"URGENTE. Vence en menos de 24 horas y tiene dificultad {tarea.dificultad.value}."
    elif score > 3.0:
        horas = tarea.horas_estimadas if tarea.horas_estimadas is not None else 2
        return f"IMPORTANTE. Requiere tiempo considerable ({horas} hrs estimadas)."
    else:
        return "MODERADO. Tarea corta con suficiente tiempo disponible."

# 5. Pipeline Funcional: Map, Filter y Sorted
def procesar_y_priorizar(tareas: List[Tarea]) -> List[Tuple[Tarea, float, str]]:
    evaluadas = map(lambda t: (t, calcular_prioridad(t), generar_razon(t, calcular_prioridad(t))), tareas)
    return sorted(evaluadas, key=lambda tuple_item: tuple_item[1], reverse=True)

# 6. Funcion Pura con HOF reduce: Calcular total de horas estimadas acumuladas
def calcular_tiempo_total_estimado(tareas: List[Tarea]) -> int:
    return reduce(lambda acum, t: acum + (t.horas_estimadas if t.horas_estimadas is not None else 2), tareas, 0)

# 7. Funcion Pura con HOF filter: Filtrar por dificultad
def filtrar_por_dificultad(tareas: List[Tarea], nivel: Dificultad) -> List[Tarea]:
    return list(filter(lambda t: t.dificultad == nivel, tareas))

# Execution Main
if __name__ == "__main__":
    print("========================================================")
    print("   ORGANIZADOR DE TAREAS - ENGINE FUNCIONAL (PYTHON)")
    print("========================================================\n")

    tareas_input = [
        Tarea("Investigacion", "Fisica", 5, Dificultad.BAJA, 2),
        Tarea("Examen", "POO", 1, Dificultad.ALTA, 4),
        Tarea("Proyecto", "Programacion Funcional", 3, Dificultad.MEDIA, 6),
        Tarea("Practica de Laboratorio", "Fisica", 2, Dificultad.ALTA, 3),
    ]

    agenda = procesar_y_priorizar(tareas_input)

    print("=== AGENDA RECOMENDADA POR EL SISTEMA ===\n")
    for pos, (tarea, score, razon) in enumerate(agenda, 1):
        print(f"[Prioridad {pos}] {tarea.nombre} - {tarea.materia} (Vence en {tarea.dias_restantes} dia(s) | Dificultad: {tarea.dificultad.value})")
        print(f"   -> Razon: {razon}\n")

    horas_totales = calcular_tiempo_total_estimado(tareas_input)
    print("--------------------------------------------------------")
    print(f"[STAT] Tiempo total estimado de estudio acumulado (reduce): {horas_totales} horas")

    altas = filtrar_por_dificultad(tareas_input, Dificultad.ALTA)
    print(f"[STAT] Tareas de Dificultad Alta (filter): {len(altas)} pendientes")
    print("--------------------------------------------------------\n")

    # Verification Asserts
    assert obtener_peso_dificultad(Dificultad.ALTA) == 3.0
    assert calcular_tiempo_total_estimado(tareas_input) == 15
    assert len(altas) == 2
    print("SUCCESS: All unit tests with assert passed successfully!")
