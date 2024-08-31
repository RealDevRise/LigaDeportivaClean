import { db, collection, ref, storage, doc, getDocs, query, getDownloadURL, orderBy, limit, where, getDoc, startAt, startAfter, endBefore, limitToLast } from "./firebaseCore.js";
import * as coreBitacora from "./core/bitacorapersonas.js";
import * as coreCategoriaJugador from "./core/categoriajugador.js";
import * as jsPDF from "./jspdf.umd.min.js";
import "./jspdf.plugin.autotable.js";

const contenedor_rosters = document.getElementById("calendario");
const gridEquipos = document.getElementById("contenedor-grid-equipos");
const contenedorPaginado = document.getElementById("contenedor-paginado");
const contenedorFiltro = document.getElementById("contenedor-filtro");
const botonFiltro = document.getElementById("botonFiltro");
const filtro_temporada = document.getElementById("selectTemporada");
const filtro_categoria = document.getElementById("selectCategoria");
const botonAplicarFiltro = document.getElementById("botonAplicarFiltro");
const siguientePagina = document.getElementById("btn_siguiente");
const paginaAnterior = document.getElementById("btn_previo");
const contenedor_tabla_integrantes = document.getElementById("contenedor-tabla-equipo");
const bodyTable_integrantes = document.getElementById("tbody-integrantes");
const botonRegresarGridEquipos = document.getElementById("btn_regresarGridEquipos");
const roster_Logotipo = document.getElementById("roster_logo_equipo");
const roster_Nombre_Equipo = document.getElementById("roster_nombre_equipo");
const botonExportarRoster = document.getElementById("botonExportarRoster");
const tituloRoster = document.getElementById("titulo-seccion-roster");
const contenedorNotas = document.getElementById("contenedor_notas");
const limitePaginacion = 12;
let ultimoDocumento = null;
let primerDocumento = null;

let filtro_temporadaSeleccionada = null;
let filtro_categoriaSeleccionada = null;

let consulta_definida = null;
let tipoFiltro = null;

let status_Filtro = false;


document.addEventListener('DOMContentLoaded', async function() {
    await cargarFiltro();
    await cargaEquipo_Init();
});


const cargaEquipo_Init = async() => {
    const consulta = query(collection(db, "Equipos"),
        orderBy("Nombre_completo", "asc"),
        limit(limitePaginacion)
    );
    tipoFiltro = 0;
    await cargarEquipos(consulta);
}

botonFiltro.addEventListener('click', async() => {
    await filtradoEquipos();
});

botonAplicarFiltro.addEventListener('click', async() => {
    await seleccionFiltroEquipo();
});

siguientePagina.addEventListener('click', async() => {
    await controlFiltrado_After(tipoFiltro);
});

paginaAnterior.addEventListener('click', async() => {
    await controlFiltrado_Before(tipoFiltro);
});

const seleccionFiltroEquipo = async() => {
    let consulta = null;
    let primeraFiltracion = null;

    if (filtro_temporada.value != "" && filtro_categoria.value != "") {
        if (tipoFiltro != 3) {
            filtro_temporadaSeleccionada = filtro_temporada.value;
            filtro_categoriaSeleccionada = filtro_categoria.value;
            ultimoDocumento = null;
            primeraFiltracion = true;
        } else {
            if (filtro_temporada.value == filtro_temporadaSeleccionada && filtro_categoria.value == filtro_categoriaSeleccionada) {
                primeraFiltracion = null;
            } else {
                primeraFiltracion = true;
                ultimoDocumento = null;
                filtro_temporadaSeleccionada = filtro_temporada.value;
                filtro_categoriaSeleccionada = filtro_categoria.value;
            }
        }
        tipoFiltro = 3;
    } else if (filtro_categoria.value != "") {

        if (tipoFiltro != 2) {
            filtro_categoriaSeleccionada = filtro_categoria.value;
            ultimoDocumento = null;
            primeraFiltracion = true;
        } else {

            if (filtro_categoria.value == filtro_categoriaSeleccionada) {
                primeraFiltracion = null;
            } else {
                primeraFiltracion = true;
                ultimoDocumento = null;
                filtro_categoriaSeleccionada = filtro_categoria.value;
            }

        }

        tipoFiltro = 2;
    } else if (filtro_temporada.value != "") {
        if (tipoFiltro != 1) {
            filtro_temporadaSeleccionada = filtro_temporada.value;
            ultimoDocumento = null;
            primeraFiltracion = true;
        } else {

            if (filtro_temporada.value == filtro_temporadaSeleccionada) {
                primeraFiltracion = null;
            } else {
                primeraFiltracion = true;
                ultimoDocumento = null;
                filtro_temporadaSeleccionada = filtro_temporada.value;
            }

        }
        tipoFiltro = 1;
    }



    console.log(tipoFiltro);

    if (primeraFiltracion != null) {
        if (primeraFiltracion) {
            await controlFiltrado_Init(tipoFiltro);
        } else {
            await controlFiltrado_After(tipoFiltro);
        }
    }

}

const controlFiltradoPaginacion = async(filtrado) => {
    let consulta = null;
    switch (filtrado) {
        case 0:
            consulta = query(collection(db, "Equipos"),
                orderBy("Nombre_completo", "asc"),
                startAfter(ultimoDocumento),
                limit(limitePaginacion)
            );
            break;
        case 1:
            consulta = query(collection(db, "Equipos"),
                where("Temporada", "==", filtro_temporada.value),
                orderBy("Nombre_completo", "asc"),
                startAfter(ultimoDocumento),
                limit(limitePaginacion)
            );
            break;

        case 2:
            consulta = query(collection(db, "Equipos"),
                where("Categoria", "==", filtro_categoria.value),
                orderBy("Nombre_completo", "asc"),
                startAfter(ultimoDocumento),
                limit(limitePaginacion)
            );
            break;

        case 3:
            consulta = query(collection(db, "Equipos"),
                where("Temporada", "==", filtro_temporada.value),
                where("Categoria", "==", filtro_categoria.value),
                orderBy("Nombre_completo", "asc"),
                startAfter(ultimoDocumento),
                limit(limitePaginacion)
            );
            break;

        default:
            return;
    }

    await cargarEquipos(consulta);

}

const controlFiltrado_Init = async(filtrado) => {
    let consulta = null;
    switch (filtrado) {
        case 0:
            consulta = query(collection(db, "Equipos"),
                orderBy("Nombre_completo", "asc"),
                limit(limitePaginacion)
            );
            break;
        case 1:
            consulta = query(collection(db, "Equipos"),
                where("Temporada", "==", filtro_temporada.value),
                orderBy("Nombre_completo", "asc"),
                limit(limitePaginacion));
            break;

        case 2:
            consulta = query(collection(db, "Equipos"),
                where("Categoria", "==", filtro_categoria.value),
                orderBy("Nombre_completo", "asc"),
                limit(limitePaginacion));
            break;

        case 3:
            consulta = query(collection(db, "Equipos"),
                where("Temporada", "==", filtro_temporada.value),
                where("Categoria", "==", filtro_categoria.value),
                orderBy("Nombre_completo", "asc"),
                limit(limitePaginacion));
            break;

        default:
            return;
    }

    await cargarEquipos(consulta);

}

const controlFiltrado_After = async(filtrado) => {
    let consulta = null;
    switch (filtrado) {
        case 0:
            consulta = query(collection(db, "Equipos"),
                orderBy("Nombre_completo", "asc"),
                startAfter(ultimoDocumento),
                limit(limitePaginacion)
            );
            break;
        case 1:
            consulta = query(collection(db, "Equipos"),
                where("Temporada", "==", filtro_temporada.value),
                orderBy("Nombre_completo", "asc"),
                startAfter(ultimoDocumento),
                limit(limitePaginacion));
            break;

        case 2:
            consulta = query(collection(db, "Equipos"),
                where("Categoria", "==", filtro_categoria.value),
                orderBy("Nombre_completo", "asc"),
                startAfter(ultimoDocumento),
                limit(limitePaginacion));
            break;

        case 3:
            consulta = query(collection(db, "Equipos"),
                where("Temporada", "==", filtro_temporada.value),
                where("Categoria", "==", filtro_categoria.value),
                orderBy("Nombre_completo", "asc"),
                startAfter(ultimoDocumento),
                limit(limitePaginacion));
            break;

        default:
            return;
    }

    await cargarEquipos(consulta);
}

const controlFiltrado_Before = async(filtrado) => {
    let consulta = null;
    switch (filtrado) {
        case 0:
            consulta = query(collection(db, "Equipos"),
                orderBy("Nombre_completo", "asc"),
                endBefore(primerDocumento),
                limitToLast(limitePaginacion)
            );
            break;
        case 1:
            consulta = query(collection(db, "Equipos"),
                where("Temporada", "==", filtro_temporada.value),
                orderBy("Nombre_completo", "asc"),
                endBefore(primerDocumento),
                limitToLast(limitePaginacion));
            break;

        case 2:
            consulta = query(collection(db, "Equipos"),
                where("Categoria", "==", filtro_categoria.value),
                orderBy("Nombre_completo", "asc"),
                endBefore(primerDocumento),
                limitToLast(limitePaginacion));
            break;

        case 3:
            consulta = query(collection(db, "Equipos"),
                where("Temporada", "==", filtro_temporada.value),
                where("Categoria", "==", filtro_categoria.value),
                orderBy("Nombre_completo", "asc"),
                endBefore(primerDocumento),
                limitToLast(limitePaginacion));
            break;

        default:
            return;
    }

    await cargarEquipos(consulta);
}

const cargarFiltro = async() => {
    const consulta_temporada = query(collection(db, "Temporadas"),
        orderBy("Titulo", "asc")
    );
    let doc_temporada = await getDocs(consulta_temporada);

    if (doc_temporada.docs.length > 0) {
        doc_temporada.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Titulo;
            filtro_temporada.appendChild(opcion);
        });
    }

    const consulta_categoria = query(collection(db, "Categorias"),
        orderBy("Descripcion", "asc")
    );
    let doc_categoria = await getDocs(consulta_categoria);

    if (doc_categoria.docs.length > 0) {
        doc_categoria.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Descripcion_corta;
            filtro_categoria.appendChild(opcion);
        });
    }

}

const cargarEquipos = async(consulta) => {
    // const consulta = query(collection(db, "Equipos"),
    //     orderBy("Nombre_completo", "asc"),
    //     limit(limitePaginacion)
    // );

    await getDocs(consulta).then((doc) => {

        if (doc.docs.length > 0) {

            ultimoDocumento = doc.docs[doc.docs.length - 1];
            primerDocumento = doc.docs[0];

            gridEquipos.innerHTML = "";

            doc.docs.forEach((item) => {


                let colTeam = document.createElement("div");
                colTeam.classList.add("col");
                colTeam.setAttribute("style", "text-align: center; margin-bottom: var(--bs-gutter-y);");

                let aTeam = document.createElement("a");
                aTeam.setAttribute("href", "javascript:void(0)");
                aTeam.addEventListener("click", async() => {
                    mostrarTablaIntegrantes();
                    await mostrarRosterEquipo(item.id, item.data().Nombre_completo, item.data().Logotipo, item.data().Temporada, item.data().Categoria);
                });


                let divWrapper = document.createElement("div");
                divWrapper.setAttribute("class", "card swiper-slide slider-wrapper-team");

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

                aTeam.appendChild(divWrapper);

                colTeam.appendChild(aTeam);

                let aTitleTeam = document.createElement("a");
                aTitleTeam.classList.add("titulo-equipo");
                aTitleTeam.innerHTML = item.data().Nombre_completo;
                aTitleTeam.addEventListener("click", async() => {
                    await mostrarRosterEquipo(item.id);
                });

                colTeam.appendChild(aTitleTeam);

                gridEquipos.appendChild(colTeam);

            });

        }
    });


}

const mostrarRosterEquipo = async(id, nombre, logotipo, temporada, categoria) => {
    let indiceJugador = 0;
    roster_Logotipo.src = logotipo;
    roster_Logotipo.alt = nombre;
    roster_Nombre_Equipo.innerHTML = nombre;
    bodyTable_integrantes.innerHTML = "";
    const consulta = query(collection(db, "Personas"),
        where("Equipo_actual", "==", id),
        orderBy("Nombre_completo", "asc")
    );

    const consultaResponse = await getDocs(consulta);

    const refTemporada = doc(db, "Temporadas", temporada);
    const snapTemporada = await getDoc(refTemporada);

    const refCategoria = doc(db, "Categorias", categoria);
    const snapCategoria = await getDoc(refCategoria);

    const consultaCategoriaJugador = query(collection(db, "Categoria_Jugador"));
    const snapCategoriaJugador = await getDocs(consultaCategoriaJugador);

    const consultaEquipo = doc(db, "Equipos", id);
    const responseEquipo = await getDoc(consultaEquipo);

    if (responseEquipo.exists()) {
        contenedorNotas.innerHTML = responseEquipo.data().Notas;
    }

    let options_date = { year: 'numeric', month: 'short', day: 'numeric' };

    if (consultaResponse.docs.length > 0) {
        await Promise.all(consultaResponse.docs.map(async(item) => {
            indiceJugador++;

            let tRow = document.createElement("tr");

            let tdNo = document.createElement("td");
            tdNo.innerHTML = indiceJugador;
            tRow.appendChild(tdNo);

            let tdNombre = document.createElement("td");
            tdNombre.innerHTML = item.data().Nombre_completo.toUpperCase();
            tRow.appendChild(tdNombre);

            let tdFechaNacimiento = document.createElement("td");
            tdFechaNacimiento.innerHTML = item.data().Fecha_nacimiento;
            tRow.appendChild(tdFechaNacimiento);

            let tdCurp = document.createElement("td");
            if (item.data().Curp != undefined)
                tdCurp.innerHTML = item.data().Curp.toUpperCase();
            else
                tdCurp.innerHTML = "N/A";

            tRow.appendChild(tdCurp);

            let tdCategoriaJugador = document.createElement("td");
            let datoCategoriaJugador = "Sin Categoría";

            if (item.data().Categoria_jugador != undefined) {
                datoCategoriaJugador = snapCategoriaJugador.docs.find(x => x.id == item.data().Categoria_jugador).data().descripcion;
            }

            tdCategoriaJugador.innerHTML = datoCategoriaJugador.toUpperCase();
            tRow.appendChild(tdCategoriaJugador);

            //Movimiento
            let tdMovimiento = document.createElement("td");
            let ultimoRegistro = await coreBitacora.Obtener_Ultimo_Registro(item.id);
            let datoMovimiento = "Sin Movimiento";

            if (ultimoRegistro != null) {
                await Promise.all(ultimoRegistro.docs.map(async(response) => {
                    if (response.data().fecha_movimiento != undefined && response.data().observaciones != undefined)
                        datoMovimiento = `${response.data().fecha_movimiento.toDate().toLocaleDateString("es-MX", options_date)} ${response.data().observaciones}`;
                }));
            }

            tdMovimiento.innerHTML = datoMovimiento.toUpperCase();
            tRow.appendChild(tdMovimiento);

            bodyTable_integrantes.appendChild(tRow);
        }));

    }

    // await getDocs(consulta).then((doc) => {
    //     if (doc.docs.length > 0) {

    //         doc.docs.forEach(async(item) => {
    //             indiceJugador++;

    //             let tRow = document.createElement("tr");

    //             let tdNo = document.createElement("td");
    //             tdNo.innerHTML = indiceJugador;
    //             tRow.appendChild(tdNo);

    //             let tdNombre = document.createElement("td");
    //             tdNombre.innerHTML = item.data().Nombre_completo.toUpperCase();
    //             tRow.appendChild(tdNombre);

    //             let tdFechaNacimiento = document.createElement("td");
    //             tdFechaNacimiento.innerHTML = item.data().Fecha_nacimiento;
    //             tRow.appendChild(tdFechaNacimiento);

    //             let tdCurp = document.createElement("td");
    //             if (item.data().Curp != undefined)
    //                 tdCurp.innerHTML = item.data().Curp.toUpperCase();
    //             else
    //                 tdCurp.innerHTML = "N/A";

    //             tRow.appendChild(tdCurp);

    //             let tdCategoriaJugador = document.createElement("td");
    //             let datoCategoriaJugador = "Sin Categoría";

    //             if (item.data().Categoria_jugador != undefined) {

    //                 let descripcionCategoria = await coreCategoriaJugador.Leer(item.data().Categoria_jugador);
    //                 if (descripcionCategoria != null)
    //                     datoCategoriaJugador = descripcionCategoria.data().descripcion;

    //             }

    //             tdCategoriaJugador.innerHTML = datoCategoriaJugador.toUpperCase();
    //             tRow.appendChild(tdCategoriaJugador);

    //             //Movimiento
    //             let ultimoRegistro = await coreBitacora.Obtener_Ultimo_Registro(item.id);
    //             let datoMovimiento = "Sin Movimiento";

    //             let tdMovimiento = document.createElement("td");
    //             if (ultimoRegistro != null) {
    //                 ultimoRegistro.forEach(documento => {
    //                     if (documento.data().fecha_movimiento != undefined && documento.data().observaciones != undefined)
    //                         datoMovimiento = `${documento.data().fecha_movimiento.toDate().toLocaleDateString("es-MX", options_date)} ${documento.data().observaciones}`;
    //                 });

    //             }

    //             tdMovimiento.innerHTML = datoMovimiento.toUpperCase();
    //             tRow.appendChild(tdMovimiento);

    //             // let tdTemporada = document.createElement("td");
    //             // tdTemporada.innerHTML = snapTemporada.data().Titulo;
    //             // tRow.appendChild(tdTemporada);

    //             // let tdCategoria = document.createElement("td");
    //             // tdCategoria.innerHTML = snapCategoria.data().Descripcion;
    //             // tRow.appendChild(tdCategoria);

    //             bodyTable_integrantes.appendChild(tRow);
    //         });
    //     }
    // });
}

botonRegresarGridEquipos.addEventListener("click", () => {
    ocultarTablaIntegrantes();
});

const mostrarTablaIntegrantes = () => {
    gridEquipos.classList.add("oculto");
    contenedorPaginado.classList.add("oculto");
    contenedor_tabla_integrantes.classList.remove("oculto");
    botonRegresarGridEquipos.classList.remove("oculto");
    botonFiltro.classList.add("oculto");
    contenedorFiltro.classList.add("oculto");
    // botonExportarRoster.classList.remove("oculto");
    tituloRoster.innerHTML = "Roster del equipo";
}

const ocultarTablaIntegrantes = () => {
    gridEquipos.classList.remove("oculto");
    contenedorPaginado.classList.remove("oculto");
    contenedor_tabla_integrantes.classList.add("oculto");
    botonRegresarGridEquipos.classList.add("oculto");
    botonFiltro.classList.remove("oculto");
    // botonExportarRoster.classList.add("oculto");
    tituloRoster.innerHTML = "Equipos";

    if (status_Filtro) {
        contenedorFiltro.classList.remove("oculto");
    } else {
        contenedorFiltro.classList.add("oculto");
    }

}

botonExportarRoster.addEventListener('click', async() => {
    // const { jsPDF } = window.jspdf;
    // let docPDF = new jsPDF('p', 'mm', 'letter');


});

const filtradoEquipos = async() => {
    if (contenedorFiltro.classList.contains("oculto")) {
        status_Filtro = true;
        contenedorFiltro.classList.remove("oculto");
        botonFiltro.innerHTML = `<i class="fas fa-filter" style="margin-right: 8px;"></i>Remover filtro`;
    } else {

        if (tipoFiltro != 0) {
            ultimoDocumento = null;
            await cargaEquipo_Init();
        }
        status_Filtro = false;
        contenedorFiltro.classList.add("oculto");
        botonFiltro.innerHTML = `<i class="fas fa-filter" style="margin-right: 8px;"></i>Filtro`;
        filtro_temporada.selectedIndex = 0;
        filtro_categoria.selectedIndex = 0;
    }
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}