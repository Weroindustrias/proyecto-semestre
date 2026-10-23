# ============================================================================
# PRUEBAS UNITARIAS FORMALES - ORGANIZADOR DE TAREAS
# Materia : Programación Funcional (3er Semestre)
# Alumno  : Melvin Jaeen García Camacho
# Módulo  : unittest (biblioteca estándar de Python, no se instala nada)
# Ejecutar: python test_organizador.py
# ============================================================================

import unittest
from dataclasses import FrozenInstanceError
from organizador_tareas import (
    Dificultad,
    Tarea,
    obtener_peso_dificultad,
    calcular_prioridad,
    generar_razon,
    procesar_y_priorizar,
    calcular_tiempo_total_estimado,
    filtrar_por_dificultad,
)


# ─────────────────────────────────────────────────────────────────────────────
# GRUPO 1 — obtener_peso_dificultad  (pattern matching / función pura)
# ─────────────────────────────────────────────────────────────────────────────
class TestObtenerPesoDificultad(unittest.TestCase):

    def test_peso_alta_es_3(self):
        """Alta debe devolver exactamente 3.0"""
        self.assertEqual(obtener_peso_dificultad(Dificultad.ALTA), 3.0)

    def test_peso_media_es_2(self):
        """Media debe devolver exactamente 2.0"""
        self.assertEqual(obtener_peso_dificultad(Dificultad.MEDIA), 2.0)

    def test_peso_baja_es_1(self):
        """Baja debe devolver exactamente 1.0"""
        self.assertEqual(obtener_peso_dificultad(Dificultad.BAJA), 1.0)

    def test_alta_mayor_que_media(self):
        """El peso Alta siempre debe ser mayor que Media"""
        self.assertGreater(
            obtener_peso_dificultad(Dificultad.ALTA),
            obtener_peso_dificultad(Dificultad.MEDIA),
        )

    def test_media_mayor_que_baja(self):
        """El peso Media siempre debe ser mayor que Baja"""
        self.assertGreater(
            obtener_peso_dificultad(Dificultad.MEDIA),
            obtener_peso_dificultad(Dificultad.BAJA),
        )


# ─────────────────────────────────────────────────────────────────────────────
# GRUPO 2 — calcular_prioridad  (función pura / fórmula matemática)
# Fórmula: (peso × horas) / (dias + 0.1)
# ─────────────────────────────────────────────────────────────────────────────
class TestCalcularPrioridad(unittest.TestCase):

    def test_tarea_urgente_score_alto(self):
        """
        Alta=3.0, horas=4, dias=1 → (3.0×4)/(1+0.1) ≈ 10.909
        Una tarea difícil que vence mañana debe tener score > 10
        """
        tarea = Tarea("Examen", "POO", 1, Dificultad.ALTA, 4)
        self.assertGreater(calcular_prioridad(tarea), 10.0)

    def test_tarea_holgada_score_bajo(self):
        """
        Baja=1.0, horas=2, dias=5 → (1.0×2)/(5+0.1) ≈ 0.392
        Poca urgencia y poca dificultad → score < 1
        """
        tarea = Tarea("Investigación", "Física", 5, Dificultad.BAJA, 2)
        self.assertLess(calcular_prioridad(tarea), 1.0)

    def test_horas_none_usa_default_2(self):
        """
        Cuando horas_estimadas=None el sistema asume 2 horas.
        Tarea sin horas y tarea con Some(2) deben dar EXACTAMENTE el mismo score.
        """
        tarea_sin_horas = Tarea("Sin horas", "Álgebra", 3, Dificultad.MEDIA, None)
        tarea_con_dos   = Tarea("Con 2 hrs", "Álgebra", 3, Dificultad.MEDIA, 2)
        self.assertAlmostEqual(
            calcular_prioridad(tarea_sin_horas),
            calcular_prioridad(tarea_con_dos),
            places=9,
            msg="None debe comportarse igual que Some(2)",
        )

    def test_mayor_dificultad_mayor_score(self):
        """
        Con los mismos días y horas, Alta debe tener mayor score que Baja.
        Verifica que el peso de dificultad se multiplica correctamente.
        """
        alta = Tarea("T", "M", 3, Dificultad.ALTA,  4)
        baja = Tarea("T", "M", 3, Dificultad.BAJA,  4)
        self.assertGreater(calcular_prioridad(alta), calcular_prioridad(baja))

    def test_mayor_urgencia_mayor_score(self):
        """
        Con la misma dificultad y horas, menos días → mayor score.
        Verifica que el denominador (días + 0.1) funciona bien.
        """
        urgente  = Tarea("T", "M", 1, Dificultad.MEDIA, 3)
        holgado  = Tarea("T", "M", 7, Dificultad.MEDIA, 3)
        self.assertGreater(calcular_prioridad(urgente), calcular_prioridad(holgado))


# ─────────────────────────────────────────────────────────────────────────────
# GRUPO 3 — generar_razon  (función pura / lógica de clasificación)
# ─────────────────────────────────────────────────────────────────────────────
class TestGenerarRazon(unittest.TestCase):

    def test_razon_urgente_con_cero_dias(self):
        """días=0 → la razón SIEMPRE debe contener 'URGENTE'"""
        tarea = Tarea("Entrega", "Cálculo", 0, Dificultad.ALTA, 3)
        razon = generar_razon(tarea, calcular_prioridad(tarea))
        self.assertIn("URGENTE", razon)

    def test_razon_urgente_con_un_dia(self):
        """días=1 también es urgente (condición ≤ 1)"""
        tarea = Tarea("Tarea", "Física", 1, Dificultad.BAJA, 1)
        razon = generar_razon(tarea, calcular_prioridad(tarea))
        self.assertIn("URGENTE", razon)

    def test_razon_importante_score_alto(self):
        """
        Alta=3.0, horas=5, dias=2 → score ≈ 7.14 (> 3.0 y dias > 1)
        Debe contener 'IMPORTANTE'
        """
        tarea = Tarea("Proyecto", "POO", 2, Dificultad.ALTA, 5)
        score = calcular_prioridad(tarea)
        razon = generar_razon(tarea, score)
        self.assertIn("IMPORTANTE", razon)

    def test_razon_moderado_score_bajo(self):
        """
        Baja=1.0, horas=1, dias=10 → score ≈ 0.099 (≤ 3.0 y dias > 1)
        Debe contener 'MODERADO'
        """
        tarea = Tarea("Lectura", "Historia", 10, Dificultad.BAJA, 1)
        score = calcular_prioridad(tarea)
        razon = generar_razon(tarea, score)
        self.assertIn("MODERADO", razon)


# ─────────────────────────────────────────────────────────────────────────────
# GRUPO 4 — procesar_y_priorizar  (pipeline: map + sorted)
# ─────────────────────────────────────────────────────────────────────────────
class TestProcesarYPriorizar(unittest.TestCase):

    def setUp(self):
        """Crea la lista base una sola vez para todos los tests del grupo"""
        self.tareas = [
            Tarea("Investigación", "Física",                5, Dificultad.BAJA,  2),
            Tarea("Examen",        "POO",                   1, Dificultad.ALTA,  4),
            Tarea("Proyecto",      "Programación Funcional", 3, Dificultad.MEDIA, 6),
        ]

    def test_primer_elemento_es_el_mas_urgente(self):
        """El Examen (Alta/1 día) debe quedar en posición 0 (mayor prioridad)"""
        agenda = procesar_y_priorizar(self.tareas)
        self.assertEqual(agenda[0][0].nombre, "Examen")

    def test_pipeline_devuelve_todos_los_elementos(self):
        """El pipeline no descarta ningún elemento: len entrada = len salida"""
        agenda = procesar_y_priorizar(self.tareas)
        self.assertEqual(len(agenda), len(self.tareas))

    def test_pipeline_orden_descendente_de_scores(self):
        """Los scores deben estar en orden DESCENDENTE (mayor a menor)"""
        agenda = procesar_y_priorizar(self.tareas)
        scores = [item[1] for item in agenda]
        self.assertEqual(scores, sorted(scores, reverse=True))

    def test_pipeline_lista_vacia_no_falla(self):
        """Con una lista vacía el resultado debe ser también una lista vacía"""
        resultado = procesar_y_priorizar([])
        self.assertEqual(resultado, [])


# ─────────────────────────────────────────────────────────────────────────────
# GRUPO 5 — calcular_tiempo_total_estimado  (HOF: reduce / fold)
# ─────────────────────────────────────────────────────────────────────────────
class TestCalcularTiempoTotal(unittest.TestCase):

    def test_suma_correcta_de_horas(self):
        """2 + 4 + 6 + 3 = 15 horas en total"""
        tareas = [
            Tarea("A", "M", 5, Dificultad.BAJA,  2),
            Tarea("B", "M", 1, Dificultad.ALTA,  4),
            Tarea("C", "M", 3, Dificultad.MEDIA, 6),
            Tarea("D", "M", 2, Dificultad.ALTA,  3),
        ]
        self.assertEqual(calcular_tiempo_total_estimado(tareas), 15)

    def test_horas_none_cuenta_como_2(self):
        """Una tarea con horas=None aporta 2 al total (valor por defecto)"""
        tareas = [
            Tarea("Con horas",  "M", 3, Dificultad.MEDIA, 5),
            Tarea("Sin horas",  "M", 3, Dificultad.MEDIA, None),  # None → 2
        ]
        self.assertEqual(calcular_tiempo_total_estimado(tareas), 7)

    def test_lista_vacia_devuelve_cero(self):
        """reduce con lista vacía y acumulador 0 debe devolver 0"""
        self.assertEqual(calcular_tiempo_total_estimado([]), 0)


# ─────────────────────────────────────────────────────────────────────────────
# GRUPO 6 — filtrar_por_dificultad  (HOF: filter)
# ─────────────────────────────────────────────────────────────────────────────
class TestFiltrarPorDificultad(unittest.TestCase):

    def setUp(self):
        self.tareas = [
            Tarea("A", "M", 2, Dificultad.ALTA,  3),
            Tarea("B", "M", 3, Dificultad.MEDIA, 2),
            Tarea("C", "M", 1, Dificultad.ALTA,  4),
            Tarea("D", "M", 5, Dificultad.BAJA,  1),
        ]

    def test_filtra_correctamente_altas(self):
        """De 4 tareas, 2 son Alta → debe devolver exactamente 2"""
        altas = filtrar_por_dificultad(self.tareas, Dificultad.ALTA)
        self.assertEqual(len(altas), 2)

    def test_filtra_correctamente_baja(self):
        """Solo 1 tarea es Baja → lista de un elemento"""
        bajas = filtrar_por_dificultad(self.tareas, Dificultad.BAJA)
        self.assertEqual(len(bajas), 1)

    def test_resultado_solo_contiene_la_dificultad_pedida(self):
        """Todos los elementos filtrados deben tener la dificultad solicitada"""
        medias = filtrar_por_dificultad(self.tareas, Dificultad.MEDIA)
        for t in medias:
            self.assertEqual(t.dificultad, Dificultad.MEDIA)

    def test_sin_coincidencias_devuelve_lista_vacia(self):
        """Si no hay tareas de ese nivel, devuelve lista vacía (no None ni error)"""
        solo_altas = [Tarea("X", "M", 1, Dificultad.ALTA, 2)]
        resultado  = filtrar_por_dificultad(solo_altas, Dificultad.BAJA)
        self.assertEqual(resultado, [])


# ─────────────────────────────────────────────────────────────────────────────
# GRUPO 7 — Inmutabilidad Formal (Leyes de Inmutabilidad en PF)
# ─────────────────────────────────────────────────────────────────────────────
class TestInmutabilidad(unittest.TestCase):

    def test_tarea_es_inmutable_no_permite_modificar_atributos(self):
        """Tarea(frozen=True) no debe permitir mutación de sus atributos"""
        tarea = Tarea("Cálculo", "Matemáticas", 3, Dificultad.ALTA, 4)
        with self.assertRaises(FrozenInstanceError):
            tarea.dias_restantes = 1  # Intento de mutación destructiva

    def test_tarea_no_permite_modificar_nombre(self):
        """Comprueba que el nombre es inmutable tras la instanciación"""
        tarea = Tarea("Proyecto", "POO", 2, Dificultad.MEDIA, 2)
        with self.assertRaises(FrozenInstanceError):
            tarea.nombre = "Nuevo Nombre"

    def test_procesar_no_muta_la_lista_original(self):
        """procesar_y_priorizar no debe alterar la colección original (No efectos colaterales)"""
        tareas_originales = [
            Tarea("Investigación", "Física", 5, Dificultad.BAJA, 2),
            Tarea("Examen", "POO", 1, Dificultad.ALTA, 4),
        ]
        copia_referencia = list(tareas_originales)
        procesar_y_priorizar(tareas_originales)
        self.assertEqual(
            tareas_originales,
            copia_referencia,
            "La lista de entrada no debe sufrir mutaciones destructivas in-place",
        )

    def test_filtrar_no_muta_la_lista_original(self):
        """filtrar_por_dificultad debe retornar una nueva colección sin alterar la original"""
        tareas = [
            Tarea("A", "M", 2, Dificultad.ALTA, 3),
            Tarea("B", "M", 3, Dificultad.MEDIA, 2),
        ]
        copia = list(tareas)
        _ = filtrar_por_dificultad(tareas, Dificultad.ALTA)
        self.assertEqual(tareas, copia)


# ─────────────────────────────────────────────────────────────────────────────
# GRUPO 8 — Transparencia Referencial y Determinismo Estricto
# ─────────────────────────────────────────────────────────────────────────────
class TestTransparenciaReferencial(unittest.TestCase):

    def test_transparencia_referencial_calcular_prioridad(self):
        """Llamar a calcular_prioridad N veces con argumentos idénticos siempre produce el mismo valor"""
        tarea = Tarea("Examen Final", "Redes", 2, Dificultad.ALTA, 5)
        primer_resultado = calcular_prioridad(tarea)
        for _ in range(10):
            self.assertEqual(calcular_prioridad(tarea), primer_resultado)

    def test_transparencia_referencial_obtener_peso(self):
        """obtener_peso_dificultad carece de estado interno y produce resultados deterministas"""
        self.assertEqual(obtener_peso_dificultad(Dificultad.ALTA), 3.0)
        self.assertEqual(obtener_peso_dificultad(Dificultad.ALTA), 3.0)

    def test_sustitucion_referencial_expresion_por_valor(self):
        """En PF, f(x) puede sustituirse directamente por su valor calculado sin alterar el programa"""
        tarea = Tarea("T", "M", 1, Dificultad.ALTA, 2)
        score_directo = (3.0 * 2) / (1 + 0.1)
        score_funcion = calcular_prioridad(tarea)
        self.assertAlmostEqual(score_directo, score_funcion, places=9)


# ─────────────────────────────────────────────────────────────────────────────
# GRUPO 9 — Casos de Borde (Edge Cases) y Robustez Matemática
# ─────────────────────────────────────────────────────────────────────────────
class TestCasosDeBorde(unittest.TestCase):

    def test_cero_dias_no_causa_division_por_cero(self):
        """Cuando dias_restantes=0, el factor epsilon (+0.1) previene ZeroDivisionError"""
        tarea = Tarea("Entrega Inmediata", "Sistemas", 0, Dificultad.ALTA, 2)
        score = calcular_prioridad(tarea)
        self.assertAlmostEqual(score, (3.0 * 2) / 0.1, places=9)

    def test_frontera_score_tres_exacto_clasifica_moderado(self):
        """Si score == 3.0 y dias > 1, la condición estricta score > 3.0 no se cumple, clasificando como MODERADO"""
        tarea = Tarea("Tarea Frontera", "Materia", 2, Dificultad.MEDIA, 3)
        razon = generar_razon(tarea, 3.0)
        self.assertIn("MODERADO", razon)

    def test_frontera_score_ligeramente_mayor_a_tres_clasifica_importante(self):
        """Si score = 3.01 y dias > 1, debe clasificar como IMPORTANTE"""
        tarea = Tarea("Tarea Frontera", "Materia", 2, Dificultad.MEDIA, 3)
        razon = generar_razon(tarea, 3.01)
        self.assertIn("IMPORTANTE", razon)

    def test_estabilidad_con_tareas_de_igual_prioridad(self):
        """Tareas con igual prioridad no causan fallas ni inconsistencias en el pipeline"""
        t1 = Tarea("T1", "M", 3, Dificultad.MEDIA, 2)
        t2 = Tarea("T2", "M", 3, Dificultad.MEDIA, 2)
        agenda = procesar_y_priorizar([t1, t2])
        self.assertEqual(len(agenda), 2)
        self.assertAlmostEqual(agenda[0][1], agenda[1][1], places=9)


# ─────────────────────────────────────────────────────────────────────────────
# GRUPO 10 — Composición Funcional (Filter + Reduce)
# ─────────────────────────────────────────────────────────────────────────────
class TestComposicionFuncional(unittest.TestCase):

    def test_composicion_filter_y_reduce_horas_por_dificultad(self):
        """Composición declarativa: filtrar tareas Alta y reducir para obtener solo sus horas acumuladas"""
        tareas = [
            Tarea("T1", "M", 2, Dificultad.ALTA, 4),
            Tarea("T2", "M", 3, Dificultad.BAJA, 2),
            Tarea("T3", "M", 1, Dificultad.ALTA, 3),
        ]
        altas = filtrar_por_dificultad(tareas, Dificultad.ALTA)
        horas_altas = calcular_tiempo_total_estimado(altas)
        self.assertEqual(horas_altas, 7)  # 4 + 3 = 7

    def test_reduccion_con_un_solo_elemento(self):
        """calcular_tiempo_total_estimado con un único elemento retorna sus horas sin fallas de base"""
        tareas = [Tarea("Única", "M", 3, Dificultad.MEDIA, 5)]
        self.assertEqual(calcular_tiempo_total_estimado(tareas), 5)


# ─────────────────────────────────────────────────────────────────────────────
# PUNTO DE ENTRADA: python test_organizador.py
# ─────────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # verbosity=2 muestra el nombre y resultado de cada test individual
    unittest.main(verbosity=2)
