import { db, collection, getDocs } from "./firebaseCore.js";
const calendario = document.getElementById('calendar');

document.addEventListener('DOMContentLoaded', async function() {
    // const querySnapshot = await getDocs(collection(db, "Calendario"));
    // renderCalendar(querySnapshot);
});

const renderCalendar = (datos) => {
    let eventos = [];
    datos.forEach((doc) => {
        eventos.push({ id: doc.id, title: doc.data().Titulo, start: doc.data().Fecha });
    });

    var calendar = new FullCalendar.Calendar(calendario, {
        initialView: 'dayGridMonth',
        selectable: true,
        locale: 'es',

        events: eventos,

        eventClick: function(info) {
            cargarEventoCalendario(info.event.id)
        }
    });
    calendar.render();
}

const cargarEventoCalendario = (id) => {

}