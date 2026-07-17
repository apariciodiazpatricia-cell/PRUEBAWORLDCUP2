/* ============================================================
   ESTADÍSTICAS DEL TORNEO - Full Stack FC (Equipo 3)
   Fuente de datos: https://www.football-data.org/  (API v4)
   ============================================================

   IMPORTANTE sobre la API:
   1. Necesitas una API Key gratuita: regístrate en
      https://www.football-data.org/client/register
      y pégala abajo en API_KEY.
   2. El plan gratuito tiene un límite de peticiones por minuto,
      así que evita recargar la página muchas veces seguidas.
   3. football-data.org puede bloquear peticiones hechas
      directamente desde el navegador (CORS). Si al abrir la
      consola ves un error de tipo "blocked by CORS policy",
      significa que el propio servidor no lo permite desde tu
      dominio. La solución típica es pasar la petición por un
      pequeño servidor propio (proxy) en vez de llamarla
      directamente desde el cliente. Mientras tanto, esta página
      muestra datos de ejemplo para que la tabla nunca quede
      vacía en una demo.
   ============================================================ */

const API_KEY = " cbddc1d1fa024ff5ac4432cc49a57bed";
const COMPETICION = "WC"; // Código de la Copa del Mundo en football-data.org
const BASE_URL = "https://api.football-data.org/v4";
const NUM_FILAS = 5; // cuántas filas mostrar en cada ranking

// Datos de respaldo por si la API falla o no hay conexión
const DATOS_EJEMPLO = {
  goleadores: [
    { nombre: "Jugador de ejemplo 1", equipo: "Selección A", goles: 8 },
    { nombre: "Jugador de ejemplo 2", equipo: "Selección B", goles: 7 },
    { nombre: "Jugador de ejemplo 3", equipo: "Selección C", goles: 6 },
  ],
  equiposGoleadores: [
    { equipo: "Selección A", goles: 15 },
    { equipo: "Selección B", goles: 13 },
    { equipo: "Selección C", goles: 11 },
  ],
  equiposEncajados: [
    { equipo: "Selección X", goles: 9 },
    { equipo: "Selección Y", goles: 7 },
    { equipo: "Selección Z", goles: 6 },
  ],
};

document.addEventListener("DOMContentLoaded", cargarEstadisticas);

async function cargarEstadisticas() {
  try {
    const [goleadores, tablaEquipos] = await Promise.all([
      obtenerMaximosGoleadores(),
      obtenerTablaClasificacion(),
    ]);

    pintarGoleadores(goleadores);
    pintarEquiposGoleadores(tablaEquipos);
    pintarEquiposEncajados(tablaEquipos);
  } catch (error) {
    console.error("Error al cargar estadísticas:", error);
    mostrarAviso(
      "No se han podido cargar los datos en directo (posible bloqueo CORS o límite de peticiones). Mostrando datos de ejemplo."
    );
    pintarGoleadores(DATOS_EJEMPLO.goleadores.map((g, i) => ({
      posicion: i + 1,
      nombre: g.nombre,
      equipo: g.equipo,
      goles: g.goles,
    })));
    pintarEquiposDesdeEjemplo();
  }
}

/* -------------------- Llamadas a la API -------------------- */

async function obtenerMaximosGoleadores() {
  const respuesta = await fetch(
    `${BASE_URL}/competitions/${COMPETICION}/scorers?limit=${NUM_FILAS}`,
    { headers: { "X-Auth-Token": API_KEY } }
  );

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al pedir goleadores`);
  }

  const datos = await respuesta.json();

  return datos.scorers.map((item, indice) => ({
    posicion: indice + 1,
    nombre: item.player.name,
    equipo: item.team.name,
    goles: item.goals,
  }));
}

async function obtenerTablaClasificacion() {
  const respuesta = await fetch(
    `${BASE_URL}/competitions/${COMPETICION}/standings`,
    { headers: { "X-Auth-Token": API_KEY } }
  );

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al pedir clasificación`);
  }

  const datos = await respuesta.json();

  // La Copa del Mundo se organiza por grupos, así que juntamos
  // todos los equipos de todos los grupos en una sola lista.
  const equipos = [];
  datos.standings.forEach((grupo) => {
    grupo.table.forEach((fila) => {
      equipos.push({
        equipo: fila.team.name,
        golesFavor: fila.goalsFor,
        golesContra: fila.goalsAgainst,
      });
    });
  });

  return equipos;
}

/* -------------------- Pintado en el DOM -------------------- */

function pintarGoleadores(lista) {
  const cuerpo = document.getElementById("tabla-goleadores");
  cuerpo.innerHTML = lista
    .map(
      (fila) => `
      <tr>
        <td>${fila.posicion}</td>
        <td>${fila.nombre}</td>
        <td>${fila.equipo}</td>
        <td>${fila.goles}</td>
      </tr>`
    )
    .join("");
}

function pintarEquiposGoleadores(equipos) {
  const ranking = [...equipos]
    .sort((a, b) => b.golesFavor - a.golesFavor)
    .slice(0, NUM_FILAS);

  const cuerpo = document.getElementById("tabla-equipos-goleadores");
  cuerpo.innerHTML = ranking
    .map(
      (fila, indice) => `
      <tr>
        <td>${indice + 1}</td>
        <td>${fila.equipo}</td>
        <td>${fila.golesFavor}</td>
      </tr>`
    )
    .join("");
}

function pintarEquiposEncajados(equipos) {
  const ranking = [...equipos]
    .sort((a, b) => b.golesContra - a.golesContra)
    .slice(0, NUM_FILAS);

  const cuerpo = document.getElementById("tabla-equipos-encajados");
  cuerpo.innerHTML = ranking
    .map(
      (fila, indice) => `
      <tr>
        <td>${indice + 1}</td>
        <td>${fila.equipo}</td>
        <td>${fila.golesContra}</td>
      </tr>`
    )
    .join("");
}

function pintarEquiposDesdeEjemplo() {
  const cuerpoGoleadores = document.getElementById("tabla-equipos-goleadores");
  cuerpoGoleadores.innerHTML = DATOS_EJEMPLO.equiposGoleadores
    .map(
      (fila, indice) => `
      <tr>
        <td>${indice + 1}</td>
        <td>${fila.equipo}</td>
        <td>${fila.goles}</td>
      </tr>`
    )
    .join("");

  const cuerpoEncajados = document.getElementById("tabla-equipos-encajados");
  cuerpoEncajados.innerHTML = DATOS_EJEMPLO.equiposEncajados
    .map(
      (fila, indice) => `
      <tr>
        <td>${indice + 1}</td>
        <td>${fila.equipo}</td>
        <td>${fila.goles}</td>
      </tr>`
    )
    .join("");
}

function mostrarAviso(texto) {
  const aviso = document.getElementById("mensaje-estado");
  aviso.textContent = texto;
  aviso.classList.remove("d-none");
}