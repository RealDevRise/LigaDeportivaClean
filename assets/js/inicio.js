import { db, collection, ref, storage, doc, getDocs, query, getDownloadURL, orderBy, limit, where, getDoc } from "./firebaseCore.js";

const carousel_noticias_principales = document.getElementById("carousel_noticias_principales");
const contenedorNoticias = document.getElementById("contenedorNoticias");
const select_calendario = document.getElementById("cb_calendario");
const contenedor_partidas = document.getElementById("contenedor_tarjeta_partidas");
const contenedor_equipos = document.getElementById("contendor_tarjeta_equipos");
const contenedor_patrocinadores = document.getElementById("contenedor_slider_patrocinadores");
const contenedor_tarjetaPartidas = document.getElementById("wrapper-tarjetaResultados");

let index_calendario = 0;


document.addEventListener('DOMContentLoaded', async function() {
    cargarNoticiasCarousel();
    cargarNoticias();
    cargarCalendario();
    cargarEquipos();
    cargarPatrocinadores();
    cargarResultados();
});

const cargarPatrocinadores = async() => {
    const consulta = query(collection(db, "Patrocinadores"));

    await getDocs(consulta).then((doc) => {
        doc.docs.forEach((item) => {
            contenedor_patrocinadores.innerHTML += `
            <div class="swiper-slide swiper--patrocinador">
                <img src="${item.data().Logotipo}" alt="${item.data().Nombre}">
            </div>
            `;
        });
    });
}

const cargarNoticiasCarousel = async() => {
    const consulta = query(collection(db, "Noticias"),
        where("Header", "==", true),
        orderBy("Fecha_publicacion", "desc")
    );

    await getDocs(consulta).then((doc) => {
        doc.docs.forEach((item) => {
            carousel_noticias_principales.innerHTML += `
            <div class="swiper-slide swiper--cabezal">
                <img src="${item.data().Imagen_cabecera}" alt="${item.data().Titulo}">
                <div class="text--block">
                    <h1>${item.data().Titulo}</h1>
                    <p>${item.data().Descripcion_breve}</p>
                    <div><button onclick="irNoticia('${item.id}')" class="boton boton-primary" style="margin-top:15px; width:20%;">Ver Noticia</button></div>
                </div>
            </div>
            `;
        });
    });
}

const cargarNoticias = async() => {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    const consulta = query(collection(db, "Noticias"),
        where("Header", "==", false),
        orderBy("Fecha_publicacion", "desc"),
        limit(6)
    );

    await getDocs(consulta).then((doc) => {
        doc.docs.forEach(async(item) => {
            contenedorNoticias.innerHTML += `
            <div class="tarjeta--noticia">
               <a href="/noticias/${item.id}"><img src="${item.data().Imagen_cabecera}" alt="${item.data().Titulo}"></a>
               <div class="noticia-text-block">
                  <p class="fecha--noticia">${item.data().Fecha_publicacion.toDate().toLocaleDateString("es-MX", options)}</p>
                  <a href="#">
                     <p class="titulo--noticia">${item.data().Titulo}</p>
                     <p class="descripcion--noticia">${item.data().Descripcion_breve}</p>
                  </a>
                </div>
            </div>`;
        });
    });
}

const cargarResultados = async() => {
    let options = { weekday: 'short', month: 'short', day: 'numeric' };
    const consulta = query(collection(db, "Compilacion"),
        orderBy("fecha_partida", "desc"),
        limit(10)
    );

    await getDocs(consulta).then((doc) => {
        doc.docs.forEach(async(item) => {
            let divTarjeta = document.createElement("div");
            divTarjeta.setAttribute("class", "tarjeta");

            let spanFechaPartida = document.createElement("span");
            spanFechaPartida.classList.add("partida--fecha");
            spanFechaPartida.innerHTML = item.data().fecha_partida.toDate().toLocaleDateString("es-MX", options);
            divTarjeta.appendChild(spanFechaPartida);

            let divResultadosTarjeta = document.createElement("div");
            divResultadosTarjeta.classList.add("resultados");

            let divResultadoRowLocal = document.createElement("div");
            divResultadoRowLocal.classList.add("resultado-row");

            let data_equipo_local = await obtenerDatosEquipo(item.data().equipo_local);
            let imgLocal = document.createElement("img");
            imgLocal.setAttribute("src", data_equipo_local.data().Logotipo);
            divResultadoRowLocal.appendChild(imgLocal);

            let spanNombreLocal = document.createElement("span");
            spanNombreLocal.classList.add("equipo--nombre");
            spanNombreLocal.innerHTML = data_equipo_local.data().Nombre_corto;
            divResultadoRowLocal.appendChild(spanNombreLocal);

            let spanScoreLocal = document.createElement("span");
            spanScoreLocal.classList.add("equipo--score");
            spanScoreLocal.innerHTML = item.data().carreras_equipo_local;
            divResultadoRowLocal.appendChild(spanScoreLocal);

            divResultadosTarjeta.appendChild(divResultadoRowLocal);

            let divResultadoRowVisita = document.createElement("div");
            divResultadoRowVisita.classList.add("resultado-row");

            let data_equipo_visita = await obtenerDatosEquipo(item.data().equipo_visita);
            let imgVisita = document.createElement("img");
            imgVisita.setAttribute("src", data_equipo_visita.data().Logotipo);
            divResultadoRowVisita.appendChild(imgVisita);

            let spanNombreVisita = document.createElement("span");
            spanNombreVisita.classList.add("equipo--nombre");
            spanNombreVisita.innerHTML = data_equipo_visita.data().Nombre_corto;
            divResultadoRowVisita.appendChild(spanNombreVisita);

            let spanScoreVisita = document.createElement("span");
            spanScoreVisita.classList.add("equipo--score");
            spanScoreVisita.innerHTML = item.data().carreras_equipo_visita;
            divResultadoRowVisita.appendChild(spanScoreVisita);

            divResultadosTarjeta.appendChild(divResultadoRowVisita);

            divTarjeta.appendChild(divResultadosTarjeta);
            contenedor_tarjetaPartidas.appendChild(divTarjeta);
        });
    });
}

const cargarCalendario = async() => {
    contenedor_partidas.innerHTML = "";

    let diaInicio = new Date();
    diaInicio.setHours(0, 0, 0);

    let diaFin = new Date();
    diaFin.setDate(diaFin.getDate() + 7);
    diaFin.setHours(0, 0, 0);

    index_calendario = 0;

    let consultaCalendario = query(collection(db, "Calendario"),
        where("Fecha", ">=", diaInicio),
        orderBy("Fecha", "asc")
    );

    const docSnap = await getDocs(consultaCalendario);

    if (docSnap.docs.length > 0) {
        for (const doc of docSnap.docs) {
            if (index_calendario <= 6)
                await getCalendario(doc);

        }
    }
}

const cargarEquipos = async() => {
    const consulta = query(collection(db, "Equipos"));

    await getDocs(consulta).then((doc) => {
        doc.docs.forEach((item) => {

            let divWrapper = document.createElement("div");
            divWrapper.setAttribute("class", "swiper-slide slider-wrapper-team");

            let img_front = document.createElement("img");
            img_front.setAttribute("class", "front-logo-team");
            img_front.setAttribute("src", item.data().Logotipo);
            img_front.setAttribute("alt", item.data().Nombre_completo);

            let img_bg = document.createElement("img");
            img_bg.setAttribute("class", "background-team");
            img_bg.setAttribute("src", item.data().Logotipo);
            img_bg.setAttribute("alt", item.data().Nombre_completo);

            divWrapper.appendChild(img_front);
            divWrapper.appendChild(img_bg);

            contenedor_equipos.appendChild(divWrapper);



            // contenedor_equipos.innerHTML += `
            // <div class="swiper-slide slider-wrapper-team">
            //     <img class="front-logo-team" src="${item.data().Logotipo}" alt="${item.data().Nombre_completo}">
            //     <img class="background-team" src="${item.data().Logotipo}" alt="${item.data().Nombre_completo}">
            // </div>
            // `;
        });
    });
}

const getCalendario = async(doc) => {

    const options = { month: 'long', day: 'numeric' };
    let valorFecha = doc.data().Fecha.toDate().toLocaleDateString("es-MX");
    let displayFecha = doc.data().Fecha.toDate().toLocaleDateString("es-MX", options);

    if (!select_calendario.querySelector('[value="' + valorFecha + '"]')) {
        if (index_calendario == 0) {
            // Cargar las partidas default //
            let diaInicio = new Date(doc.data().Fecha.toDate());
            diaInicio.setHours(0, 0, 0);
            let diaFin = new Date(doc.data().Fecha.toDate());
            diaFin.setHours(23, 59, 59);

            let consulta = query(collection(db, "Calendario"),
                where("Fecha", ">", diaInicio),
                where("Fecha", "<", diaFin)
            );

            const docSnap = await getDocs(consulta);

            if (docSnap.docs.length > 0) {
                // Agregar tarjeta de partida //
                docSnap.forEach(doc => {
                    if (doc.data().Tipo_evento == 0)
                        armarTarjetaPartida(doc.id, doc.data().Equipo_a, doc.data().Equipo_b, doc.data().Fecha.toDate().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }));
                    else if (doc.data().Tipo_evento == 1)
                        armarTarjetaGeneral(doc.data().Titulo, doc.data().Descripcion, doc.data().Fecha.toDate().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }));

                });
            }
        }

        let opcion = document.createElement("option");
        opcion.value = valorFecha;
        opcion.innerHTML = displayFecha;
        select_calendario.appendChild(opcion);
        index_calendario++;
    }


}

const armarTarjetaGeneral = async(titulo, descripcion, hora) => {
    contenedor_partidas.innerHTML += `
    <div class="swiper-slide resultados--mobile">
        <button type="button" class="wrapper--tarjeta btn-transparente" disabled>
        <div class="tarjeta">
            <span class="partida--fecha">${hora}</span>
            <div class="resultados">
                <div class="resultado-row evento-row">
                    <span class="titulo-evento-card">${titulo} </span>
                </div>
                
            </div>
        </div>
        </button>
    </div>
    `;
}

const armarTarjetaPartida = async(id, equipo_a, equipo_b, hora) => {
    //Obtener nombre de los equipos //
    const doc_equipo_a = doc(db, "Equipos", equipo_a);
    const docSnap_a = await getDoc(doc_equipo_a);
    let nombre_equipo_a = "Undefined";

    const doc_equipo_b = doc(db, "Equipos", equipo_b);
    const docSnap_b = await getDoc(doc_equipo_b);
    let nombre_equipo_b = "Undefined";

    if (docSnap_a.exists())
        nombre_equipo_a = docSnap_a.data().Nombre_completo;

    if (docSnap_b.exists())
        nombre_equipo_b = docSnap_b.data().Nombre_completo;


    contenedor_partidas.innerHTML += `
    <div class="swiper-slide resultados--mobile">
        <button type="button" class="wrapper--tarjeta btn-transparente" disabled>
        <div class="tarjeta">
            <span class="partida--fecha">${hora}</span>
            <div class="resultados">
                <div class="resultado-row">
                    <img src="${docSnap_a.data().Logotipo}" alt="${nombre_equipo_a} ">
                    <span class="equipo--nombre">${nombre_equipo_a}</span>
                </div>
                <div class="resultado-row">
                    <img src="${docSnap_b.data().Logotipo} " alt="${nombre_equipo_b}">
                    <span class="equipo--nombre">${nombre_equipo_b} </span>
                </div>
            </div>
        </div>
        </button>
    </div>
    `;
}

const CargarSeleccionFechaCalendario = async(fecha) => {
    let diaInicio = new Date(fecha);
    diaInicio.setHours(0, 0, 0);

    let diaFin = new Date(fecha);
    diaFin.setHours(23, 59, 59);

    let consulta = query(collection(db, "Calendario"),
        where("Fecha", ">", diaInicio),
        where("Fecha", "<", diaFin)
    );

    const docSnap = await getDocs(consulta);

    if (docSnap.docs.length > 0) {
        // Agregar tarjeta de partidas //
        contenedor_partidas.innerHTML = "";
        docSnap.forEach(doc => {
            armarTarjetaPartida(doc.id, doc.data().Equipo_a, doc.data().Equipo_b, doc.data().Fecha.toDate().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }));
        });
    }
}

const obtenerDatosEquipo = async(id) => {
    const docRef = doc(db, "Equipos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
        return docSnap;
    else
        return null;
}

// Boton para ir al módulo de noticias //
document.getElementById("btn_masNoticias").addEventListener("click", () => {
    window.location.replace('/noticias.html');
});

select_calendario.addEventListener('change', (event) => {
    /*
    Orden del arrayFecha:
    [0] = Día
    [1] = Mes
    [2] = Año
    */
    let arrayFecha = event.target.value.split('/');
    let fechaSeleccionada = new Date(arrayFecha[2], arrayFecha[1] - 1, arrayFecha[0]);
    CargarSeleccionFechaCalendario(fechaSeleccionada);

});