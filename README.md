# PRUEBAWORLDCUP2
# 👩🏻‍🦰 Hola, soy Patricia Aparicio

Bienvenido/a a mi repositorio.

Este espacio no pretende mostrar proyectos "perfectos". Al contrario, aquí quiero ir guardando mi camino como desarrolladora web, compartiendo cada paso que doy mientras aprendo, investigo y mejoro.

Cada proyecto que encontrarás aquí representa un momento de mi aprendizaje. Algunos estarán más completos que otros, algunos cambiarán con el tiempo y otros incluso serán reemplazados por versiones mejores. Y precisamente de eso trata este repositorio: de evolucionar.

<img width="1903" height="542" alt="image" src="https://github.com/user-attachments/assets/42703bb3-c712-41b0-8ea1-0f6d985cd933" />

<img width="1885" height="640" alt="image" src="https://github.com/user-attachments/assets/46559feb-2ca8-4785-90e3-676a5a0d7733" />
<img width="1886" height="664" alt="image" src="https://github.com/user-attachments/assets/36942671-6d40-49a2-9eea-156af18d81ef" />
<img width="1884" height="797" alt="image" src="https://github.com/user-attachments/assets/804e126e-c15d-458c-b850-7d5b31ca0629" />



## ❓ ¿Qué encontrarás aquí?

- Proyectos desarrollados durante mi formación.
- Prácticas personales.
- Experimentos con nuevas tecnologías.
- Investigaciones para resolver problemas concretos.
- Diferentes versiones de un mismo proyecto para ver su evolución.
- Código que refleja mi proceso de aprendizaje, no solo el resultado final.

Creo que aprender a programar no consiste únicamente en escribir código que funcione, sino también en investigar, equivocarse, probar diferentes soluciones y entender por qué una opción es mejor que otra.

Por eso este repositorio también es una forma de documentar ese proceso.

## 💻 Tecnologías con las que estoy trabajando

- HTML5
- CSS
- JavaScript
- Bootstrap
- Git y GitHub
- Vercel
- APIs REST

Y seguiré incorporando nuevas tecnologías a medida que continúe aprendiendo.

## 💯 Mi objetivo

Quiero que dentro de unos meses pueda volver a cualquiera de estos proyectos y ver todo lo que he avanzado.

Espero que quien visite este repositorio no solo vea el resultado final de cada aplicación, sino también el esfuerzo, la curiosidad y la evolución que hay detrás de cada línea de código.

## ⬇️ Puedes encontrarme aquí

**GitHub**  
👉 https://github.com/apariciodiazpatricia-cell

**Vercel**  
👉 https://vercel.com/apariciodiazpatricia-cells-projects

**LinkedIn**  
👉 https://www.linkedin.com/in/patriciaapariciodiaz

---

Gracias por dedicar unos minutos a visitar mi trabajo.

Si has llegado hasta aquí, espero que disfrutes viendo mi evolución tanto como yo estoy disfrutando del proceso de aprender y seguir creciendo como desarrolladora.

## 🔴📢NOTA TÉCNICA DE INVESTIGACIÓN DURANTE EL PROCESO

## ⚠️ ATENCIÓN — Fix: cálculo incorrecto de "Goles a favor / en contra" por equipo

**Fecha:** Julio 2026
**Archivo afectado:** `js/teamStatistics.js`
**Función afectada:** `obtenerTablaClasificacion()`

### El problema

La tabla "Equipos Más Goleadores" (y "Equipos con Más Goles Encajados") mostraba
números que no coincidían con la realidad del torneo. Por ejemplo, varias
selecciones aparecían empatadas a los mismos goles aunque en la vida real unas
hubieran anotado bastantes más en fases posteriores del Mundial.

### La causa

La función original pedía los datos al endpoint `/competitions/{id}/standings`
de la API de football-data.org. Este endpoint solo devuelve la clasificación
de la **fase de grupos** (partidos agrupados por grupo: A, B, C...). En cuanto
un equipo pasa a eliminatorias (octavos, cuartos, semis, final), esos partidos
ya no pertenecen a ningún grupo, así que la API deja de sumarlos en el
`standings`. Resultado: los goles de un equipo se quedaban "congelados" en el
total de sus 3 partidos de grupo, sin importar cuántos goles metiera después.

### La solución

Se sustituyó la llamada a `/standings` por una llamada a
`/competitions/{id}/matches`, que devuelve **todos** los partidos del torneo
(grupos + eliminatorias). La nueva función:

1. Filtra solo los partidos con `status === "FINISHED"`.
2. Recorre cada partido y suma los goles al equipo local y al visitante por
   igual (a favor y en contra).
3. Acumula los totales en un objeto usando el nombre del equipo como clave,
   para evitar duplicados.
4. Devuelve el resultado como array (`Object.values(...)`) para no romper el
   resto del código que ya esperaba ese formato.

### Lección para quien consulte esto

Al integrar una API de datos deportivos (o cualquier API con conceptos de
"temporada"/"fase"), **revisa siempre qué cubre exactamente cada endpoint**
antes de usarlo para un cálculo acumulado. Un endpoint de "clasificación" no
siempre incluye el torneo completo — puede estar limitado a una sub-fase
(grupo, liga regular, etc.). Cuando necesites un total real de principio a
fin, casi siempre es más fiable **calcularlo tú misma recorriendo los
partidos individuales**, en vez de confiar en un resumen ya calculado por la
API.