import * as stats from "./coreEstadisticas.js";
const tablaMobile = document.getElementById("tabla-mobile");
const modoJugador = document.getElementById("btnModo_Jugador");
const modoEquipo = document.getElementById("btnModo_Equipo");
const filtroBateo = document.getElementById("btnFiltro_Bateo");
const filtroPitcheo = document.getElementById("btnFiltro_Pitcheo");
const contenedorRoles = document.getElementById("contenedor-seleccion-rol");
const dropdownTemporada = document.getElementById("dropdownTemporada");
const dropdownCategoria = document.getElementById("dropdownCategoria");
const dropdownEquipo = document.getElementById("dropdownEquipo");
const menuTemporada = document.getElementById("menu-temporada");
const menuCategoria = document.getElementById("menu-categoria");
const menuEquipo = document.getElementById("menu-equipo");
const btnRestablecer = document.getElementById("btnRestablecer");

const tablaBateoPC = document.getElementById("tabla-pc-bateo");
const tbodyPcBateo = document.getElementById("tbody-pc-bateo");
const columnaJugador = document.getElementById("col-jugador-pc");

const tablaBateoMobile = document.getElementById("tabla-mobile-bateo");
const tbodyMobileBateo = document.getElementById("tbody-mobile-bateo");

const tablaPitcheoPC = document.getElementById("tabla-pc-pitcheo");
const tbodyPitcheoPC = document.getElementById("tbody-pc-pitcheo");

const tablaPitcheoMobile = document.getElementById("tabla-mobile-pitcheo");
const tbodyPitcheoMobile = document.getElementById("tbody-mobile-pitcheo");

const btnCargarMasData = document.getElementById("btnCargarMasDatos");

let filtro_temporada = "";
let filtro_categoria = "";
let filtro_equipo = "";
let modoStats = "jugador";
let modoRol = "bateo";



document.addEventListener('DOMContentLoaded', async function() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    await cargaFiltrado();
    await cargaInicial_Jugador();
});

modoJugador.addEventListener('click', async() => {


    if (!modoJugador.classList.contains('btnActivo')) {
        columnaJugador.classList.remove("hide");
        modoJugador.classList.add('btnActivo');
        modoEquipo.classList.remove('btnActivo');
        contenedorRoles.classList.remove("hide");
        modoStats = "jugador";

        tablaBateoPC.classList.remove("hide");
        tablaBateoMobile.classList.remove("hide");
        tablaPitcheoPC.classList.add("hide");
        tablaPitcheoMobile.classList.add("hide");
        filtroBateo.classList.add('rolActivo');
        filtroPitcheo.classList.remove('rolActivo');
        modoRol = "bateo";

        btnRestablecer.classList.add("hide");
        dropdownTemporada.innerHTML = "Temporada";
        dropdownTemporada.value = "";
        dropdownCategoria.innerHTML = "Categoria";
        dropdownCategoria.value = "";
        dropdownEquipo.innerHTML = "Equipo";
        dropdownEquipo.value = "";
        btnCargarMasData.disabled = false;
        btnCargarMasData.innerHTML = "Cargar mas";
        let data = await stats.lectura_jugadores_individuales_nuevo(dropdownTemporada.value, dropdownCategoria.value, dropdownEquipo.value, modoRol);
        await armarTabla(data);
    }


});

modoEquipo.addEventListener('click', async() => {
    if (!modoEquipo.classList.contains('btnActivo')) {
        modoJugador.classList.remove('btnActivo');
        modoEquipo.classList.add('btnActivo');
        contenedorRoles.classList.add("hide");
        modoStats = "equipo";
        btnCargarMasData.disabled = false;
        btnCargarMasData.innerHTML = "Cargar mas";

        btnRestablecer.classList.add("hide");
        dropdownTemporada.innerHTML = "Temporada";
        dropdownTemporada.value = "";
        dropdownCategoria.innerHTML = "Categoria";
        dropdownCategoria.value = "";
        dropdownEquipo.innerHTML = "Equipo";
        dropdownEquipo.value = "";
        btnCargarMasData.disabled = false;
        btnCargarMasData.innerHTML = "Cargar mas";

        columnaJugador.classList.add("hide");

        let data = await stats.lectura_equipo_nuevo(dropdownTemporada.value, dropdownCategoria.value, dropdownEquipo.value);
        await armarTabla(data);
    }
});

filtroBateo.addEventListener("click", async() => {
    tablaBateoPC.classList.remove("hide");
    tablaBateoMobile.classList.remove("hide");
    tablaPitcheoPC.classList.add("hide");
    tablaPitcheoMobile.classList.add("hide");
    filtroBateo.classList.add('rolActivo');
    filtroPitcheo.classList.remove('rolActivo');
    modoRol = "bateo";
    btnCargarMasData.disabled = false;
    btnCargarMasData.innerHTML = "Cargar mas";
    let data = await stats.lectura_jugadores_individuales_nuevo(dropdownTemporada.value, dropdownCategoria.value, dropdownEquipo.value, modoRol);
    await armarTabla(data);
});

filtroPitcheo.addEventListener("click", async() => {
    tablaBateoPC.classList.add("hide");
    tablaBateoMobile.classList.add("hide");
    tablaPitcheoPC.classList.remove("hide");
    tablaPitcheoMobile.classList.remove("hide");
    filtroBateo.classList.remove('rolActivo');
    filtroPitcheo.classList.add('rolActivo');
    modoRol = "pitcheo";
    btnCargarMasData.disabled = false;
    btnCargarMasData.innerHTML = "Cargar mas";
    let data = await stats.lectura_jugadores_individuales_nuevo(dropdownTemporada.value, dropdownCategoria.value, dropdownEquipo.value, modoRol);
    await armarTabla(data);
});

btnRestablecer.addEventListener("click", async() => {
    // Consultar todos los jugadores //
    btnRestablecer.classList.add("hide");
    dropdownTemporada.innerHTML = "Temporada";
    dropdownTemporada.value = "";
    dropdownCategoria.innerHTML = "Categoria";
    dropdownCategoria.value = "";
    dropdownEquipo.innerHTML = "Equipo";
    dropdownEquipo.value = "";
    btnCargarMasData.disabled = false;
    btnCargarMasData.innerHTML = "Cargar mas";

    let data = null;
    if (modoStats == "jugador") {
        data = await stats.lectura_jugadores_individuales_nuevo(dropdownTemporada.value, dropdownCategoria.value, dropdownEquipo.value, modoRol);
    } else if (modoStats == "equipo") {
        data = await stats.lectura_equipo_nuevo(dropdownTemporada.value, dropdownCategoria.value, dropdownEquipo.value);
    }

    await armarTabla(data);

});

btnCargarMasData.addEventListener("click", async() => {
    if (modoStats == "jugador") {
        let data = await stats.lectura_jugadores_individuales_actual(dropdownTemporada.value, dropdownCategoria.value, dropdownEquipo.value, modoRol);
        let contarTabla = 0;

        if (modoRol == "bateo")
            contarTabla = tbodyPcBateo.children.length;
        else
            contarTabla = tbodyPitcheoPC.children.length;

        await agregarDatosTabla(data, contarTabla);
    } else if (modoStats == "equipo") {
        let data = await stats.lectura_equipo_actual(dropdownTemporada.value, dropdownCategoria.value, dropdownEquipo.value);
        let contarTabla = tbodyPcBateo.children.length;

        await agregarDatosTabla(data, contarTabla);
    }
});


const agregarDatosTabla = async(datos, numero) => {
    if (datos != null) {
        let contador = numero;
        datos.forEach(doc => {
            if (modoStats == "jugador") {
                if (modoRol == "bateo") {

                    if (doc.data().nombre_equipo != "") {

                        contador++;
                        tbodyMobileBateo.innerHTML += `
                            <tr>
                                <th scope='row'>${contador}</th>
                                <td>${doc.data().nombre}</td>
                                <td>${doc.data().avg.toFixed(3)}</td>
                            </tr>
                        `;

                        tbodyPcBateo.innerHTML += `
                            <tr>
                                <th scope='row'>${contador}</th>
                                <td>${doc.data().nombre}</td>
                                <td>${doc.data().nombre_equipo}</td>
                                <td>${doc.data().jj}</td>
                                <td>${doc.data().tt}</td>
                                <td>${doc.data().tl}</td>
                                <td>${doc.data().ht}</td>
                                <td>${doc.data().h1}</td>
                                <td>${doc.data().h2}</td>
                                <td>${doc.data().h3}</td>
                                <td>${doc.data().h4}</td>
                                <td>${doc.data().hr}</td>
                                <td>${doc.data().runs}</td>
                                <td>${doc.data().bo}</td>
                                <td>${doc.data().g}</td>
                                <td>${doc.data().s}</td>
                                <td>${doc.data().bb}</td>
                                <td>${doc.data().k}</td>
                                <td>${doc.data().avg.toFixed(3)}</td>
                            </tr>
                        `;

                    }

                } else if (modoRol == "pitcheo") {

                    if (doc.data().nombre_equipo != "") {
                        contador++;
                        tbodyPitcheoMobile.innerHTML += `
                        <tr>
                            <th scope='row'>${contador}</th>
                            <td>${doc.data().nombre}</td>
                            <td>${doc.data().era.toFixed(2)}</td>
                        </tr>
                        `;

                        tbodyPitcheoPC.innerHTML += `
                        <tr>
                        <th scope='row'>${contador}</th>
                        <td>${doc.data().nombre}</td>
                        <td>${doc.data().nombre_equipo}</td>
                        <td>${doc.data().jj}</td>
                        <td>${doc.data().w}</td>
                        <td>${doc.data().l}</td>
                        <td>${doc.data().ip.toFixed(2)}</td>
                        <td>${doc.data().bt}</td>
                        <td>${doc.data().ht}</td>
                        <td>${doc.data().hr}</td>
                        <td>${doc.data().bb}</td>
                        <td>${doc.data().k}</td>
                        <td>${doc.data().g}</td>
                        <td>${doc.data().cp}</td>
                        <td>${doc.data().cl}</td>
                        <td>${doc.data().era.toFixed(2)}</td>
                    </tr>
                        `;
                    }

                }
            } else if (modoStats == "equipo") {

                if (doc.data().nombre_equipo != "") {

                    contador++;
                    tbodyMobileBateo.innerHTML += `
                        <tr>
                            <th scope='row'>${contador}</th>
                            <td>${doc.data().nombre}</td>
                            <td>${doc.data().avg.toFixed(3)}</td>
                        </tr>
                    `;

                    tbodyPcBateo.innerHTML += `
                        <tr>
                            <th scope='row'>${contador}</th>
                            <td style='display:none;'>${doc.data().nombre}</td>
                            <td>${doc.data().nombre}</td>
                            <td>${doc.data().jj}</td>
                            <td>${doc.data().tt}</td>
                            <td>${doc.data().tl}</td>
                            <td>${doc.data().ht}</td>
                            <td>${doc.data().h1}</td>
                            <td>${doc.data().h2}</td>
                            <td>${doc.data().h3}</td>
                            <td>${doc.data().h4}</td>
                            <td>${doc.data().hr}</td>
                            <td>${doc.data().runs}</td>
                            <td>${doc.data().bo}</td>
                            <td>${doc.data().g}</td>
                            <td>${doc.data().s}</td>
                            <td>${doc.data().bb}</td>
                            <td>${doc.data().k}</td>
                            <td>${doc.data().avg.toFixed(3)}</td>
                        </tr>
                    `;

                }

            }
        })
    }
}

const armarTabla = async(datos) => {
    tbodyPcBateo.innerHTML = "";
    tbodyMobileBateo.innerHTML = "";
    tbodyPitcheoPC.innerHTML = "";
    tbodyPitcheoMobile.innerHTML = "";

    if (datos != null) {
        let contador = 0;
        datos.forEach(doc => {
            if (modoStats == "jugador") {
                if (modoRol == "bateo") {
                    if (doc.data().nombre_equipo != "") {

                        contador++;
                        tbodyMobileBateo.innerHTML += `
                            <tr>
                                <th scope='row'>${contador}</th>
                                <td>${doc.data().nombre}</td>
                                <td>${doc.data().avg.toFixed(3)}</td>
                            </tr>
                        `;

                        tbodyPcBateo.innerHTML += `
                            <tr>
                                <th scope='row'>${contador}</th>
                                <td>${doc.data().nombre}</td>
                                <td>${doc.data().nombre_equipo}</td>
                                <td>${doc.data().jj}</td>
                                <td>${doc.data().tt}</td>
                                <td>${doc.data().tl}</td>
                                <td>${doc.data().ht}</td>
                                <td>${doc.data().h1}</td>
                                <td>${doc.data().h2}</td>
                                <td>${doc.data().h3}</td>
                                <td>${doc.data().h4}</td>
                                <td>${doc.data().hr}</td>
                                <td>${doc.data().runs}</td>
                                <td>${doc.data().bo}</td>
                                <td>${doc.data().g}</td>
                                <td>${doc.data().s}</td>
                                <td>${doc.data().bb}</td>
                                <td>${doc.data().k}</td>
                                <td>${doc.data().avg.toFixed(3)}</td>
                            </tr>
                        `;

                    }

                } else if (modoRol == "pitcheo") {
                    if (doc.data().nombre_equipo != "") {
                        contador++;
                        tbodyPitcheoMobile.innerHTML += `
                        <tr>
                            <th scope='row'>${contador}</th>
                            <td>${doc.data().nombre}</td>
                            <td>${doc.data().era.toFixed(2)}</td>
                        </tr>
                        `;

                        tbodyPitcheoPC.innerHTML += `
                        <tr>
                        <th scope='row'>${contador}</th>
                        <td>${doc.data().nombre}</td>
                        <td>${doc.data().nombre_equipo}</td>
                        <td>${doc.data().jj}</td>
                        <td>${doc.data().w}</td>
                        <td>${doc.data().l}</td>
                        <td>${doc.data().ip.toFixed(2)}</td>
                        <td>${doc.data().bt}</td>
                        <td>${doc.data().ht}</td>
                        <td>${doc.data().hr}</td>
                        <td>${doc.data().bb}</td>
                        <td>${doc.data().k}</td>
                        <td>${doc.data().g}</td>
                        <td>${doc.data().cp}</td>
                        <td>${doc.data().cl}</td>
                        <td>${doc.data().era.toFixed(2)}</td>
                    </tr>
                        `;
                    }
                }
            } else if (modoStats == "equipo") {
                if (doc.data().nombre_equipo != "") {

                    contador++;
                    tbodyMobileBateo.innerHTML += `
                        <tr>
                            <th scope='row'>${contador}</th>
                            <td>${doc.data().nombre}</td>
                            <td>${doc.data().avg.toFixed(3)}</td>
                        </tr>
                    `;

                    tbodyPcBateo.innerHTML += `
                        <tr>
                            <th scope='row'>${contador}</th>
                            <td style='display:none;'>${doc.data().nombre}</td>
                            <td>${doc.data().nombre}</td>
                            <td>${doc.data().jj}</td>
                            <td>${doc.data().tt}</td>
                            <td>${doc.data().tl}</td>
                            <td>${doc.data().ht}</td>
                            <td>${doc.data().h1}</td>
                            <td>${doc.data().h2}</td>
                            <td>${doc.data().h3}</td>
                            <td>${doc.data().h4}</td>
                            <td>${doc.data().hr}</td>
                            <td>${doc.data().runs}</td>
                            <td>${doc.data().bo}</td>
                            <td>${doc.data().g}</td>
                            <td>${doc.data().s}</td>
                            <td>${doc.data().bb}</td>
                            <td>${doc.data().k}</td>
                            <td>${doc.data().avg.toFixed(3)}</td>
                        </tr>
                    `;

                }
            }
        });
    }
}

const consultaFiltro = async() => {
    let data = null;
    btnCargarMasData.disabled = false;
    btnCargarMasData.innerHTML = "Cargar mas";
    if (modoStats == "jugador") {
        data = await stats.lectura_jugadores_individuales_nuevo(dropdownTemporada.value, dropdownCategoria.value, dropdownEquipo.value, modoRol);
    } else if (modoStats == "equipo") {
        data = await stats.lectura_equipo_nuevo(dropdownTemporada.value, dropdownCategoria.value, dropdownEquipo.value);
    }

    await armarTabla(data);
};

const cargaFiltrado = async() => {
    let temporadas = await stats.lectura_filtro_temporada();
    let categorias = await stats.lectura_filtro_categoria();
    let equipos = await stats.lectura_filtro_equipos();

    if (temporadas != null) {
        temporadas.forEach(doc => {
            let li = document.createElement("li");

            let item = document.createElement("a");
            item.setAttribute("class", "dropdown-item");
            item.setAttribute("href", "javascript:void(0)");
            item.setAttribute("data-value", doc.id);
            item.addEventListener("click", async() => {
                dropdownTemporada.innerHTML = doc.data().Titulo;
                dropdownTemporada.value = doc.id;
                btnRestablecer.classList.remove("hide");
                await consultaFiltro();
            });
            item.innerHTML = doc.data().Titulo;

            li.appendChild(item);
            menuTemporada.appendChild(li);
        });

    }

    if (categorias != null) {
        categorias.forEach(doc => {
            let li = document.createElement("li");

            let item = document.createElement("a");
            item.setAttribute("class", "dropdown-item");
            item.setAttribute("href", "javascript:void(0)");
            item.setAttribute("data-value", doc.id);
            item.innerHTML = doc.data().Descripcion;
            item.addEventListener("click", async() => {
                dropdownCategoria.innerHTML = doc.data().Descripcion;
                dropdownCategoria.value = doc.id;
                btnRestablecer.classList.remove("hide");
                await consultaFiltro();
            });

            li.appendChild(item);
            menuCategoria.appendChild(li);


        });
        // dropdownCategoria.innerHTML = menuCategoria.children[0].children[0].innerHTML;
    }

    if (equipos != null) {
        equipos.forEach(doc => {
            let li = document.createElement("li");

            let item = document.createElement("a");
            item.setAttribute("class", "dropdown-item");
            item.setAttribute("href", "javascript:void(0)");
            item.setAttribute("data-value", doc.id);
            item.innerHTML = doc.data().Nombre_completo;

            item.addEventListener("click", async() => {
                dropdownEquipo.innerHTML = doc.data().Nombre_completo;
                dropdownEquipo.value = doc.id;
                btnRestablecer.classList.remove("hide");
                await consultaFiltro();
            });

            li.appendChild(item);
            menuEquipo.appendChild(li);


        });
    }
}

const cargaInicial_Jugador = async() => {

    let data = await stats.lectura_jugadores_individuales_nuevo(dropdownTemporada.value, dropdownCategoria.value, dropdownEquipo.value, modoRol);
    await armarTabla(data);

    // let data = await stats.lectura_todosLosJugadores(modoRol);

    // if (data != null) {
    //     let contador = 0;
    //     data.forEach(doc => {

    //         if (doc.data().nombre_equipo != "") {

    //             contador++;
    //             tbodyMobileBateo.innerHTML += `
    //                 <tr>
    //                     <th scope='row'>${contador}</th>
    //                     <td>${doc.data().nombre}</td>
    //                     <td>${doc.data().avg.toFixed(3)}</td>
    //                 </tr>
    //             `;

    //             tbodyPcBateo.innerHTML += `
    //                 <tr>
    //                     <th scope='row'>${contador}</th>
    //                     <td>${doc.data().nombre}</td>
    //                     <td>${doc.data().nombre_equipo}</td>
    //                     <td>${doc.data().jj}</td>
    //                     <td>${doc.data().tt}</td>
    //                     <td>${doc.data().tl}</td>
    //                     <td>${doc.data().ht}</td>
    //                     <td>${doc.data().h1}</td>
    //                     <td>${doc.data().h2}</td>
    //                     <td>${doc.data().h3}</td>
    //                     <td>${doc.data().h4}</td>
    //                     <td>${doc.data().hr}</td>
    //                     <td>${doc.data().runs}</td>
    //                     <td>${doc.data().bo}</td>
    //                     <td>${doc.data().g}</td>
    //                     <td>${doc.data().s}</td>
    //                     <td>${doc.data().bb}</td>
    //                     <td>${doc.data().k}</td>
    //                     <td>${doc.data().avg.toFixed(3)}</td>
    //                 </tr>
    //             `;

    //         }

    //     });
    // }




}