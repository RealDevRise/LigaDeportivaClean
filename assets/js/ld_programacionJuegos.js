import * as programacionJuegos from "./coreProgramacionJuegos.js";
import { Cargar_Todos_Los_Equipos } from "./core/equipos.js";
import { Cargar_Categorias } from "./core/categorias.js";
import { Obtener_Stats_Cliente_Rol } from "./core/estadisticas.js";

const excelJS = window.ExcelJS;

const gridPrincipal = document.getElementById("ld_contenedor_tabla");
const ldFormulario = document.getElementById("ld_formulario");
const btnNuevo = document.getElementById("btn_nuevo");
const btnFormularioRegresar = document.getElementById("btnFormulario_regresar");
const btnSiguiente = document.getElementById("btn_siguiente");
const btnAtras = document.getElementById("btn_previo");
const btnModalEliminar = document.getElementById("btnModal_eliminar");
const ldContenedorTabla = document.getElementById("ld_contenedor_tabla");

const campoNombre = document.getElementById("input_nombre");
const campoTemporada = document.getElementById("selectTemporada");
const btnAgregarCategoria = document.getElementById("btnAgregarCategoria");
const btnCalendarizar = document.getElementById("btnCalendarizar");
const tablasdeProgramacion = document.getElementById("wrapperTablasProgramacion");


// FILTRO PROGRAMACION JUEGOS
const seccionFiltros = document.getElementById("seccion_resultados_filtro");
const btnRegresarFiltro = document.getElementById("btnFiltroRegresar");
const selectFiltroEquipo = document.getElementById("select_modalFiltroEquipo");
const selectFiltroCategoria = document.getElementById("select_modalFiltroCategoria");
const btnFiltrarProgramacion = document.getElementById("btnModalFiltrar");
const wrapperTablaProgramacionFiltro = document.getElementById("wrapperTablasProgramacionFiltro");
const modalFiltro = document.getElementById("modal-filtro");

// GENERADOR DE REPORTE
const selectReporteCategoria = document.getElementById("select_ReporteCategoria");
const selectReporteRol = document.getElementById("select_ReporteRol");
const btn_GenerarReporteEstadisticas = document.getElementById("btnModalReporte_Generar");

let ultimoDocumento = null;
let primerDocumento = null;
let uidUser = "";
let idRegistro = "";
let modoRegistro = null;
let idPartidas_eliminar = [];



/**** EVENTOS DE GENERADOR DE REPORTE DE ESTADISTICAS ****/
btn_GenerarReporteEstadisticas.addEventListener("click", async () => {
    await GeneraReporteEstadisticas();
});


const cargarCategoriasEstadisticas = async () => {
    let categorias = await Cargar_Categorias();

    if (categorias != null) {
        categorias.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Descripcion;
            selectReporteCategoria.appendChild(opcion);
        });
    }
}


const GeneraReporteEstadisticas = async () => {

    if (selectReporteCategoria.value == "") {
        alert("Seleccionar una categoria");
    } else {
        let nombreCategoria = selectReporteCategoria.options[selectReporteCategoria.selectedIndex].text.split(' ').join('_');
        await FuncionObtenerReporteEstadisticas(selectReporteRol.value, nombreCategoria, selectReporteCategoria.value);
    }

}

const FuncionObtenerReporteEstadisticas = async (rol, nombreCategoria, idCategoria) => {
    let workbook = new excelJS.Workbook();
    let worksheet = workbook.addWorksheet('Reporte_Estadisticas');

    const consulta = await Obtener_Stats_Cliente_Rol(rol, idCategoria);
    // const consulta = query(collection(db, "Client_Stat_Personas"),
    //     where("categoria", "==", categoriaEquipos),
    //     where("rol", "==", rol),
    //     orderBy("nombre", "asc")
    // );
    // const response = await getDocs(consulta);

    worksheet.getRow(1).font = { bold: true }


    if (consulta != null) {
        if (rol == "bateo") {
            worksheet.columns = [
                { header: 'Jugador', key: 'nombre' },
                { header: 'Equipo', key: 'nombre_equipo' },
                { header: 'JJ', key: 'jj' },
                { header: 'TT', key: 'tt' },
                { header: 'TL', key: 'tl' },
                { header: 'HT', key: 'ht' },
                { header: 'H1', key: 'h1' },
                { header: 'H2', key: 'h2' },
                { header: 'H3', key: 'h3' },
                { header: 'H4', key: 'h4' },
                { header: 'HR', key: 'hr' },
                { header: 'RUNS', key: 'runs' },
                { header: 'BO', key: 'bo' },
                { header: 'G', key: 'g' },
                { header: 'S', key: 's' },
                { header: 'BB', key: 'bb' },
                { header: 'K', key: 'k' },
                { header: 'AVG', key: 'avg' },
            ];


            consulta.forEach((doc, index) => {
                const rowIndex = index + 2;
                worksheet.addRow(
                    [
                        doc.data().nombre,
                        doc.data().nombre_equipo,
                        doc.data().jj,
                        doc.data().tt,
                        doc.data().tl,
                        doc.data().ht,
                        doc.data().h1,
                        doc.data().h2,
                        doc.data().h3,
                        doc.data().h4,
                        doc.data().hr,
                        doc.data().runs,
                        doc.data().bo,
                        doc.data().g,
                        doc.data().s,
                        doc.data().bb,
                        doc.data().k,
                        doc.data().avg,
                    ]
                );
            });


            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
                saveAs(blob, `[BATEO]Reporte_Estadisticas_${nombreCategoria}.xlsx`);
            });

        } else {
            worksheet.columns = [
                { header: 'Jugador', key: 'nombre' },
                { header: 'Equipo', key: 'nombre_equipo' },
                { header: 'JJ', key: 'jj' },
                { header: 'W', key: 'w' },
                { header: 'L', key: 'l' },
                { header: 'IP', key: 'ip' },
                { header: 'BT', key: 'bt' },
                { header: 'HT', key: 'ht' },
                { header: 'HR', key: 'hr' },
                { header: 'BB', key: 'bb' },
                { header: 'K', key: 'k' },
                { header: 'G', key: 'g' },
                { header: 'CP', key: 'cp' },
                { header: 'CL', key: 'cl' },
                { header: 'ERA', key: 'era' },
            ];

            consulta.forEach((doc, index) => {
                const rowIndex = index + 2;
                worksheet.addRow(
                    [
                        doc.data().nombre,
                        doc.data().nombre_equipo,
                        doc.data().jj,
                        doc.data().w,
                        doc.data().l,
                        doc.data().ip,
                        doc.data().bt,
                        doc.data().ht,
                        doc.data().hr,
                        doc.data().bb,
                        doc.data().k,
                        doc.data().g,
                        doc.data().cp,
                        doc.data().cl,
                        doc.data().era,
                    ]
                );
            });

            workbook.xlsx.writeBuffer().then((data) => {
                const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
                saveAs(blob, `[PITCHEO]Reporte_Estadisticas_${nombreCategoria}.xlsx`);
            });
        }
    }



}


/******** EVENTOS DE FILTRADO *******/
const cargarFiltrosProgramacion = async () => {
    const listaEquipos = await Cargar_Todos_Los_Equipos();
    const listaCategorias = await Cargar_Categorias();

    if (listaEquipos != null) {
        listaEquipos.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Nombre_completo;
            selectFiltroEquipo.appendChild(opcion);
        });
    }

    if (listaCategorias != null) {
        listaCategorias.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Descripcion;
            selectFiltroCategoria.appendChild(opcion);
        });
    }
}

btnRegresarFiltro.addEventListener("click", () => {
    document.getElementById('ld_principal').classList.remove('hide');
    seccionFiltros.classList.add('hide');
});

btnFiltrarProgramacion.addEventListener("click", async () => {


    btnFiltrarProgramacion.innerHTML = "Buscando partidas...";
    btnFiltrarProgramacion.disabled = true;
    if (selectFiltroEquipo.value != "" && selectFiltroCategoria.value == "") {
        wrapperTablaProgramacionFiltro.innerHTML = "";
        let DataPartidas = await programacionJuegos.filtrar_por_equipo(selectFiltroEquipo.value);
        if (DataPartidas != null) {
            await Promise.all(DataPartidas.map(async (tabla) => {
                wrapperTablaProgramacionFiltro.appendChild(tabla);
            }));

            document.getElementById('ld_principal').classList.add('hide');
            seccionFiltros.classList.remove('hide');
        } else {
            alert("No se encontraron partidas programadas");
        }
    }
    else if (selectFiltroEquipo.value == "" && selectFiltroCategoria.value != "") {
    }
    else if (selectFiltroEquipo.value != "" && selectFiltroCategoria.value != "") {
    }
    else {
        alert("Seleccionar un filtro");
    }
    btnFiltrarProgramacion.innerHTML = "Buscar";
    btnFiltrarProgramacion.disabled = false;
    $('#modal-filtro').modal('hide');
});


/*********** EVENTOS GENERALES **********/
document.addEventListener('DOMContentLoaded', async () => {
    programacionJuegos.onAuthStateChanged(programacionJuegos.auth, async (user) => {
        if (user) {
            const name_dropdown = document.getElementById("menu-dropdown");
            name_dropdown.innerHTML = user.displayName;
            name_dropdown.setAttribute("usrid", user.uid);
            uidUser = user.uid;
            let listaProgramacion = await programacionJuegos.leer();
            obtenerProgramaciones(listaProgramacion);

            await cargarFiltrosProgramacion();
            await cargarCategoriasEstadisticas();

            // Carga de temporadas //
            let listaTemporadas = await programacionJuegos.ListaTemporadas();
            if (listaTemporadas != null) {
                listaTemporadas.forEach(doc => {
                    let opcion = document.createElement("option");
                    opcion.value = doc.id;
                    opcion.innerHTML = doc.data().Titulo;
                    campoTemporada.appendChild(opcion);
                });
            }
        } else {
            window.location.replace('/Login.html');
        }
    });
});

const obtenerProgramaciones = async (snapshot) => {
    if (snapshot != null) {
        ultimoDocumento = snapshot.docs[snapshot.docs.length - 1];
        primerDocumento = snapshot.docs[0];
        gridPrincipal.innerHTML = '';

        snapshot.forEach(doc => {

            let divCardBody = document.createElement("div");
            divCardBody.classList.add("card-body");

            let h4CardTitle = document.createElement("h4");
            h4CardTitle.classList.add("card-title");
            h4CardTitle.setAttribute("style", "display:flex; align-items:center; margin-bottom:0.25rem;");
            h4CardTitle.innerHTML = doc.data().nombre;
            divCardBody.appendChild(h4CardTitle);

            let pCardText = document.createElement("p");
            pCardText.classList.add("card-text");
            pCardText.setAttribute("style", "font-size:0.8rem; margin-bottom:0.3rem;");
            pCardText.innerHTML = `Fecha de registro: <span class="noticia-fecha-publicacion">${doc.data().fecha.toDate().toLocaleDateString("es-MX")}</span>`;
            divCardBody.appendChild(pCardText);

            let buttonEditar = document.createElement("button");
            buttonEditar.setAttribute("id", doc.id);
            buttonEditar.setAttribute("class", "btn btnDashboard btnDashboard-primary");
            buttonEditar.setAttribute("style", "margin-right:6px;");
            buttonEditar.innerHTML = "Editar";
            buttonEditar.addEventListener("click", () => {
                obtenerProgramacion(doc.id);
            });
            divCardBody.appendChild(buttonEditar);

            let buttonEliminar = document.createElement("button");
            buttonEliminar.setAttribute("class", "btn btnDashboard btnDashboard-danger");
            buttonEliminar.addEventListener("click", () => {
                confirmarEliminacion(doc.id);
            });
            buttonEliminar.innerHTML = "Eliminar";
            divCardBody.appendChild(buttonEliminar);

            gridPrincipal.appendChild(divCardBody);
        });
    }
};

const obtenerProgramacion = async (id) => {
    let programacion = await programacionJuegos.obtener(id);

    if (programacion != null) {

        idPartidas_eliminar = [];
        limpiarFormulario();

        idRegistro = programacion.id;
        campoNombre.value = programacion.data().nombre;
        campoTemporada.value = programacion.data().temporada;

        cargarTablaProgramacion(programacion.data().programacion);

        document.getElementById('ld_principal').classList.add('hide');
        document.getElementById('seccion_ld_formulario').classList.remove('hide');
        document.getElementById('titulo-formulario').innerHTML = 'Actualizar registro';
        document.getElementById('btn_submit').innerHTML = 'Actualizar';
        document.getElementById('btn_submit').setAttribute("value", "actualizar");
    } else {

    }
};

const cargarTablaProgramacion = async (programacion) => {


    await Promise.all(programacion.map(async (p, i) => {
        await agregarCategoria();
        // console.log(p.categoria);
        // Carga de la categoría seleccionada //
        let campoCategoria = tablasdeProgramacion.children[i].children[0].children[0].children[1];
        campoCategoria.value = p.categoria;

        // Cargar partidas //
        let tbodyPartida = tablasdeProgramacion.children[i].children[1].children[1];
        let trPartida = tablasdeProgramacion.children[i].children[1].children[1].children[0];

        await Promise.all(p.partidas.map(async (pa, j) => {
            // console.log(pa);
            await agregarPartida(tbodyPartida, trPartida, pa.id, pa.compilacion);

            // Rellenar información del row de la partida //
            let rowPartida = tbodyPartida.children[j];

            // Fecha y Hora //
            let fechaData = pa.fecha.toDate();
            fechaData.setMinutes(fechaData.getMinutes() - fechaData.getTimezoneOffset());
            rowPartida.children[0].children[0].value = fechaData.toISOString().slice(0, -1);

            // Equipo Local //
            rowPartida.children[1].children[0].value = pa.local;

            // Equipo Visita //
            rowPartida.children[3].children[0].value = pa.visitante;

            // Campo //
            rowPartida.children[4].children[0].value = pa.campo;
        }));

    }));

    // for (let i = 0; i < programacion.length; i++) {

    //     // Cargar tabla de categoría //
    //     await agregarCategoria();

    //     // Carga de la categoría seleccionada //
    //     let campoCategoria = tablasdeProgramacion.children[i].children[0].children[0].children[1];
    //     campoCategoria.value = programacion[i].categoria;

    //     // Cargar partidas //
    //     let tbodyPartida = tablasdeProgramacion.children[i].children[1].children[1];
    //     let trPartida = tablasdeProgramacion.children[i].children[1].children[1].children[0];


    //     for (let j = 0; j < programacion[i].partidas.length; j++) {
    //         await agregarPartida(tbodyPartida, trPartida, programacion[i].partidas[j].id, programacion[i].partidas[j].compilacion);

    //         // Rellenar información del row de la partida //
    //         let rowPartida = tbodyPartida.children[j];

    //         // Fecha y Hora //
    //         let fechaData = programacion[i].partidas[j].fecha.toDate();
    //         fechaData.setMinutes(fechaData.getMinutes() - fechaData.getTimezoneOffset());
    //         rowPartida.children[0].children[0].value = fechaData.toISOString().slice(0, -1);

    //         // Equipo Local //
    //         rowPartida.children[1].children[0].value = programacion[i].partidas[j].local;

    //         // Equipo Visita //
    //         rowPartida.children[3].children[0].value = programacion[i].partidas[j].visitante;

    //         // Campo //
    //         rowPartida.children[4].children[0].value = programacion[i].partidas[j].campo;
    //     }
    // }

};

const agregarCategoria = async () => {
    let divWrapperTabla = document.createElement("div");
    divWrapperTabla.setAttribute("class", "pb-4");

    // Toolbar de tabla de programación //
    let divWrapperToolbar = document.createElement("div");
    divWrapperToolbar.classList.add("mb-2");

    let divToolbar = document.createElement("div");
    divToolbar.classList.add("header-categoria");

    let labelCategoria = document.createElement("label");
    labelCategoria.setAttribute("class", "form-label label-categoria");
    labelCategoria.innerHTML = "Categoria:";
    divToolbar.appendChild(labelCategoria);

    let selectCategoria = document.createElement("select");
    selectCategoria.setAttribute("class", "form-control select-categoria");
    selectCategoria.setAttribute("style", "margin-right: 10px;");
    let opcionDefaultCategoria = document.createElement("option");
    opcionDefaultCategoria.value = "";
    opcionDefaultCategoria.disabled = true;
    opcionDefaultCategoria.selected = true;
    opcionDefaultCategoria.innerHTML = "Seleccionar categoría";
    selectCategoria.appendChild(opcionDefaultCategoria);

    // Carga de Categorias //
    if (campoTemporada.value != "") {
        let listaCategorias = await programacionJuegos.ListaCategorias();
        if (listaCategorias != null) {
            listaCategorias.forEach(doc => {
                let opcion = document.createElement("option");
                opcion.value = doc.id;
                opcion.innerHTML = doc.data().Descripcion;
                selectCategoria.appendChild(opcion);
            })
        }
    }

    divToolbar.appendChild(selectCategoria);

    let botonLimpiarTablaCategoria = document.createElement("button");
    botonLimpiarTablaCategoria.setAttribute("type", "button");
    botonLimpiarTablaCategoria.setAttribute("style", "width: 12rem; margin-right: 10px;");
    botonLimpiarTablaCategoria.setAttribute("class", "btn btnDashboard btnDashboard-transparent");
    botonLimpiarTablaCategoria.innerHTML = `<i class="fas fa-eraser" style="margin-right: 10px;"></i>Limpiar categoría`;
    botonLimpiarTablaCategoria.addEventListener('click', () => {
        removerJuegos(divWrapperTabla);
        let lastChild = tbodyTablaProgramacion.lastChild;
        tbodyTablaProgramacion.innerHTML = "";
        tbodyTablaProgramacion.appendChild(lastChild);
    });
    divToolbar.appendChild(botonLimpiarTablaCategoria);

    let botonEliminarTablaCategoria = document.createElement("button");
    botonEliminarTablaCategoria.setAttribute("type", "button");
    botonEliminarTablaCategoria.setAttribute("style", "width: 12rem;");
    botonEliminarTablaCategoria.setAttribute("class", "btn btnDashboard btnDashboard-transparent");
    botonEliminarTablaCategoria.innerHTML = `<i class="fas fa-trash-alt" style="margin-right: 10px;"></i>Eliminar categoría`;
    botonEliminarTablaCategoria.addEventListener('click', () => {
        removerJuegos(divWrapperTabla);
        divWrapperTabla.remove();
    });
    divToolbar.appendChild(botonEliminarTablaCategoria);

    divWrapperToolbar.appendChild(divToolbar);
    divWrapperTabla.appendChild(divWrapperToolbar);

    // Tabla de programación //
    let tablaProgramacion = document.createElement("table");
    tablaProgramacion.setAttribute("class", "table table-sm table-bordered");

    // thead //
    let headerTablaProgramacion = document.createElement("thead");
    headerTablaProgramacion.classList.add("thead-dark");

    let trHeaderTablaProgramacion = document.createElement("tr");



    let thFecha = document.createElement("th");
    thFecha.setAttribute("style", "width:20rem;");
    thFecha.setAttribute("scope", "col");
    thFecha.innerHTML = "Fecha";
    trHeaderTablaProgramacion.appendChild(thFecha);

    let thLocal = document.createElement("th");
    thLocal.setAttribute("scope", "col");
    thLocal.innerHTML = "Local";
    trHeaderTablaProgramacion.appendChild(thLocal);

    let thVersus = document.createElement("th");
    thVersus.setAttribute("scope", "col");
    trHeaderTablaProgramacion.appendChild(thVersus);

    let thVisitante = document.createElement("th");
    thVisitante.setAttribute("scope", "col");
    thVisitante.innerHTML = "Visitante";
    trHeaderTablaProgramacion.appendChild(thVisitante);

    let thCampo = document.createElement("th");
    thCampo.setAttribute("scope", "col");
    thCampo.innerHTML = "Campo"
    trHeaderTablaProgramacion.appendChild(thCampo);

    let thStatus = document.createElement("th");
    thStatus.setAttribute("scope", "col");
    trHeaderTablaProgramacion.appendChild(thStatus);

    let thAcciones = document.createElement("th");
    thAcciones.setAttribute("scope", "col");
    thAcciones.innerHTML = "Acciones";
    trHeaderTablaProgramacion.appendChild(thAcciones);

    headerTablaProgramacion.appendChild(trHeaderTablaProgramacion);
    tablaProgramacion.appendChild(headerTablaProgramacion);

    // tbody //
    let tbodyTablaProgramacion = document.createElement("tbody");

    let trBotonNuevaPartida = document.createElement("tr");

    let tdBotonNuevaPartida = document.createElement("td");
    tdBotonNuevaPartida.setAttribute("colspan", "1");

    let botonNuevaPartida = document.createElement("button");
    botonNuevaPartida.setAttribute("type", "button");
    botonNuevaPartida.setAttribute("style", "width:100%;");
    botonNuevaPartida.setAttribute("class", "btn btnDashboard btnDashboard-primary");
    botonNuevaPartida.addEventListener('click', async () => {
        if (selectCategoria.value != "")
            agregarPartida(tbodyTablaProgramacion, trBotonNuevaPartida);
    });
    botonNuevaPartida.innerHTML = "Agregar partida";

    tdBotonNuevaPartida.appendChild(botonNuevaPartida);
    trBotonNuevaPartida.appendChild(tdBotonNuevaPartida);
    tbodyTablaProgramacion.appendChild(trBotonNuevaPartida);
    tablaProgramacion.appendChild(tbodyTablaProgramacion);

    divWrapperTabla.appendChild(tablaProgramacion);

    tablasdeProgramacion.appendChild(divWrapperTabla);
};

const removerJuegos = (tabla) => {
    let cantidadRowsJuegos = tabla.children[1].children[1].children.length - 1;

    for (let i = 0; i < cantidadRowsJuegos; i++) {
        let idRowPartida = tabla.children[1].children[1].children[i].lastChild.children[2].value;
        if (idRowPartida != "")
            idPartidas_eliminar.push(idRowPartida);
    }
    // console.log(idPartidas_eliminar);
}

const agregarPartida = async (tbody, addButonRow, idPartida = '', idCompilacion = '') => {
    let tr = document.createElement("tr");



    // Columna Fecha //
    let tdFecha = document.createElement("td");
    let inputFecha = document.createElement("input");
    inputFecha.setAttribute("type", "datetime-local");
    inputFecha.classList.add("form-control");
    inputFecha.required = true;
    tdFecha.appendChild(inputFecha);
    tr.appendChild(tdFecha);

    // Columna Equipo Local //
    let tdLocal = document.createElement("td");
    let selectLocal = document.createElement("select");
    selectLocal.classList.add("form-control");
    selectLocal.required = true;
    let optionDefaultLocal = document.createElement("option");
    optionDefaultLocal.value = "";
    optionDefaultLocal.disabled = true;
    optionDefaultLocal.selected = true;
    optionDefaultLocal.innerHTML = "Seleccionar Equipo...";
    selectLocal.appendChild(optionDefaultLocal);
    tdLocal.appendChild(selectLocal);
    tr.appendChild(tdLocal);



    // Columna Versus //
    let tdVersus = document.createElement("td");
    tdVersus.classList.add("versus");
    tdVersus.innerHTML = "VS";
    tr.appendChild(tdVersus);

    // Columna Equipo Visitante //
    let tdVisitante = document.createElement("td");
    let selectVisitante = document.createElement("select");
    selectVisitante.classList.add("form-control");
    selectVisitante.required = true;
    let optionDefaultVisitante = document.createElement("option");
    optionDefaultVisitante.value = "";
    optionDefaultVisitante.disabled = true;
    optionDefaultVisitante.selected = true;
    optionDefaultVisitante.innerHTML = "Seleccionar Equipo...";
    selectVisitante.appendChild(optionDefaultVisitante);
    tdVisitante.appendChild(selectVisitante);
    tr.appendChild(tdVisitante);

    // Columna Campo //
    let tdCampo = document.createElement("td");
    let selectCampo = document.createElement("select");
    selectCampo.classList.add("form-control");
    selectCampo.required = true;
    let optionDefaultCampo = document.createElement("option");
    optionDefaultCampo.value = "";
    optionDefaultCampo.disabled = true;
    optionDefaultCampo.selected = true;
    optionDefaultCampo.innerHTML = "Seleccionar Campo...";
    selectCampo.appendChild(optionDefaultCampo);

    let listaCampos = await programacionJuegos.ListaCampos();

    if (listaCampos != null) {
        listaCampos.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Nombre;
            selectCampo.appendChild(opcion);
        });
    }

    tdCampo.appendChild(selectCampo);
    tr.appendChild(tdCampo);

    // Columna Status Compilacion //
    let tdStatusCompilacion = document.createElement("td");
    tdStatusCompilacion.setAttribute("style", "text-align: center; vertical-align: middle;");
    let badgeStatus = document.createElement("div");
    if (idCompilacion != '') {
        badgeStatus.innerHTML = `<i class="fas fa-circle" style="color:#41dc35;"></i>`;
    } else {
        badgeStatus.innerHTML = `<i class="fas fa-circle"></i>`;
    }
    tdStatusCompilacion.appendChild(badgeStatus);
    tr.appendChild(tdStatusCompilacion);

    // Columna Acciones //
    let tdAcciones = document.createElement("td");
    tdAcciones.setAttribute("style", "display:flex;");

    let buttonEliminar = document.createElement("button");
    buttonEliminar.setAttribute("type", "button");
    buttonEliminar.setAttribute("class", "btn btnDashboard btn-danger");
    buttonEliminar.setAttribute("style", "width:100%;margin-right:10px;");
    buttonEliminar.setAttribute("data-opt", "eliminar-partida");

    buttonEliminar.innerHTML = "Eliminar";
    buttonEliminar.addEventListener("click", (evento) => {
        if (idPartida != "") {
            idPartidas_eliminar.push(idPartida);
        }
        let row = evento.target.parentElement.parentElement;
        row.remove();
    });

    tdAcciones.appendChild(buttonEliminar);

    let buttonCompilacion = document.createElement("button");
    buttonCompilacion.setAttribute("type", "button");
    buttonCompilacion.setAttribute("class", "btn btnDashboard btnDashboard-primary");
    buttonCompilacion.setAttribute("style", "width:100%;");
    buttonCompilacion.setAttribute("data-opt", "compilar-partida");
    buttonCompilacion.innerHTML = "Compilar";

    if (idPartida == "")
        buttonCompilacion.disabled = true;

    buttonCompilacion.addEventListener('click', (e) => {
        if (idPartida != "") {
            // console.log(idPartida);
            compilarPartida(campoTemporada.value, e.target.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[0].children[1].value, idPartida);
        }
    });

    tdAcciones.appendChild(buttonCompilacion);

    let hiddenField_partida = document.createElement("input")
    hiddenField_partida.setAttribute("type", "hidden");
    hiddenField_partida.value = idPartida;
    tdAcciones.appendChild(hiddenField_partida);

    let hiddenField_compilacion = document.createElement("input")
    hiddenField_compilacion.setAttribute("type", "hidden");
    hiddenField_compilacion.value = idCompilacion;
    tdAcciones.appendChild(hiddenField_compilacion);

    tr.appendChild(tdAcciones);

    tbody.insertBefore(tr, addButonRow);

    // Cargar Equipos //
    let elementoCategoria = tr.parentElement.parentElement.parentElement.children[0].children[0].children[1];

    if (elementoCategoria.value != "") {
        let listaEquipos = await programacionJuegos.ListaEquipos(campoTemporada.value, elementoCategoria.value);

        if (listaEquipos != null) {


            listaEquipos.forEach(doc => {
                let opcion = document.createElement("option");
                opcion.value = doc.id;
                opcion.innerHTML = doc.data().Nombre_completo;
                // Equipo Local //
                selectLocal.appendChild(opcion);
            });

            listaEquipos.forEach(doc => {
                let opcion = document.createElement("option");
                opcion.value = doc.id;
                opcion.innerHTML = doc.data().Nombre_completo;
                // Equipo Visita //
                selectVisitante.appendChild(opcion);
            });



        }

    }

    // Cargas Campos //



};

const compilarPartida = (temporada, categoria, partida) => {
    window.location.replace(`/Dashboard/compilacion/scorebook.html?t=${temporada}&c=${categoria}&j=${partida}&p=${idRegistro}`);
    // window.open(`/Dashboard/compilacion/scorebook.html?t=${temporada}&c=${categoria}&j=${partida}&p=${idRegistro}`, '_blank');
}
/********************************************/

/*********** EVENTOS DE UTILIDAD **********/
const obtenerDatosTablaCategoria = () => {
    let programacion = [];
    for (let index = 0; index < tablasdeProgramacion.children.length; index++) {
        let programacionPartidas = [];
        let tbodyPartidas = tablasdeProgramacion.children[index].children[1].children[1].children;
        let tbodyPartidasLength = tbodyPartidas.length - 1;

        for (let i = 0; i < tbodyPartidasLength; i++) {
            let partida = null;
            if (modoRegistro === "nuevo") {

                partida = {
                    id: programacionJuegos.generarUUID(),
                    fecha: new Date(tbodyPartidas[i].children[0].children[0].value),
                    local: tbodyPartidas[i].children[1].children[0].value,
                    visitante: tbodyPartidas[i].children[3].children[0].value,
                    campo: tbodyPartidas[i].children[4].children[0].value,
                    compilacion: ""
                };

            } else if (modoRegistro === "actualizar") {
                let idPartida_log = tbodyPartidas[i].children[6].children[2].value;
                // let idCompilacio_log = tbodyPartidas[i].children[5].children[3].value;
                if (idPartida_log == "")
                    idPartida_log = programacionJuegos.generarUUID();

                partida = {
                    id: idPartida_log,
                    fecha: new Date(tbodyPartidas[i].children[0].children[0].value),
                    local: tbodyPartidas[i].children[1].children[0].value,
                    visitante: tbodyPartidas[i].children[3].children[0].value,
                    campo: tbodyPartidas[i].children[4].children[0].value,
                    compilacion: tbodyPartidas[i].children[6].children[3].value
                };


            }


            programacionPartidas.push(partida);
        }

        let programacionCategoria = {
            categoria: tablasdeProgramacion.children[index].children[0].children[0].children[1].value,
            partidas: programacionPartidas
        };

        programacion.push(programacionCategoria);
    }
    return programacion;
};

// Limpieza de formulario //
const limpiarFormulario = () => {
    ldFormulario.reset();
    tablasdeProgramacion.innerHTML = "";
};

// Regresa al grid con las noticias //
const regresarGrid = () => {
    document.getElementById('ld_principal').classList.remove('hide');
    document.getElementById('seccion_ld_formulario').classList.add('hide');
};
/********************************************/


/*********** EVENTOS DE ELEMENTOS **********/
// Guardar Formulario Registro //
ldFormulario.addEventListener("submit", async (e) => {
    e.preventDefault();
    modoRegistro = document.getElementById('btn_submit').value;
    let response;

    // obtenerDatosTablaCategoria();

    const dataFormulario = {
        nombre: campoNombre.value,
        temporada: campoTemporada.value,
        programacion: obtenerDatosTablaCategoria(),
        usuario: uidUser
    };

    if (modoRegistro === "nuevo") {
        response = await programacionJuegos.crear(dataFormulario);
    } else if (modoRegistro === "actualizar") {
        response = await programacionJuegos.actualizar(dataFormulario, idRegistro);
    }

    if (response == "1") {

        // Eliminar Eventos Calendario/Compilacion (Si lo hay) //
        for (let i = 0; i < idPartidas_eliminar.length; i++) {
            await programacionJuegos.eliminar_partida_calendario(idPartidas_eliminar[i]);
        }

        let listaProgramacion = await programacionJuegos.leer();
        obtenerProgramaciones(listaProgramacion);
        idPartidas_eliminar = [];
        regresarGrid();

    } else {
        console.error(response);
    }
});


btnCalendarizar.addEventListener("click", () => {
    $("#modal-calendarizar").modal("show");
});

document.getElementById("btnModalCalendarizar_Aceptar").addEventListener("click", async () => {
    $("#modal-calendarizar").modal("hide");
    btnCalendarizar.disabled = true;
    await programacionJuegos.calendarizar(idRegistro, uidUser);
    btnCalendarizar.disabled = false;
    btnCalendarizar.innerHTML = "Calendarizar";
    btnCalendarizar.setAttribute("style", "width:20rem;");
});

btnAgregarCategoria.addEventListener("click", () => {
    if (campoTemporada.value != "")
        agregarCategoria();
});

btnSiguiente.addEventListener("click", async () => {
    let programacion = await programacionJuegos.paginaSiguiente(ultimoDocumento);
    obtenerProgramaciones(programacion);
});

btnAtras.addEventListener("click", async () => {
    let programacion = await programacionJuegos.paginaAnterior(primerDocumento);
    obtenerProgramaciones(programacion);
});

// Abrir nuevo registro de programación de juego //
btnNuevo.addEventListener("click", async (e) => {
    idPartidas_eliminar = [];
    limpiarFormulario();
    document.getElementById('ld_principal').classList.add('hide');
    document.getElementById('seccion_ld_formulario').classList.remove('hide');
    document.getElementById('titulo-formulario').innerHTML = 'Nuevo registro';
    document.getElementById('btn_submit').innerHTML = 'Guardar';
    document.getElementById('btn_submit').setAttribute("value", "nuevo");
});

// Boton para regresar del formulario a la tabla principal de programacion //
btnFormularioRegresar.addEventListener("click", () => {
    regresarGrid();
});

// Boton de eliminar dentro del modal de confirmación //
btnModalEliminar.addEventListener("click", async (e) => {
    let eliminarProgramacion = await programacionJuegos.eliminar(e.target.value);

    if (eliminarProgramacion == "1") {
        $('#modal-eliminar').modal('hide');
        let listaProgramacion = await programacionJuegos.leer();
        obtenerProgramaciones(listaProgramacion);
    } else {
        console.log(eliminarProgramacion);
    }
});

/********************************************/