import * as CalendarioFB from "./funciones_moduloCalendario.js";

let calendario = document.querySelector('#calendario');
let contenedorEvento = document.querySelector('#contenedor-evento');
let btnRegresar = document.querySelector('#btnRegresar')

document.addEventListener('DOMContentLoaded', async function() {
    let eventos = await CalendarioFB.cargarCalendario();

    var calendarEl = document.getElementById('calendario');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: 'bootstrap5',
        height: '78vh',
        locale: 'es',
        initialView: 'dayGridWeek',
        headerToolbar: {
            left: 'title'
        },
        events: eventos,

        eventClick: async function(info) {
            mostrarEvento(info.event.id);
        }
    });
    calendar.render();
});

const mostrarEvento = async(id) => {
    let datosEvento = await CalendarioFB.cargarEvento(id);

    if (datosEvento.Tipo_evento == 1) {
        contenedorEvento.innerHTML = `
        <div class="contenedor-titulo-evento">
             <h1 class="titulo-evento">${datosEvento.Titulo}</h1>
             <p>Fecha: <span class="fecha-evento">${datosEvento.Fecha} </span></p>
         </div>

         <div class="contenedor-descripcion-evento">
             <h2>Descripción</h2>
             ${datosEvento.Descripcion}
         </div>
        `;
    } else if (datosEvento.Tipo_evento == 0) {
        let equipo_a = await CalendarioFB.cargarEquipo(datosEvento.Equipo_a);
        let equipo_b = await CalendarioFB.cargarEquipo(datosEvento.Equipo_b);

        contenedorEvento.innerHTML = `
        <div class="contenedor-titulo-evento">
             <h1 class="titulo-evento">${datosEvento.Titulo}</h1>
             <p>Fecha: <span class="fecha-evento">${datosEvento.Fecha} </span></p>
         </div>

         <div class="contenedor-equipos-evento">
             <div class="contenedor-equipo">
                 <img src="${equipo_a.Logotipo}" alt="${equipo_a.Nombre_completo}">
                 <p>${equipo_a.Nombre_completo}</p>
             </div>

             <div class="separador-equipos">
                 <h1>VS</h1>
             </div>

             <div class="contenedor-equipo">
                 <img src="${equipo_b.Logotipo}" alt="${equipo_b.Nombre_completo}">
                 <p>${equipo_b.Nombre_completo}</p>
             </div>
         </div>

         <div class="contenedor-descripcion-evento">
             <h2>Descripción</h2>
             ${datosEvento.Descripcion}
         </div>
 `;
    }
    calendario.classList.add('oculto');
    contenedorEvento.classList.remove('oculto');
    btnRegresar.classList.remove('oculto');
}

btnRegresar.addEventListener('click', () => {
    calendario.classList.remove('oculto');
    contenedorEvento.classList.add('oculto');
    btnRegresar.classList.add('oculto');
    contenedorEvento.innerHTML = '';
});