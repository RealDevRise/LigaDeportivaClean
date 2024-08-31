import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "./firebaseCore.js";
import { Obtener_Nombre_Categoria } from "./core/categorias.js";
import { Obtener_Nombre_Equipo } from "./core/equipos.js";

const limitePaginacion = 5;

// Crear
const crear = async (datos) => {
    try {
        const docRef = await addDoc(collection(db, "ProgramacionJuegos"), {
            nombre: datos.nombre,
            temporada: datos.temporada,
            programacion: datos.programacion,
            autor: datos.usuario,
            fecha: Timestamp.now()
        });
        return "1";
    } catch (e) {
        return e;
    }
}

// Actualizar
const actualizar = async (datos, id) => {
    const docRef = doc(db, "ProgramacionJuegos", id);

    try {
        await updateDoc(docRef, {
            nombre: datos.nombre,
            temporada: datos.temporada,
            programacion: datos.programacion
        });
        return "1";
    } catch (e) {
        return e;
    }
}

// Leer
const leer = async () => {
    const consulta = query(collection(db, "ProgramacionJuegos"),
        orderBy("fecha", "desc"),
        limit(limitePaginacion)
    );

    const snapshot = await getDocs(consulta);

    if (snapshot.docs.length > 0)
        return snapshot;
    else
        return null;
}

// Eliminar
const eliminar = async (id) => {
    try {
        await eliminar_partida_calendario_por_programacion(id);
        await deleteDoc(doc(db, "ProgramacionJuegos", id));

        return "1";
    } catch (e) {
        return e;
    }
}

// Eliminar Evento Calendario //
const eliminar_partida_calendario = async (id) => {
    try {
        const consulta = query(collection(db, "Calendario"),
            where("Id_partida", "==", id)
        );
        const snap = await getDocs(consulta);

        if (snap.docs.length > 0) {
            snap.forEach(async (documento) => {
                await deleteDoc(doc(db, "Calendario", documento.id));
            });
        }

        return "1";
    } catch (e) {
        console.log(e);
        return e;
    }
}

const eliminar_partida_calendario_por_programacion = async (id) => {
    try {
        const consulta = query(collection(db, "Calendario"),
            where("Id_programacion", "==", id)
        );
        const snap = await getDocs(consulta);

        if (snap.docs.length > 0) {
            snap.forEach(async (documento) => {
                await deleteDoc(doc(db, "Calendario", documento.id));
            });
        }
    } catch (e) {
        console.log(e);
        return e;
    }
}

// Eliminar Compilacion Partida //
const eliminar_partida_compilacion = async (id) => {
    try {
        const consulta = query(collection(db, "Compilacion"),
            where("partida", "==", id)
        );

        const snap = await getDocs(consulta);

        if (snap.docs.length > 0) {
            snap.forEach(async (documento) => {
                await deleteDoc(doc(db, "Compilacion", documento.id));
            });
        }

        return "1";
    } catch (e) {
        console.log(e);
        return e;
    }
}

// Eliminar Standing //

// Obtener programacion
const obtener = async (id) => {
    const docRef = doc(db, "ProgramacionJuegos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
        return docSnap;
    else
        return null;
}

// Otras funciones //
const ListaTemporadas = async () => {
    const consulta = query(collection(db, "Temporadas"));
    const snapshot = await getDocs(consulta);

    if (snapshot.docs.length > 0)
        return snapshot;
    else
        return null;
}

const ListaCategorias = async (temporada) => {
    const consulta = query(collection(db, "Categorias"));
    const documentSnapshot = await getDocs(consulta);

    if (documentSnapshot.docs.length > 0)
        return documentSnapshot;
    else
        return null;
}

const ListaEquipos = async (temporada, categoria) => {
    const consulta = query(collection(db, "Equipos"),
        where("Temporada", "==", temporada),
        where("Categoria", "==", categoria),
        orderBy("Nombre_completo", "asc")
    );
    const documentSnapshot = await getDocs(consulta);

    if (documentSnapshot.docs.length > 0) {
        return documentSnapshot;
    } else {
        return null;
    }
}

const ListaCampos = async () => {
    const consulta = query(collection(db, "Campos"));
    const documentSnapshot = await getDocs(consulta);

    if (documentSnapshot.docs.length > 0)
        return documentSnapshot;
    else
        return null;
}

const Obtener_Dato_Campo = async (IdCampo) => {
    const docRef = doc(db, "Campos", IdCampo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap;
    } else {
        console.error(`Error al obtener datos de la persona Message ID: ${IdCategoria}`);
        return null;
    }
}

const generarUUID = () => {
    let
        d = new Date().getTime(),
        d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        let r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
};

const paginaSiguiente = async (doc) => {
    const consulta = query(collection(db, "ProgramacionJuegos"),
        orderBy("fecha", "desc"),
        limit(limitePaginacion),
        startAfter(doc)
    );

    const snapshot = await getDocs(consulta);

    if (snapshot.docs.length > 0)
        return snapshot;
    else
        return null;
}

const paginaAnterior = async (doc) => {
    const consulta = query(collection(db, "ProgramacionJuegos"),
        orderBy("fecha", "desc"),
        endBefore(doc),
        limitToLast(limitePaginacion)
    );

    const snapshot = await getDocs(consulta);

    if (snapshot.docs.length > 0)
        return snapshot;
    else
        return null;
}

const calendarizar = async (id, idAutor) => {
    let btnCalendarizar = document.getElementById("btnCalendarizar");
    btnCalendarizar.setAttribute("style", "width:30rem;");

    // Elimina todos los registros que existan en el calendario con el id de programacion //
    const consulta_calendario = query(collection(db, "Calendario"),
        where("Id_programacion", "==", id)
    );

    const snap_calendario = await getDocs(consulta_calendario);

    if (snap_calendario.docs.length > 0) {
        snap_calendario.forEach(async (document) => {
            await deleteDoc(doc(db, "Calendario", document.id));
        });
    }


    let docSnap = await obtener(id);

    if (docSnap.exists()) {
        let contadorP = 0;
        let contadorJ = 0;
        let options_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        // Obtener las partidas por categoría/modalidad
        for (let i = 0; i < docSnap.data().programacion.length; i++) {
            contadorP++;
            contadorJ = 0;
            // document.getElementById("btnCalendarizar").innerHTML = `Calendarizando: ${contadorP}/${docSnap.data().programacion.length}`;

            for (let j = 0; j < docSnap.data().programacion[i].partidas.length; j++) {
                contadorJ++;
                btnCalendarizar.innerHTML = `Procesando... (${contadorP}/${docSnap.data().programacion.length} Categorías) (${contadorJ}/${docSnap.data().programacion[i].partidas.length} Juegos)`;
                let nombre_local = await obtenerNombreEquipo(docSnap.data().programacion[i].partidas[j].local);
                let nombre_visita = await obtenerNombreEquipo(docSnap.data().programacion[i].partidas[j].visitante);
                let nombre_campo = await obtenerNombreCampo(docSnap.data().programacion[i].partidas[j].campo);
                let fecha_juego = docSnap.data().programacion[i].partidas[j].fecha.toDate().toLocaleDateString("es-MX", options_date);
                let descripcion_juego = `EL JUEGO SE LLEVARÁ A CABO EN ${nombre_campo} EL DÍA ${fecha_juego}`;
                let titulo_calendario = `${nombre_local} VS ${nombre_visita}`;

                const docRef = await addDoc(collection(db, "Calendario"), {
                    Titulo: titulo_calendario,
                    Descripcion: descripcion_juego.toUpperCase(),
                    Fecha: docSnap.data().programacion[i].partidas[j].fecha,
                    Autor: idAutor,
                    Tipo_evento: 0,
                    Equipo_a: docSnap.data().programacion[i].partidas[j].local,
                    Equipo_b: docSnap.data().programacion[i].partidas[j].visitante,
                    Id_partida: docSnap.data().programacion[i].partidas[j].id,
                    Id_programacion: id
                });

            }

        }


    } else {
        return;
    }
}

const obtenerNombreEquipo = async (id) => {
    const docRef = doc(db, "Equipos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
        return docSnap.data().Nombre_completo;
    else
        return null;
}

const obtenerNombreCampo = async (id) => {
    const docRef = doc(db, "Campos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
        return docSnap.data().Nombre;
    else
        return null;
}

// FILTRACION DE PROGRAMACION DE JUEGOS
const iterate = (item, index) => {
    let listaPartidas = [];
    item.data().programacion.forEach(doc => {
        console.log(doc);
        listaPartidas.push(doc);
    });
    // console.log(listaPartidas);
    // return listaPartidas;
}

const filtrar_por_equipo = async (IdEquipo) => {
    let _programacion = [];
    let listaProgramacion = [];
    let ArregloElementosProgramacion = [];
    const consulta = query(collection(db, "ProgramacionJuegos"));
    const snapshot = await getDocs(consulta);

    if (snapshot.docs.length > 0) {


        await Promise.all(snapshot.docs.map(async (item) => {

            let IdProgramacionJuegos = item.id;
            let nombreProgramacion = "";
            let nombreCategoria = "";
            let IdTemporada = item._document.data.value.mapValue.fields.temporada.stringValue;
            nombreProgramacion = item._document.data.value.mapValue.fields.nombre.stringValue;
            

            // AQUI ACCEDEMOS AL ARREGLO DE LA PROGRAMACIÓN
            await Promise.all(item._document.data.value.mapValue.fields.programacion.arrayValue.values.map(async (Programacion, indexProgramacion) => {

                nombreCategoria = Programacion.mapValue.fields.categoria.stringValue;
                let ContenedorProgramacionTabla = await Filtro_ConstruirCategoria(nombreProgramacion, nombreCategoria);
                let tbodyProgramacionTabla = ContenedorProgramacionTabla.children[1].children[1];

                // AQUÍ ACCEDEMOS A LAS PARTIDAS DE CADA PROGRAMACIÓN
                await Promise.all(Programacion.mapValue.fields.partidas.arrayValue.values.map(async (Partida, indexPartida) => {


                    let EquipoLocal = Partida.mapValue.fields.local.stringValue;
                    let EquipoVisita = Partida.mapValue.fields.visitante.stringValue;
                    let IdPartida = Partida.mapValue.fields.id.stringValue;
                    let IdCompilacion = Partida.mapValue.fields.compilacion.stringValue;
                    let IdCampo = Partida.mapValue.fields.campo.stringValue

                    if (EquipoLocal == IdEquipo || EquipoVisita == IdEquipo) {
                        // Aqui Armaremos el Row con los detalles de la partida
                        // donde tendra acceso a la compilación.
                        // Nota: Lo mejor sería abrirlo en una pestaña nueva, así para no perder la busqueda.

                        let CategoriaID = Programacion.mapValue.fields.categoria.stringValue;
                        let rowPartida = await Filtro_ConstruirPartidas(IdTemporada, CategoriaID, IdPartida, IdCompilacion, IdProgramacionJuegos);
                        

                        // Asignar valores a los campos //

                        // FECHA DE LA PARTIDA //
                        let fechaData = new Date(Partida.mapValue.fields.fecha.timestampValue);
                        fechaData.setMinutes(fechaData.getMinutes() - fechaData.getTimezoneOffset());
                        rowPartida.children[0].children[0].value = fechaData.toISOString().slice(0, -1);

                        // EQUIPO LOCAL //
                        let nombreEquipoLocal = await Obtener_Nombre_Equipo(EquipoLocal);
                        let ElementoSelectEquipoLocal = rowPartida.children[1].children[0];
                        if (nombreEquipoLocal != null) {
                            let opcion = document.createElement("option");
                            opcion.value = nombreEquipoLocal.id;
                            opcion.innerHTML = nombreEquipoLocal.data().Nombre_completo;
                            ElementoSelectEquipoLocal.appendChild(opcion);
                        }
                        ElementoSelectEquipoLocal.value = EquipoLocal;


                        // EQUIPO VISITA //
                        let nombreEquipovisita = await Obtener_Nombre_Equipo(EquipoVisita);
                        let ElementoSelectEquipoVisita = rowPartida.children[3].children[0];
                        if (nombreEquipovisita != null) {
                            let opcion = document.createElement("option");
                            opcion.value = nombreEquipovisita.id;
                            opcion.innerHTML = nombreEquipovisita.data().Nombre_completo;
                            ElementoSelectEquipoVisita.appendChild(opcion);
                        }
                        ElementoSelectEquipoVisita.value = EquipoVisita;


                        // CAMPO //
                        let ElementoCampo = rowPartida.children[4].children[0];
                        let DataCampo = await Obtener_Dato_Campo(IdCampo);

                        if (DataCampo != null) {
                            let opcion = document.createElement("option");
                            opcion.value = DataCampo.id;
                            opcion.innerHTML = DataCampo.data().Nombre;
                            ElementoCampo.appendChild(opcion);
                        }
                        ElementoCampo.value = IdCampo;

                        tbodyProgramacionTabla.appendChild(rowPartida);
                    }

                }));


                if (tbodyProgramacionTabla.childElementCount > 0) {
                    ArregloElementosProgramacion.push(ContenedorProgramacionTabla);
                }

            }));
        }));

        return ArregloElementosProgramacion;
    }
    else
        return null;
}

const Filtro_ConstruirCategoria = async (NombreProgramacion, IdCategoria) => {
    let divWrapperTabla = document.createElement("div");
    divWrapperTabla.setAttribute("class", "pb-4");

    // Toolbar de tabla de programación //
    let divWrapperToolbar = document.createElement("div");
    divWrapperToolbar.classList.add("mb-2");
    divWrapperToolbar.setAttribute("style", "display:flex; flex-direction:row; justify-content:space-between;");

    let divToolbar = document.createElement("div");
    divToolbar.classList.add("header-categoria");

    let h5Programacion = document.createElement("h5");
    h5Programacion.innerHTML = `PROGRAMACIÓN: <span>${NombreProgramacion}</span>`;
    divToolbar.appendChild(h5Programacion);

    let divToolbarCategoria = document.createElement("div");
    divToolbarCategoria.classList.add("header-categoria");


    let nombreCategoria = await Obtener_Nombre_Categoria(IdCategoria);
    let h5Categoria = document.createElement("h5");
    h5Categoria.innerHTML = `CATEGORÍA: <span>${nombreCategoria}</span>`;
    divToolbarCategoria.appendChild(h5Categoria);


    // let selectCategoria = document.createElement("select");
    // selectCategoria.setAttribute("class", "form-control select-categoria");
    // selectCategoria.setAttribute("style", "margin-right: 10px;");
    // let opcionDefaultCategoria = document.createElement("option");
    // opcionDefaultCategoria.value = "";
    // opcionDefaultCategoria.disabled = true;
    // opcionDefaultCategoria.selected = true;
    // opcionDefaultCategoria.innerHTML = "Seleccionar categoría";
    // selectCategoria.appendChild(opcionDefaultCategoria);

    // // Carga de Categorias //
    // if (campoTemporada.value != "") {
    //     let listaCategorias = await programacionJuegos.ListaCategorias();
    //     if (listaCategorias != null) {
    //         listaCategorias.forEach(doc => {
    //             let opcion = document.createElement("option");
    //             opcion.value = doc.id;
    //             opcion.innerHTML = doc.data().Descripcion;
    //             selectCategoria.appendChild(opcion);
    //         })
    //     }
    // }

    // divToolbar.appendChild(selectCategoria);

    // let botonLimpiarTablaCategoria = document.createElement("button");
    // botonLimpiarTablaCategoria.setAttribute("type", "button");
    // botonLimpiarTablaCategoria.setAttribute("style", "width: 12rem; margin-right: 10px;");
    // botonLimpiarTablaCategoria.setAttribute("class", "btn btnDashboard btnDashboard-transparent");
    // botonLimpiarTablaCategoria.innerHTML = `<i class="fas fa-eraser" style="margin-right: 10px;"></i>Limpiar categoría`;
    // botonLimpiarTablaCategoria.addEventListener('click', () => {
    //     removerJuegos(divWrapperTabla);
    //     let lastChild = tbodyTablaProgramacion.lastChild;
    //     tbodyTablaProgramacion.innerHTML = "";
    //     tbodyTablaProgramacion.appendChild(lastChild);
    // });
    // divToolbar.appendChild(botonLimpiarTablaCategoria);

    // let botonEliminarTablaCategoria = document.createElement("button");
    // botonEliminarTablaCategoria.setAttribute("type", "button");
    // botonEliminarTablaCategoria.setAttribute("style", "width: 12rem;");
    // botonEliminarTablaCategoria.setAttribute("class", "btn btnDashboard btnDashboard-transparent");
    // botonEliminarTablaCategoria.innerHTML = `<i class="fas fa-trash-alt" style="margin-right: 10px;"></i>Eliminar categoría`;
    // botonEliminarTablaCategoria.addEventListener('click', () => {
    //     removerJuegos(divWrapperTabla);
    //     divWrapperTabla.remove();
    // });
    // divToolbar.appendChild(botonEliminarTablaCategoria);

    divWrapperToolbar.appendChild(divToolbar);
    divWrapperToolbar.appendChild(divToolbarCategoria);
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

    // let trBotonNuevaPartida = document.createElement("tr");

    // let tdBotonNuevaPartida = document.createElement("td");
    // tdBotonNuevaPartida.setAttribute("colspan", "1");

    // let botonNuevaPartida = document.createElement("button");
    // botonNuevaPartida.setAttribute("type", "button");
    // botonNuevaPartida.setAttribute("style", "width:100%;");
    // botonNuevaPartida.setAttribute("class", "btn btnDashboard btnDashboard-primary");
    // botonNuevaPartida.addEventListener('click', async () => {
    //     if (selectCategoria.value != "")
    //         agregarPartida(tbodyTablaProgramacion, trBotonNuevaPartida);
    // });
    // botonNuevaPartida.innerHTML = "Agregar partida";

    // tdBotonNuevaPartida.appendChild(botonNuevaPartida);
    // trBotonNuevaPartida.appendChild(tdBotonNuevaPartida);
    // tbodyTablaProgramacion.appendChild(trBotonNuevaPartida);
    tablaProgramacion.appendChild(tbodyTablaProgramacion);

    divWrapperTabla.appendChild(tablaProgramacion);

    return divWrapperTabla;
    // tablasdeProgramacion.appendChild(divWrapperTabla);
}

const Filtro_ConstruirPartidas = async (idTemporada, idCategoria, idPartida = '', idCompilacion = '', IdProgramacionJuegos = '') => {
    let tr = document.createElement("tr");

    // Columna Fecha //
    let tdFecha = document.createElement("td");
    let inputFecha = document.createElement("input");
    inputFecha.setAttribute("type", "datetime-local");
    inputFecha.classList.add("form-control");
    inputFecha.required = false;
    inputFecha.disabled = true;
    tdFecha.appendChild(inputFecha);
    tr.appendChild(tdFecha);

    // Columna Equipo Local //
    let tdLocal = document.createElement("td");
    let selectLocal = document.createElement("select");
    selectLocal.classList.add("form-control");
    selectLocal.required = false;
    selectLocal.disabled = true;

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
    selectVisitante.required = false;
    selectVisitante.disabled=true;
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
    selectCampo.required = false;
    selectCampo.disabled = true;
    let optionDefaultCampo = document.createElement("option");
    optionDefaultCampo.value = "";
    optionDefaultCampo.disabled = true;
    optionDefaultCampo.selected = true;
    optionDefaultCampo.innerHTML = "Seleccionar Campo...";
    selectCampo.appendChild(optionDefaultCampo);

    // let listaCampos = await programacionJuegos.ListaCampos();

    // if (listaCampos != null) {
    //     listaCampos.forEach(doc => {
    //         let opcion = document.createElement("option");
    //         opcion.value = doc.id;
    //         opcion.innerHTML = doc.data().Nombre;
    //         selectCampo.appendChild(opcion);
    //     });
    // }

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

            compilarPartida(idTemporada, idCategoria, idPartida, IdProgramacionJuegos);
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

    return tr;

    // tbody.insertBefore(tr, addButonRow);

    // Cargar Equipos //
    // let elementoCategoria = tr.parentElement.parentElement.parentElement.children[0].children[0].children[1];

    // if (elementoCategoria.value != "") {
    //     let listaEquipos = await programacionJuegos.ListaEquipos(campoTemporada.value, elementoCategoria.value);

    //     if (listaEquipos != null) {


    //         listaEquipos.forEach(doc => {
    //             let opcion = document.createElement("option");
    //             opcion.value = doc.id;
    //             opcion.innerHTML = doc.data().Nombre_completo;
    //             // Equipo Local //
    //             selectLocal.appendChild(opcion);
    //         });

    //         listaEquipos.forEach(doc => {
    //             let opcion = document.createElement("option");
    //             opcion.value = doc.id;
    //             opcion.innerHTML = doc.data().Nombre_completo;
    //             // Equipo Visita //
    //             selectVisitante.appendChild(opcion);
    //         });



    //     }

    // }
}

const compilarPartida = (temporada, categoria, partida, programacionJuegos) => {
    // window.location.replace(`/Dashboard/compilacion/scorebook.html?t=${temporada}&c=${categoria}&j=${partida}&p=${programacionJuegos}`);
    window.open(`/Dashboard/compilacion/scorebook.html?t=${temporada}&c=${categoria}&j=${partida}&p=${programacionJuegos}`, '_blank');
    // window.open(`/Dashboard/compilacion/scorebook.html?t=${temporada}&c=${categoria}&j=${partida}&p=${idRegistro}`, '_blank');
}


const Filtro_TableBuilder = async (item) => {
    let listaProgramacion = [];

    console.log(item._document.data.value.mapValue.fields.nombre.stringValue);
    // console.log(item._document.data.value.mapValue.fields.programacion);

    await Promise.all(item._document.data.value.mapValue.fields.programacion.arrayValue.values.map(async (PartidasCategoria) => {

        // let nombreCategoria = await Obtener_Nombre_Categoria(PartidasCategoria.mapValue.fields.categoria.stringValue);
        // console.log(nombreCategoria);
        console.log(PartidasCategoria.mapValue.fields);
    }));
    // await Promise.all(item.data().programacion.map(async(documento)=>{
    //     console.log(item.data().nombre);    
    //     let nombreCategoria = await Obtener_Nombre_Categoria(documento.categoria);
    //     console.log(nombreCategoria);

    //     await Promise.all(documento.partidas.map(async(partida) =>{
    //         console.log("Partida:");
    //         console.log(partida.id);
    //     }));

    // }));

    // console.log(item.data().programacion.length);

    // Contenedor de la tabla
    let divWrapperTable = document.createElement("div");
    divWrapperTable.classList.add("pb-4");

    // Contenedor Programacion / Categoria
    let divWrapperTitulo = document.createElement("div");
    divWrapperTitulo.classList.add("mb-2");
    divWrapperTitulo.setAttribute("style", "flex; flex-direction:row; justify-content:space-between;");

    // Titulo Programacion
    let headerProgramacion = document.createElement("div");
    headerProgramacion.classList.add("header-categoria");

    let h5Programacion = document.createElement("h5");
    h5Programacion.innerHTML = `PROGRAMACIÓN: <span>${item.data().nombre}</span>`;

    // Titulo Categoria
    let headerCategoria = document.createElement("div");
    headerCategoria.classList.add("header-categoria");

    let h5Categoria = document.createElement("h5");
    h5Categoria.innerHTML = `CATEGORÍA: <span>${item.data().nombre}</span>`;

}

export {
    crear,
    actualizar,
    leer,
    obtener,
    eliminar,
    ListaTemporadas,
    ListaCategorias,
    ListaEquipos,
    ListaCampos,
    paginaSiguiente,
    paginaAnterior,
    calendarizar,
    eliminar_partida_calendario,
    eliminar_partida_compilacion,
    auth,
    onAuthStateChanged,
    generarUUID,
    filtrar_por_equipo
}