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

### 1. Para ver la aplicación web interactiva
1. Navega a la carpeta principal del proyecto.
2. Haz doble clic en el archivo `index.html`.
3. Esto abrirá la aplicación directamente en tu navegador por defecto, funcionando localmente de forma inmediata con toda la persistencia de datos activa.

### 2. Para correr las Pruebas Unitarias del Motor Funcional
**En Python:**
Abre una terminal en esta carpeta y ejecuta:
```bash
python test_organizador.py
```
*(Comprobarás que los 25 tests de aserciones de funciones puras pasan exitosamente).*

## 📖 Documentación Complementaria

Te invito a consultar los siguientes documentos que he preparado, donde desgloso pedagógicamente el trabajo realizado y las matemáticas detrás de mi código:

* 📘 [Explicación del Código y Guía Pedagógica](./explicacion_codigo.md): Explicación línea por línea del porqué estructural del software y sus fórmulas.
* 📝 [Bitácora y Resumen de Cambios](./resumen_cambios_proyecto.md): Evolución iterativa del proyecto.

---

*«Enfócate en una sola función pura a la vez: sin efectos secundarios y sin mutar tu atención.»*
