import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "./firebaseCore.js";
import * as jsPDF from "./jspdf.umd.min.js";
import "./jspdf.plugin.autotable.js";
import * as corePersonas from "./core/personas.js";
import * as coreBitacoraPersona from "./core/bitacorapersonas.js";
import * as coreCategoriaJugador from "./core/categoriajugador.js";
import { Cargar_Todos_Los_Equipos } from "./core/equipos.js";


const contenedorNoticias = document.getElementById("ld_contenedor_tabla");
const ldFormulario = document.getElementById("ld_formulario");
const btnNuevo = document.getElementById("btn_nuevo");
const btnFormularioRegresar = document.getElementById("btnFormulario_regresar");
const btnSiguiente = document.getElementById("btn_siguiente");
const btnAtras = document.getElementById("btn_previo");
const btnModalEliminar = document.getElementById("btnModal_eliminar");
const ldContenedorTabla = document.getElementById("ld_contenedor_tabla");
const fileUploaded = document.getElementById("imageUploader");
const galeriaImagenesSubidas = document.getElementById("galeriaImagen_subidas");
const botonVerIntegrantes = document.getElementById("btnIntegrantes");
const tablaIntegrantes = document.getElementById("tablaIntegrantes");
const cuerpoTabla = document.getElementById("cuerpoTabla");
const btnExportar = document.getElementById("btn_exportar_equipos");
const formularioBuscador = document.getElementById("form_buscador");
const campoBusqueda = document.getElementById("nombre_busqueda");

const seccionTablaIntegrantes = document.getElementById("divTablaIntegrantes");
const formularioJugador = document.getElementById("divFormularioAgregarJugador");
const tituloModalIntegrantes = document.getElementById("modalTituloIntegrantes");


const campoNombreCompletoEquipo = document.getElementById("inputNombre");
const campoNombreCortoEquipo = document.getElementById("inputNombreCorto");
const campoTemporada = document.getElementById("selectTemporada");
const campoCategoria = document.getElementById("selectCategoria");
const campoManager = document.getElementById("inputManager");
const campoCoach = document.getElementById("inputCoach");
const campoCupo = document.getElementById("inputCupo");
const campoPatrocinador = document.getElementById("inputPatrocinador");


// Seccion formulario integrantes //
const botonAgregarJugador = document.getElementById("btnAgregarJugador");
const formularioIntegrantes = document.getElementById("formulario_integrantes");
const botonSubmitIntegrantes = document.getElementById("btnFormularioIntegrantes_Submit");
const botonRegresarIntegrantes = document.getElementById("btnFormularioIntegrantes_Regresar");

const campoNombreCompletoIntegrante = document.getElementById("input_nombreCompleto");
const campoNombreCortoIntegrante = document.getElementById("input_nombreCorto");
const campoTemporadaActualIntegrante = document.getElementById("select_temporada");
const campoCategoriaActualIntegrante = document.getElementById("select_categoria");
const campoFechaNacimientoIntegrante = document.getElementById("input_fechaNacimiento");
const campoCamisaIntegrante = document.getElementById("input_numeroCamisa");

const campoTelefonoJugador = document.getElementById("input_telefonoJugador");
const campoEdadLiga = document.getElementById("select_edadLiga");
const campoRegistroAsociacion = document.getElementById("input_registroAsociacion");
const campoEquipoOrigen = document.getElementById("select_equipoOrigen");
const campoObservacionesJugador = document.getElementById("input_observacionesJugador");

const campoDireccionCalleIntegrante = document.getElementById("input_calle");
const campoDireccionNumeroIntegrante = document.getElementById("input_numero");
const campoDireccionColoniaIntegrante = document.getElementById("input_colonia");
const campoDireccionCiudadIntegrante = document.getElementById("input_ciudad");
const campoDireccionEstadoIntegrante = document.getElementById("input_estado");
const campoDireccionPaisIntegrante = document.getElementById("input_pais");

const campoNombrePadreIntegrante = document.getElementById("input_nombrePadre");
const campoTelefonoPadreIntegrante = document.getElementById("input_telefonoPadre");
const campoEmailPadreIntegrante = document.getElementById("input_emailPadre");
const campoNombreMadreIntegrante = document.getElementById("input_nombreMadre");
const campoTelefonoMadreIntegrante = document.getElementById("input_telefonoMadre");
const campoEmailMadreIntegrante = document.getElementById("input_emailMadre");

const campoSeleccionJugadorDisponible = document.getElementById("select_jugadores_disponibles");
const botonJugadorExistente = document.getElementById("btnAgregarJugadorExistente");

const campoCurp = document.getElementById("input_curp");
const campoCategoriaJugador = document.getElementById("select_categoriaJugador");
const campoFechaMovimiento = document.getElementById("input_fechaMovimiento");
const campoObservacionMovimiento = document.getElementById("input_observacionesMovimiento");

// Seccion Formulario Baja de jugador
const contenedorRetiro = document.getElementById("contenedor_retiro");
const formularioRetiroJugador = document.getElementById("formulario_retiro_jugador");
const labelJugadorRetiro = document.getElementById("lbl_nombre_retiro_jugador");
const textAreaMotivoBaja = document.getElementById("textarea_motivo_retiro");
const btnCancelarRetiro = document.getElementById("btnFormularioRetiro_Regresar");
const hidden_id_jugador = document.getElementById("hidden_id_jugador_retiro");

const campoFechaMovimientoAltaBaja = document.getElementById("input_fechaMovimientoAlta");
const hiddenControlBitacora = document.getElementById("hiddenModalidad");


// Formulario de carga de jugadores
const btn_cancelar_carga = document.getElementById("btn_cancel_carga");
const btn_cargar_jugadores = document.getElementById("btn_submit_carga");
const formulario_carga = document.getElementById("formulario_carga_jugadores");
const contenedor_carga_jugadores = document.getElementById("contenedor_carga_jugadores");
const uploader_jugadores = document.getElementById("csvUploader");
const hiddenCSV = document.getElementById("hiddenCVS");

const limite = 5;
let ultimoDocumento = null;
let primerDocumento = null;
let uidUser = "";
let id_Temporal = "";
let id_jugador = null;
let imagenes_subidas = [];
let imagenerPorEliminar = [];
let precarga_temporada = "";
let precarga_categoria = "";
let modoEditJugador = false;
let cache_busqueda = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        const name_dropdown = document.getElementById("menu-dropdown");
        name_dropdown.innerHTML = user.displayName;
        name_dropdown.setAttribute("usrid", user.uid);
        ldObtener(user.uid);
        cargaDatosFormulario(user.uid);
        uidUser = user.uid;
    } else {
        window.location.replace('/Login.html');
    }
});

formularioBuscador.addEventListener("submit", async(e) => {
    e.preventDefault();
    await busquedaEquipo();
});

const busquedaEquipo = async() => {
    let documentSnapshot = null;


    if (campoBusqueda.value == '' && cache_busqueda != null) {
        location.reload();
        return;
    }

    if (campoBusqueda.value != '') {
        if (cache_busqueda == null) {
            const consulta = query(collection(db, "Equipos"),
                orderBy("Nombre_completo")
            );

            documentSnapshot = await getDocs(consulta);

            if (documentSnapshot.docs.length > 0) {
                document.getElementById("control-paginado").classList.add("hide");
                cache_busqueda = documentSnapshot;
            }
        } else {
            documentSnapshot = cache_busqueda;
        }

        if (documentSnapshot.docs.length > 0) {
            ldArmarTarjetas_busqueda(documentSnapshot);
        }
    }
};






// CARGA DE JUGADORES MASIVOS
formulario_carga.addEventListener("submit", async(e) => {
    e.preventDefault();
    console.log(hiddenCSV.value);
    let jsonData = JSON.parse(hiddenCSV.value);

    // Guardar Jugadores //
    await Promise.all(jsonData.map(async(valor) => {

        if (valor[0] != '') {

            let nacimiento = "";
            let telJugador = "";
            let curpjugador = "";

            if (valor[1] != '') {
                let dateString = valor[1];
                let dateParts = dateString.split("/");
                let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                nacimiento = dateObject;
            }

            if (valor[2] != '') {
                telJugador = valor[2].replace(/\D/g, '');
            }

            if (valor[3] != '')
                curpjugador = valor[3];


            // CARGAR LA FECHA Y CONVERTIRLO
            const jsonData = {
                nombreCompleto: valor[0],
                nombreCorto: valor[0],
                temporadaActual: btn_cargar_jugadores.getAttribute("data-temporada"),
                categoriaActual: btn_cargar_jugadores.getAttribute("data-categoria"),
                equipoActual: btn_cargar_jugadores.getAttribute("data-id"),
                fechaNacimiento: nacimiento,
                curp: curpjugador,
                tipoPersona: "jugador",
                calle: "",
                noCasa: "",
                categoriajugador: "",
                telefonojugador: telJugador,
                edadliga: "",
                registroasociacion: "",
                equipoorigen: "",
                observacionjugador: "",
                colonia: "",
                ciudad: "",
                estado: "",
                pais: "",
                telefono: "",
                email: "",
                acceso: "",
                password: "",
                nombrePadre: "",
                telefonoPadre: "",
                emailPadre: "",
                nombreMadre: "",
                telefonoMadre: "",
                emailMadre: "",
                numeroCamisa: "",
                notas: "",
                autor: uidUser,
            };

            const responseActualizar = await corePersonas.Registrar(jsonData);

            if (responseActualizar != null) {
                // Registrar bitacora //   
                const jsonData_bitacora = {
                    persona: responseActualizar.id,
                    fechamovimiento: new Date(),
                    responsable: uidUser,
                    temporada: btn_cargar_jugadores.getAttribute("data-temporada"),
                    categoria: btn_cargar_jugadores.getAttribute("data-categoria"),
                    equipo: btn_cargar_jugadores.getAttribute("data-id"),
                    observaciones: "Roster Inicial"
                };

                const RegistrarBitacora = await coreBitacoraPersona.Registro(jsonData_bitacora, "alta");
            }
        }
    }));

    cancelar_carga_jugadores();

});

btn_cancelar_carga.addEventListener("click", () => {
    cancelar_carga_jugadores();
});


const cancelar_carga_jugadores = () => {
    formulario_carga.reset();
    document.getElementById("body-carga-jugador").innerHTML = "";
    document.getElementById('ld_principal').classList.remove('hide');
    contenedor_carga_jugadores.classList.add("hide");
    btn_cargar_jugadores.setAttribute("data-id", "");
    btn_cargar_jugadores.setAttribute("data-temporada", "");
    btn_cargar_jugadores.setAttribute("data-categoria", "");
}

// uploader_jugadores.addEventListener("change", () => {
//     const { Papa } = window.Papa;


//     Papa.parse(uploader_jugadores.files[0], {
//         complete: function(results) {
//             console.log(results);
//         }
//     });
// });


// CREAR TEMPORADA //
// Guardar a FireStore //
const ld_crear = async(datos) => {
        try {
            const docRef = await addDoc(collection(db, "Equipos"), {
                Nombre_completo: datos.nombreCompleto,
                Nombre_corto: datos.nombreCorto,
                Temporada: datos.temporada,
                Categoria: datos.categoria,
                Manager: datos.manager,
                Coach: datos.coach,
                Cupo: datos.cupo,
                Logotipo: "",
                Patrocinador: datos.patrocinador,
                Notas: datos.notas,
                Autor: uidUser,
                Grupo: false,
                Fecha_creacion: Timestamp.now()
            });

            for (let i = 0; i < imagenes_subidas.length; i++) {
                let imageFile = imagenes_subidas[i];
                let idDocumento = docRef.id;
                let storageRef = ref(storage, `Equipos/${docRef.id}/Logotipo/${imageFile.name}`);

                await uploadBytes(storageRef, imageFile).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                        const docRef = doc(db, "Equipos", idDocumento);
                        updateDoc(docRef, {
                            Logotipo: downloadURL
                        });
                    });
                });
            }

            // Regresar a las noticias //
            ldObtener(uidUser);
            regresarGrid();

        } catch (e) {
            console.error("Error al registrar el equipo: ", e);
        }
    }
    // Función nueva temporada //
btnNuevo.addEventListener("click", (e) => {
    limpiarFormulario();
    document.getElementById('ld_principal').classList.add('hide');
    document.getElementById('seccion_ld_formulario').classList.remove('hide');
    document.getElementById('titulo-formulario').innerHTML = 'Nuevo equipo';
    document.getElementById('btn_submit').innerHTML = 'Guardar';
    document.getElementById('btn_submit').setAttribute("value", "nuevo");
    botonVerIntegrantes.disabled = true;

});




// Función para registrar/actualizar //
ldFormulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const modoRegistro = document.getElementById('btn_submit').value;

    // const descripcion = document.getElementById("input_descripcion").value;
    // const descripcionCorta = document.getElementById("input_descripcionCorta").value;
    // const rangoEdad = document.getElementById("input_rangoEdad").value;
    // const estatus = document.getElementById("select_status").value;
    // const directorCategoria = document.getElementById('select_directorCategoria').value;
    // const estatutos = $('#summernote').summernote('code');

    const jsonData = {
        nombreCompleto: campoNombreCompletoEquipo.value,
        nombreCorto: campoNombreCortoEquipo.value,
        temporada: campoTemporada.value,
        categoria: campoCategoria.value,
        manager: campoManager.value,
        coach: campoCoach.value,
        cupo: campoCupo.value,
        patrocinador: campoPatrocinador.value,
        notas: $('#summernote').summernote('code')

    };

    if (modoRegistro === "nuevo") {
        // Registro de nueva noticia //
        ld_crear(jsonData);
    } else if (modoRegistro === "actualizar") {
        // Actualizacion de noticia //
        ld_actualizar(jsonData);
    }
});

// LEER FIRESTORE //
const ldObtener = async(usrId) => {
    const consulta = query(collection(db, "Equipos"),
        orderBy("Fecha_creacion", "desc"),
        limit(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);

}



fileUploaded.addEventListener('change', () => {
    // let fileInput = document.getElementById("imageUploader");
    let imageContainer = document.getElementById("galeriaImagen");

    imagenes_subidas = [];
    document.getElementById("galeriaImagen_subidas").innerHTML = "";

    for (let i of fileUploaded.files) {
        imagenes_subidas.push(i);
    }
    imageContainer.innerHTML = "";

    for (let i of imagenes_subidas) {
        let reader = new FileReader();
        let figure = document.createElement("figure");
        let btnEliminar = document.createElement("button");
        btnEliminar.setAttribute("class", "deleteImg");
        btnEliminar.setAttribute("type", "button");
        btnEliminar.innerHTML = "&times";
        // figure.setAttribute("onclick", "seleccionNoticiaCabecera(this)");
        figure.setAttribute("class", "figureUploaded");
        let figCap = document.createElement("figCaption");

        figCap.innerText = i.name;
        figure.appendChild(figCap);
        reader.onload = () => {
            let img = document.createElement("img");
            img.setAttribute("src", reader.result);

            figure.insertBefore(img, figCap);
        }
        figure.appendChild(btnEliminar);
        imageContainer.appendChild(figure);
        reader.readAsDataURL(i);
    }
});

const cargaDatosFormulario = async(usrId) => {
    const consultaTemporadas = query(collection(db, "Temporadas"),
        orderBy("Fecha_publicacion", "desc"),
        limit(limite)
    );

    const consultaCategorias = query(collection(db, "Categorias"),
        where("Status", "==", "1"),
        orderBy("Fecha_publicacion", "desc"),
        limit(limite)
    );

    const consultaJugadoresDisponible = query(collection(db, "Personas"),
        where("Tipo_persona", "==", "jugador"),
        where("Equipo_actual", "==", ""),
        orderBy("Nombre_completo", "desc")
    );

    const documentoTemporada = await getDocs(consultaTemporadas);
    if (documentoTemporada.docs.length > 0) {
        documentoTemporada.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Titulo;
            campoTemporada.appendChild(opcion);
        });

        documentoTemporada.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Titulo;
            campoTemporadaActualIntegrante.appendChild(opcion);
        });
    }

    const documentoCategoria = await getDocs(consultaCategorias);
    if (documentoCategoria.docs.length > 0) {
        documentoCategoria.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Descripcion;
            campoCategoria.appendChild(opcion);
        });

        documentoCategoria.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Descripcion;
            campoCategoriaActualIntegrante.appendChild(opcion);
        });
    }

    const documentoJugadores = await getDocs(consultaJugadoresDisponible);
    if (documentoJugadores.docs.length > 0) {
        documentoJugadores.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Nombre_completo;
            campoSeleccionJugadorDisponible.appendChild(opcion);
        });
    }

    const categoriaJugador = await coreCategoriaJugador.Obtener();

    if (categoriaJugador.docs.length > 0) {
        categoriaJugador.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().descripcion;
            campoCategoriaJugador.appendChild(opcion);
        });
    }

    const CargarEquipos = await Cargar_Todos_Los_Equipos();
    if (CargarEquipos != null) {
        CargarEquipos.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Nombre_completo;
            campoEquipoOrigen.appendChild(opcion);
        });
    }


}




const ldLeer = async(id) => {
    limpiarFormulario();
    botonVerIntegrantes.disabled = false;
    const docRef = doc(db, "Equipos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        id_Temporal = docSnap.id;
        const listRef = ref(storage, `Equipos/${id}/Logotipo`);

        listAll(listRef)
            .then((res) => {
                res.items.forEach((itemRef) => {
                    // Se obtiene las urls de las imagenes de la noticia a editar //                    
                    getDownloadURL(ref(storage, itemRef.fullPath)).then((url) => {
                        armarImagenes(url, itemRef.name);
                    });
                });
            }).catch((error) => {
                // Uh-oh, an error occurred!
                console.log(error);
            });

        precarga_temporada = docSnap.data().Temporada;
        precarga_categoria = docSnap.data().Categoria;

        campoNombreCompletoEquipo.value = docSnap.data().Nombre_completo;
        campoNombreCortoEquipo.value = docSnap.data().Nombre_corto;
        campoTemporada.value = docSnap.data().Temporada;
        campoCategoria.value = docSnap.data().Categoria;
        campoManager.value = docSnap.data().Manager;
        campoCoach.value = docSnap.data().Coach;
        campoCupo.value = docSnap.data().Cupo;
        campoPatrocinador.value = docSnap.data().Patrocinador;
        $("#summernote").summernote("code", docSnap.data().Notas);

        document.getElementById('ld_principal').classList.add('hide');
        document.getElementById('seccion_ld_formulario').classList.remove('hide');
        document.getElementById('titulo-formulario').innerHTML = 'Actualizar equipo';
        document.getElementById('btn_submit').innerHTML = 'Actualizar';
        document.getElementById('btn_submit').setAttribute("value", "actualizar");
    } else {
        console.log("Error al obtener documento!");
        return null;
    }
}

const armarImagenes = (url, imgName) => {
    galeriaImagenesSubidas.classList.remove('hidden');

    let figure = document.createElement("figure");
    // let btnEliminar = document.createElement("button");
    let figCap = document.createElement("figcaption");
    let img = document.createElement("img");

    figure.setAttribute("class", "figureUploaded");
    // if (url == imgCabecera)
    //     figure.setAttribute("data-cabecera", "true");

    // btnEliminar.setAttribute("class", "deleteImg");
    // btnEliminar.setAttribute("type", "button");
    // btnEliminar.innerHTML = "&times";

    img.setAttribute("style", "font-size:12px;");
    img.setAttribute("src", url);
    // if (url == imgCabecera)
    //     img.setAttribute("class", "cabecera-seleccionado");

    figCap.innerText = imgName;

    // figure.appendChild(btnEliminar);
    figure.appendChild(img);
    figure.appendChild(figCap);

    galeriaImagenesSubidas.appendChild(figure);
}

// ACTUALIZAR TEMPORADA //
const ld_actualizar = async(datos) => {
    const docRef = doc(db, "Equipos", id_Temporal);
    const listRef = ref(storage, `Equipos/${id_Temporal}/Logotipo`);

    if (imagenes_subidas.length > 0) {
        await updateDoc(docRef, {
            Nombre_completo: datos.nombreCompleto,
            Nombre_corto: datos.nombreCorto,
            Temporada: datos.temporada,
            Categoria: datos.categoria,
            Manager: datos.manager,
            Coach: datos.coach,
            Cupo: datos.cupo,
            Patrocinador: datos.patrocinador,
            Notas: datos.notas,
            Logotipo: ""
        });

        // Busca todas las imagenes de la noticia para despues eliminarlas //
        listAll(listRef)
            .then((res) => {
                res.items.forEach((itemRef) => {
                    let storageRef = ref(storage, itemRef.fullPath);
                    // Eliminar imagen //
                    deleteObject(storageRef).then(() => {}).catch((error) => {
                        console.log("Error al eliminar las imagenes: ", error);
                    });
                });
            }).catch((error) => {
                console.log(error);
            });

        // Subir Logotipo Nuevo
        for (let i = 0; i < imagenes_subidas.length; i++) {
            let imageFile = imagenes_subidas[i];
            let storageRef = ref(storage, `Equipos/${id_Temporal}/Logotipo/${imageFile.name}`);

            await uploadBytes(storageRef, imageFile).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    const docRef = doc(db, "Equipos", id_Temporal);
                    updateDoc(docRef, {
                        Logotipo: downloadURL
                    });
                });
            });
        }
    } else {
        await updateDoc(docRef, {
            Nombre_completo: datos.nombreCompleto,
            Nombre_corto: datos.nombreCorto,
            Temporada: datos.temporada,
            Categoria: datos.categoria,
            Manager: datos.manager,
            Coach: datos.coach,
            Cupo: datos.cupo,
            Patrocinador: datos.patrocinador,
            Notas: datos.notas
        });
    }

    ldObtener(uidUser);
    regresarGrid();
}

// ELIMINAR TEMPORADA //
btnModalEliminar.addEventListener("click", (e) => {
    ldEliminar(e.target.value);
});

const ldEliminar = async(id) => {
    await deleteDoc(doc(db, "Equipos", id));
    const listRef = ref(storage, `Equipos/${id}/Logotipo`);

    // Busca todas las imagenes de la noticia para despues eliminarlas //
    listAll(listRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                let storageRef = ref(storage, itemRef.fullPath);
                // Eliminar imagen //
                deleteObject(storageRef).then(() => {}).catch((error) => {
                    console.log("Error al eliminar las imagenes: ", error);
                });
            });
        }).catch((error) => {
            console.log(error);
        });



    $('#modal-eliminar').modal('hide');
    ldObtener(uidUser);
}

// Paginacion a la siguiente pagina Noticias //
const paginaSiguiente = async(usrId) => {
    const consulta = query(collection(db, "Equipos"),
        orderBy("Fecha_creacion", "desc"),
        limit(limite),
        startAfter(ultimoDocumento)
    );
    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);
}

// Paginacion a la previa pagina Noticias //
const paginaAnterior = async(usrId) => {
    const consulta = query(collection(db, "Equipos"),
        orderBy("Fecha_creacion", "desc"),
        endBefore(primerDocumento),
        limitToLast(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);
}

// Armado de tarjeta //
const ldArmarTarjetas = (documentos) => {
    if (documentos.docs.length > 0) {
        ultimoDocumento = documentos.docs[documentos.docs.length - 1];
        primerDocumento = documentos.docs[0];
        contenedorNoticias.innerHTML = '';

        documentos.forEach(doc => {
            let fechaRegistro = doc.data().Fecha_creacion.toDate().toLocaleDateString("es-MX");

            let divCardBody = document.createElement("div");
            divCardBody.classList.add("card-body");

            let h4Title = document.createElement("h4");
            h4Title.classList.add("card-title");
            h4Title.setAttribute("style", "display:flex; align-items:center; margin-bottom:0.25rem;");
            h4Title.innerHTML = `${doc.data().Nombre_completo}`;
            divCardBody.appendChild(h4Title);

            let pTitle = document.createElement("p");
            pTitle.classList.add("card-text");
            pTitle.setAttribute("style", "font-size:0.8rem; margin-bottom:1rem;");
            pTitle.innerHTML = `Fecha de creación: <span class="noticia-fecha-publicacion">${fechaRegistro}</span>`;
            divCardBody.appendChild(pTitle);

            let btnEdit = document.createElement("button");
            btnEdit.setAttribute("type", "button");
            btnEdit.id = doc.id;
            btnEdit.setAttribute("data-idObject", doc.id);
            btnEdit.setAttribute("class", "btn btnDashboard btnDashboard-primary");
            btnEdit.innerHTML = "Editar";
            btnEdit.addEventListener("click", () => {
                ldLeer(`${doc.id}`);
            });
            divCardBody.appendChild(btnEdit);

            let btnCargaJugadores = document.createElement("button");
            btnCargaJugadores.setAttribute("type", "button");
            btnCargaJugadores.setAttribute("style", "margin-left:4px;");
            btnCargaJugadores.setAttribute("class", "btn btnDashboard btnDashboard-primary");
            btnCargaJugadores.innerHTML = "Cargar jugadores";
            btnCargaJugadores.addEventListener("click", () => {

                let teamID = doc.id;
                let temporadaID = doc.data().Temporada;
                let CategoriaID = doc.data().Categoria;
                Mostrar_Carga_Jugadores_Masivos(teamID, temporadaID, CategoriaID);
            });
            divCardBody.appendChild(btnCargaJugadores);

            let btnDelete = document.createElement("button");
            btnDelete.setAttribute("type", "button");
            btnDelete.setAttribute("style", "height: 38px; margin-left:4px;");
            btnDelete.setAttribute("class", "btn btnDashboard btn-danger");
            btnDelete.innerHTML = "Eliminar";
            btnDelete.addEventListener("click", () => {
                confirmarEliminacion(`${doc.id}`);
            });
            divCardBody.appendChild(btnDelete);

            contenedorNoticias.appendChild(divCardBody);

            // contenedorNoticias.innerHTML += `
            // <div class="card-body">
            //     <h4 class="card-title" style="display:flex; align-items:center; margin-bottom:0.25rem;">${doc.data().Nombre_completo}</h4>
            //     <p class="card-text" style="font-size:0.8rem; margin-bottom:1rem;">Fecha de creación: <span class="noticia-fecha-publicacion">${fechaRegistro}</span></p>

            //     <button id="${doc.id}" data-idObject="${doc.id}" class="btn btnDashboard btnDashboard-primary">Editar</button>
            //     <button class="btn btnDashboard btn-danger" onclick="confirmarEliminacion('${doc.id}')">Eliminar</button>
            // </div>
            // `;
        });

    }
}

const ldArmarTarjetas_busqueda = (documentos) => {
    if (documentos.docs.length > 0) {
        ultimoDocumento = documentos.docs[documentos.docs.length - 1];
        primerDocumento = documentos.docs[0];
        contenedorNoticias.innerHTML = '';

        documentos.forEach(doc => {

            let nombre_doc = doc.data().Nombre_completo.toLowerCase();
            let nombre_buscar = campoBusqueda.value.toLowerCase();
            let evaluar_busqueda = nombre_doc.includes(nombre_buscar);

            if (evaluar_busqueda) {
                let fechaRegistro = doc.data().Fecha_creacion.toDate().toLocaleDateString("es-MX");

                let divCardBody = document.createElement("div");
                divCardBody.classList.add("card-body");

                let h4Title = document.createElement("h4");
                h4Title.classList.add("card-title");
                h4Title.setAttribute("style", "display:flex; align-items:center; margin-bottom:0.25rem;");
                h4Title.innerHTML = `${doc.data().Nombre_completo}`;
                divCardBody.appendChild(h4Title);

                let pTitle = document.createElement("p");
                pTitle.classList.add("card-text");
                pTitle.setAttribute("style", "font-size:0.8rem; margin-bottom:1rem;");
                pTitle.innerHTML = `Fecha de creación: <span class="noticia-fecha-publicacion">${fechaRegistro}</span>`;
                divCardBody.appendChild(pTitle);

                let btnEdit = document.createElement("button");
                btnEdit.setAttribute("type", "button");
                btnEdit.id = doc.id;
                btnEdit.setAttribute("data-idObject", doc.id);
                btnEdit.setAttribute("class", "btn btnDashboard btnDashboard-primary");
                btnEdit.innerHTML = "Editar";
                btnEdit.addEventListener("click", () => {
                    ldLeer(`${doc.id}`);
                });
                divCardBody.appendChild(btnEdit);

                let btnCargaJugadores = document.createElement("button");
                btnCargaJugadores.setAttribute("type", "button");
                btnCargaJugadores.setAttribute("style", "margin-left:4px;");
                btnCargaJugadores.setAttribute("class", "btn btnDashboard btnDashboard-primary");
                btnCargaJugadores.innerHTML = "Cargar jugadores";
                btnCargaJugadores.addEventListener("click", () => {

                    let teamID = doc.id;
                    let temporadaID = doc.data().Temporada;
                    let CategoriaID = doc.data().Categoria;
                    Mostrar_Carga_Jugadores_Masivos(teamID, temporadaID, CategoriaID);
                });
                divCardBody.appendChild(btnCargaJugadores);

                let btnDelete = document.createElement("button");
                btnDelete.setAttribute("type", "button");
                btnDelete.setAttribute("style", "height: 38px; margin-left:4px;");
                btnDelete.setAttribute("class", "btn btnDashboard btn-danger");
                btnDelete.innerHTML = "Eliminar";
                btnDelete.addEventListener("click", () => {
                    confirmarEliminacion(`${doc.id}`);
                });
                divCardBody.appendChild(btnDelete);

                contenedorNoticias.appendChild(divCardBody);
                // contenedorNoticias.innerHTML += `
                // <div class="card-body">
                //     <h4 class="card-title" style="display:flex; align-items:center; margin-bottom:0.25rem;">${doc.data().Nombre_completo}</h4>
                //     <p class="card-text" style="font-size:0.8rem; margin-bottom:1rem;">Fecha de creación: <span class="noticia-fecha-publicacion">${fechaRegistro}</span></p>

                //     <button id="${doc.id}" data-idObject="${doc.id}" class="btn btnDashboard btnDashboard-primary">Editar</button>
                //     <button class="btn btnDashboard btn-danger" onclick="confirmarEliminacion('${doc.id}')">Eliminar</button>
                // </div>
                // `;
            }
        });
    }
}


// Mostrar Carga de jugadores masivos //
const Mostrar_Carga_Jugadores_Masivos = (idEquipo, idTemporada, idCategoria) => {

    btn_cargar_jugadores.setAttribute("data-id", idEquipo);
    btn_cargar_jugadores.setAttribute("data-temporada", idTemporada);
    btn_cargar_jugadores.setAttribute("data-categoria", idCategoria);
    document.getElementById('ld_principal').classList.add('hide');
    contenedor_carga_jugadores.classList.remove("hide");
}

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
}

btnSiguiente.addEventListener("click", () => {
    paginaSiguiente(uidUser);
});

btnAtras.addEventListener("click", () => {
    paginaAnterior(uidUser);
});

// Función para editar //
// ldContenedorTabla.addEventListener("click", (event) => {
//     const isButton = event.target.nodeName === "BUTTON";
//     if (!isButton) {
//         return;
//     }
//     if (event.target.id !== "") {
//         ldLeer(event.target.id);
//     }

// });


// tablaIntegrantes.addEventListener("click", (e) => {
//     const isButton = e.target.nodeName === "BUTTON";

//     if (!isButton) {
//         return;
//     } else {
//         console.log(e.target.dataset.id);

//     }
// });

const eliminarImagen = (imgName, e) => {
    console.log(id_Temporal);
    const imgRef = ref(storage, `Noticias/${id_Temporal}/${imgName}`);

    // Eliminar Imagen //
    deleteObject(imgRef).then(() => {
        // Imagen eliminado //
        e.target.closest("figure.figureUploaded").remove();
    }).catch((error) => {
        // Error al eliminar imagen //
        console.log("Error al eliminar imagen: ", error);
    });
}

btnFormularioRegresar.addEventListener("click", () => {
    regresarGrid();
});

botonRegresarIntegrantes.addEventListener("click", () => {
    regresarGridIntegrantes();
});

const regresarGridIntegrantes = () => {
    tituloModalIntegrantes.innerHTML = "Integrantes";
    seccionTablaIntegrantes.classList.remove("hide");
    formularioJugador.classList.add("hide");
}




// Regresa al grid con las noticias //
const regresarGrid = () => {
    let imagenes_subidas = [];
    let imagenerPorEliminar = [];
    document.getElementById("galeriaImagen").innerHTML = "";
    document.getElementById("galeriaImagen_subidas").innerHTML = "";
    document.getElementById('ld_principal').classList.remove('hide');
    document.getElementById('seccion_ld_formulario').classList.add('hide');
}

// Limpieza de formulario de noticias //
const limpiarFormulario = () => {
    ldFormulario.reset();
    imagenes_subidas = [];
    $('#summernote').summernote('reset');
};

// Poblar Tabla de integrantes //
botonVerIntegrantes.addEventListener("click", (e) => {
    limpiarFormularioIntegrantes();
    regresarGridIntegrantes();
    cuerpoTabla.innerHTML = "";
    $("#modalIntegrantes").modal("show");
    armarCuerpoTablaIntegrantes(id_Temporal);
});

const armarCuerpoTablaIntegrantes = async(idEquipo) => {
    const consulta = query(collection(db, "Personas"),
        where("Tipo_persona", "==", "jugador"),
        where("Equipo_actual", "==", idEquipo),
        orderBy("Nombre_completo", "asc")
    );

    const documentSnapshots = await getDocs(consulta);

    if (documentSnapshots.docs.length > 0) {
        documentSnapshots.forEach(doc => {
            let trJugador = document.createElement('tr');

            let tdNombreCompleto = document.createElement('td');
            tdNombreCompleto.innerHTML = doc.data().Nombre_completo;
            trJugador.appendChild(tdNombreCompleto);

            let tdNumeroCamisa = document.createElement('td');
            tdNumeroCamisa.innerHTML = doc.data().Jugador_numero_camisa;
            trJugador.appendChild(tdNumeroCamisa);

            let tdAccionJugador = document.createElement('td');
            tdAccionJugador.setAttribute("style", "max-width: 100%;");

            let btnRetirar = document.createElement('button');
            btnRetirar.setAttribute("type", "button");
            btnRetirar.setAttribute("class", "btn btnDashboard btnDashboard-transparent");
            btnRetirar.innerHTML = `<i class="fas fa-user-times" style="margin-right:4px;"></i>Retirar del equipo`;
            btnRetirar.addEventListener('click', async() => {
                retirarJugador(doc.id, doc.data().Nombre_completo);
                // btnRetirar.parentElement.parentElement.remove();
            });

            let btnEditarJugador = document.createElement('button');
            btnEditarJugador.setAttribute("type", "button");
            btnEditarJugador.setAttribute("class", "btn btnDashboard btnDashboard-transparent");
            btnEditarJugador.innerHTML = `<i class="fas fa-user-edit" style="margin-right:4px;"></i>Editar jugador`;
            btnEditarJugador.addEventListener('click', async() => {
                await editarJugador(doc.id);
            });

            tdAccionJugador.appendChild(btnEditarJugador);

            tdAccionJugador.appendChild(btnRetirar);
            trJugador.appendChild(tdAccionJugador);

            cuerpoTabla.appendChild(trJugador);



            //     cuerpoTabla.innerHTML += `
            // <tr>
            //     <td>${doc.data().Nombre_completo}</td>
            //     <td>${doc.data().Jugador_numero_camisa}</td>
            //     <td>
            //         <button type="button" data-id='${doc.id}' class="btn btnDashboard btnDashboard-transparent"><i class="fas fa-user-times" style="margin-right:4px;"></i>Retirar del equipo</button>
            //     </td>
            // </tr>
            // `;
        });
    }
}

const editarJugador = async(id) => {

    limpiarFormularioIntegrantes();
    const docRef = doc(db, "Personas", id);

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            id_jugador = id;
            modoEditJugador = true;
            campoNombreCompletoIntegrante.value = docSnap.data().Nombre_completo;
            campoNombreCortoIntegrante.value = docSnap.data().Nombre_corto;
            campoTemporadaActualIntegrante.value = docSnap.data().Temporada_actual;
            campoCategoriaActualIntegrante.value = docSnap.data().Categoria_actual;
            campoFechaNacimientoIntegrante.value = docSnap.data().Fecha_nacimiento;

            if (docSnap.data().Curp != undefined)
                campoCurp.value = docSnap.data().Curp;

            campoCamisaIntegrante.value = docSnap.data().Jugador_numero_camisa;

            if (docSnap.data().Categoria_jugador != undefined)
                campoCategoriaJugador.value = docSnap.data().Categoria_jugador;

            if (docSnap.data().Telefono_jugador != undefined)
                campoTelefonoJugador.value = docSnap.data().Telefono_jugador;

            if (docSnap.data().Edad_liga != undefined)
                campoEdadLiga.value = docSnap.data().Edad_liga;

            if (docSnap.data().Registro_asociacion != undefined)
                campoRegistroAsociacion.value = docSnap.data().Registro_asociacion;

            if (docSnap.data().Equipo_origen != undefined)
                campoEquipoOrigen.value = docSnap.data().Equipo_origen;

            if (docSnap.data().Observacion_jugador != undefined)
                campoObservacionesJugador.value = docSnap.data().Observacion_jugador;


            campoDireccionCalleIntegrante.value = docSnap.data().Nombre_calle;
            campoDireccionNumeroIntegrante.value = docSnap.data().Numero_casa;
            campoDireccionColoniaIntegrante.value = docSnap.data().Colonia;
            campoDireccionCiudadIntegrante.value = docSnap.data().Ciudad;
            campoDireccionEstadoIntegrante.value = docSnap.data().Estado;
            campoDireccionPaisIntegrante.value = docSnap.data().Pais;
            campoNombrePadreIntegrante.value = docSnap.data().Contacto_nombre_padre;
            campoTelefonoPadreIntegrante.value = docSnap.data().Contacto_telefono_padre;
            campoEmailPadreIntegrante.value = docSnap.data().Contacto_email_padre;
            campoNombreMadreIntegrante.value = docSnap.data().Contacto_nombre_madre;
            campoTelefonoMadreIntegrante.value = docSnap.data().Contacto_telefono_madre;
            campoEmailMadreIntegrante.value = docSnap.data().Contacto_email_madre;
            $("#summernoteIntegrantes").summernote("code", docSnap.data().Notas);

            const obtenerUltimoRegistroBitacora = await coreBitacoraPersona.Obtener_Ultimo_Registro(id_jugador);
            if (obtenerUltimoRegistroBitacora != null) {

                obtenerUltimoRegistroBitacora.forEach(documento => {

                    if (documento.data().fecha_movimiento != undefined)
                        campoFechaMovimiento.value = documento.data().fecha_movimiento.toDate().toISOString().split('T')[0];

                    if (documento.data().observaciones != undefined)
                        campoObservacionMovimiento.value = documento.data().observaciones;
                });

            }
        }
    } catch (e) {
        console.log(`Error al consultar jugador: ${e}`);
        return;
    }


    tituloModalIntegrantes.innerHTML = "Editar jugador";
    seccionTablaIntegrantes.classList.add("hide");
    formularioJugador.classList.remove("hide");
};

const retirarJugador = async(idJugador, nombreJugador) => {
    tituloModalIntegrantes.innerHTML = `Motivo de baja - ${nombreJugador}`;
    seccionTablaIntegrantes.classList.add("hide");
    contenedorRetiro.classList.remove("hide");
    hidden_id_jugador.value = idJugador;
    labelJugadorRetiro.innerHTML = "Observacion del movimiento";
    hiddenControlBitacora.value = "baja";

    // const docRef = doc(db, "Personas", id);

    // try {
    //     await updateDoc(docRef, {
    //         Temporada_actual: "",
    //         Categoria_actual: "",
    //         Equipo_actual: ""
    //     });
    //     await obtenerJugadoresDisponibles();

    //     // Escribir bitacora del jugador //
    //     const docRef_bitacora = await addDoc(collection(db, "Bitacora_personas"), {
    //         accion: "baja",
    //         persona: id,
    //         fecha: Timestamp.now(),
    //         responsable: uidUser
    //     });

    // } catch (e) {
    //     console.log(e);
    // }
};

const agregarJugadorExistente = async() => {

    let altaJugador = await corePersonas.Alta_Jugador(campoSeleccionJugadorDisponible.value, campoTemporada.value, campoCategoria.value, id_Temporal);
    // if (altaJugador == null)
    //     return;
    campoSeleccionJugadorDisponible.remove(campoSeleccionJugadorDisponible.selectedIndex);
    campoSeleccionJugadorDisponible.selectedIndex = 0;
    cuerpoTabla.innerHTML = "";

    cancelarRetiro();
    cuerpoTabla.innerHTML = "";
    armarCuerpoTablaIntegrantes(id_Temporal);


    // const docRef = doc(db, "Personas", campoSeleccionJugadorDisponible.value);

    // try {
    //     await updateDoc(docRef, {
    //         Temporada_actual: campoTemporada.value,
    //         Categoria_actual: campoCategoria.value,
    //         Equipo_actual: id_Temporal
    //     });


    // } catch (e) {
    //     console.log("Error al asignar jugador " + e);
    // }
}

botonJugadorExistente.addEventListener("click", async() => {


    if (campoSeleccionJugadorDisponible.value != "") {
        const docRef = doc(db, "Personas", campoSeleccionJugadorDisponible.value);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            hiddenControlBitacora.value = "alta";
            tituloModalIntegrantes.innerHTML = `Agregar jugador existente - ${docSnap.data().Nombre_completo}`;
            seccionTablaIntegrantes.classList.add("hide");
            contenedorRetiro.classList.remove("hide");
            hidden_id_jugador.value = campoSeleccionJugadorDisponible.value;
            labelJugadorRetiro.innerHTML = "Observacion del movimiento";
        } else {
            console.error("Error al buscar jugador: " + campoSeleccionJugadorDisponible.value);
        }
    }


});

formularioRetiroJugador.addEventListener('submit', async(e) => {
    e.preventDefault();
    let idJugadorRetiro = hidden_id_jugador.value;
    // const docRef = doc(db, "Personas", idJugadorRetiro);

    if (hiddenControlBitacora.value == "baja") {

        // await updateDoc(docRef, {
        //     Temporada_actual: "",
        //     Categoria_actual: "",
        //     Equipo_actual: ""
        // });

        let bajaJugador = await corePersonas.Baja_Jugador(idJugadorRetiro);
        // if (bajaJugador == null)
        //     return;
        await obtenerJugadoresDisponibles();

        // Escribir bitacora del jugador //
        let jsonData = {
            persona: idJugadorRetiro,
            fechamovimiento: new Date(`${campoFechaMovimientoAltaBaja.value}T00:00`),
            responsable: uidUser,
            temporada: campoTemporada.value,
            categoria: campoCategoria.value,
            equipo: id_Temporal,
            observaciones: textAreaMotivoBaja.value
        };

        let registroBitacora = await coreBitacoraPersona.Registro(jsonData, "baja");

        // const docRef_bitacora = await addDoc(collection(db, "Bitacora_personas"), {
        //     accion: "baja",
        //     persona: idJugadorRetiro,
        //     fecha: Timestamp.now(),
        //     fecha_movimiento: campoFechaMovimiento.value,
        //     responsable: uidUser,
        //     temporada: campoTemporada.value,
        //     categoria: campoCategoria.value,
        //     equipo: id_Temporal,
        //     observaciones: textAreaMotivoBaja.value

        // });


        cancelarRetiro();
        cuerpoTabla.innerHTML = "";
        armarCuerpoTablaIntegrantes(id_Temporal);

    } else if (hiddenControlBitacora.value == "alta") {
        // Dar de alta a jugador bitacora //
        let jsonData = {
            persona: campoSeleccionJugadorDisponible.value,
            fechamovimiento: new Date(`${campoFechaMovimientoAltaBaja.value}T00:00`),
            responsable: uidUser,
            temporada: campoTemporada.value,
            categoria: campoCategoria.value,
            equipo: id_Temporal,
            observaciones: textAreaMotivoBaja.value
        };

        let registroBitacora = await coreBitacoraPersona.Registro(jsonData, "alta");
        // if (registroBitacora == null)
        //     return;
        await agregarJugadorExistente();
    }



})

btnCancelarRetiro.addEventListener('click', () => {

    cancelarRetiro();
});

const cancelarRetiro = () => {
    formularioRetiroJugador.reset();
    tituloModalIntegrantes.innerHTML = "Integrantes";
    seccionTablaIntegrantes.classList.remove("hide");
    contenedorRetiro.classList.add("hide");
}

const obtenerJugadoresDisponibles = async() => {

    campoSeleccionJugadorDisponible.innerHTML = `<option value="" disabled selected>Seleccionar un jugador...</option>`;

    const consultaJugadoresDisponible = query(collection(db, "Personas"),
        where("Tipo_persona", "==", "jugador"),
        where("Equipo_actual", "==", ""),
        orderBy("Nombre_completo", "desc")
    );

    const documentoJugadores = await getDocs(consultaJugadoresDisponible);
    if (documentoJugadores.docs.length > 0) {
        documentoJugadores.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Nombre_completo;
            campoSeleccionJugadorDisponible.appendChild(opcion);
        });
    }

}

// Botón agregar jugador //
botonAgregarJugador.addEventListener("click", (e) => {
    modoEditJugador = false;
    id_jugador = null;
    limpiarFormularioIntegrantes();
    tituloModalIntegrantes.innerHTML = "Agregar jugador";
    seccionTablaIntegrantes.classList.add("hide");
    formularioJugador.classList.remove("hide");
    precargarJugador(precarga_temporada, precarga_categoria);
});

const precargarJugador = (temporada, categoria) => {
    campoTemporadaActualIntegrante.value = temporada;
    campoCategoriaActualIntegrante.value = categoria;
}

const limpiarFormularioIntegrantes = () => {
    formularioIntegrantes.reset();
    $('#summernoteIntegrantes').summernote('reset');
}

// Submit formulario integrantes //
formularioIntegrantes.addEventListener("submit", async(e) => {
    e.preventDefault();
    // console.log(id_Temporal);

    // Guardar integrante //
    try {

        if (modoEditJugador) {
            // Editar registro //
            if (id_jugador != null) {
                // const docRef = doc(db, "Personas", id_jugador);

                // await updateDoc(docRef, {
                //     Nombre_completo: campoNombreCompletoIntegrante.value,
                //     Nombre_corto: campoNombreCortoIntegrante.value,
                //     Temporada_actual: campoTemporadaActualIntegrante.value,
                //     Categoria_actual: campoCategoriaActualIntegrante.value,
                //     Equipo_actual: id_Temporal,
                //     Fecha_nacimiento: campoFechaNacimientoIntegrante.value,
                //     Tipo_persona: "jugador",
                //     Nombre_calle: campoDireccionCalleIntegrante.value,
                //     Numero_casa: campoDireccionNumeroIntegrante.value,
                //     Colonia: campoDireccionColoniaIntegrante.value,
                //     Ciudad: campoDireccionCiudadIntegrante.value,
                //     Estado: campoDireccionEstadoIntegrante.value,
                //     Pais: campoDireccionPaisIntegrante.value,
                //     Contacto_nombre_padre: campoNombrePadreIntegrante.value,
                //     Contacto_telefono_padre: campoTelefonoPadreIntegrante.value,
                //     Contacto_email_padre: campoEmailPadreIntegrante.value,
                //     Contacto_nombre_madre: campoNombreMadreIntegrante.value,
                //     Contacto_telefono_madre: campoTelefonoMadreIntegrante.value,
                //     Contacto_email_madre: campoEmailMadreIntegrante.value,
                //     Jugador_numero_camisa: campoCamisaIntegrante.value,
                //     Notas: $('#summernoteIntegrantes').summernote('code')
                // });

                const jsonData = {
                    nombreCompleto: campoNombreCompletoIntegrante.value,
                    nombreCorto: campoNombreCortoIntegrante.value,
                    temporadaActual: campoTemporadaActualIntegrante.value,
                    categoriaActual: campoCategoriaActualIntegrante.value,
                    equipoActual: id_Temporal,
                    fechaNacimiento: campoFechaNacimientoIntegrante.value,
                    curp: campoCurp.value,
                    tipoPersona: "jugador",
                    calle: campoDireccionCalleIntegrante.value,
                    noCasa: campoDireccionNumeroIntegrante.value,
                    categoriajugador: campoCategoriaJugador.value,
                    telefonojugador: campoTelefonoJugador.value,
                    edadliga: campoEdadLiga.value,
                    registroasociacion: campoRegistroAsociacion.value,
                    equipoorigen: campoEquipoOrigen.value,
                    observacionjugador: campoObservacionesJugador.value,
                    colonia: campoDireccionColoniaIntegrante.value,
                    ciudad: campoDireccionCiudadIntegrante.value,
                    estado: campoDireccionEstadoIntegrante.value,
                    pais: campoDireccionPaisIntegrante.value,
                    telefono: "",
                    email: "",
                    acceso: "",
                    password: "",
                    nombrePadre: campoNombrePadreIntegrante.value,
                    telefonoPadre: campoTelefonoPadreIntegrante.value,
                    emailPadre: campoEmailPadreIntegrante.value,
                    nombreMadre: campoNombreMadreIntegrante.value,
                    telefonoMadre: campoTelefonoMadreIntegrante.value,
                    emailMadre: campoEmailMadreIntegrante.value,
                    numeroCamisa: campoCamisaIntegrante.value,
                    notas: $('#summernoteIntegrantes').summernote('code')
                };

                const responseActualizar = await corePersonas.Actualizar(id_jugador, jsonData);


                // Registros bitácora //
                const jsonData_bitacora = {
                    persona: id_jugador,
                    fechamovimiento: new Date(`${campoFechaMovimiento.value}T00:00`),
                    responsable: uidUser,
                    temporada: campoTemporadaActualIntegrante.value,
                    categoria: campoCategoriaActualIntegrante.value,
                    equipo: id_Temporal,
                    observaciones: campoObservacionMovimiento.value
                };

                const RegistrarBitacora = await coreBitacoraPersona.Registro(jsonData_bitacora, "alta");

                // Actualizar nombre en las estadísticas
                await corePersonas.Cambiar_Nombre_Estadisticas(id_jugador, campoNombreCompletoIntegrante.value);


            } else {
                console.error("Id de Jugador no encontrado");
                return;
            }



        } else {
            // Registro nuevo //
            const docRef = await addDoc(collection(db, "Personas"), {
                Nombre_completo: campoNombreCompletoIntegrante.value,
                Nombre_corto: campoNombreCortoIntegrante.value,
                Temporada_actual: campoTemporadaActualIntegrante.value,
                Categoria_actual: campoCategoriaActualIntegrante.value,
                Equipo_actual: id_Temporal,
                Fecha_nacimiento: campoFechaNacimientoIntegrante.value,
                Curp: campoCurp.value,
                Tipo_persona: "jugador",
                Nombre_calle: campoDireccionCalleIntegrante.value,
                Numero_casa: campoDireccionNumeroIntegrante.value,
                Categoria_jugador: campoCategoriaJugador.value,
                Telefono_jugador: campoTelefonoJugador.value,
                Edad_liga: campoEdadLiga.value,
                Registro_asociacion: campoRegistroAsociacion.value,
                Equipo_origen: campoEquipoOrigen.value,
                Observacion_jugador: campoObservacionesJugador.value,
                Colonia: campoDireccionColoniaIntegrante.value,
                Ciudad: campoDireccionCiudadIntegrante.value,
                Estado: campoDireccionEstadoIntegrante.value,
                Pais: campoDireccionPaisIntegrante.value,
                Contacto_telefono: "",
                Contacto_email: "",
                Contacto_acceso_dashboard: false,
                Contacto_contrasena: "",
                Contacto_nombre_padre: campoNombrePadreIntegrante.value,
                Contacto_telefono_padre: campoTelefonoPadreIntegrante.value,
                Contacto_email_padre: campoEmailPadreIntegrante.value,
                Contacto_nombre_madre: campoNombreMadreIntegrante.value,
                Contacto_telefono_madre: campoTelefonoMadreIntegrante.value,
                Contacto_email_madre: campoEmailMadreIntegrante.value,
                Jugador_numero_camisa: campoCamisaIntegrante.value,
                Notas: $('#summernoteIntegrantes').summernote('code'),
                Fecha_registro: Timestamp.now(),
                Autor: uidUser,
            });


            // Registros bitácora //
            const jsonData_bitacora = {
                persona: docRef.id,
                fechamovimiento: new Date(`${campoFechaMovimiento.value}T00:00`),
                responsable: uidUser,
                temporada: campoTemporadaActualIntegrante.value,
                categoria: campoCategoriaActualIntegrante.value,
                equipo: id_Temporal,
                observaciones: campoObservacionMovimiento.value
            };

            const RegistrarBitacora = await coreBitacoraPersona.Registro(jsonData_bitacora, "alta");

            // Escribir bitacora del jugador //
            // accion: "alta",
            // persona: campoSeleccionJugadorDisponible.value,
            // fecha: Timestamp.now(),
            // responsable: uidUser,

            // const docRef_bitacora = await addDoc(collection(db, "Bitacora_personas"), {
            //     accion: "alta",
            //     persona: docRef.id,
            //     fecha: Timestamp.now(),
            //     responsable: uidUser,
            //     temporada: campoTemporada.value,
            //     categoria: campoCategoria.value,
            //     equipo: id_Temporal,
            //     observaciones: ""
            // });
        }


        cuerpoTabla.innerHTML = "";
        armarCuerpoTablaIntegrantes(id_Temporal);
        regresarGridIntegrantes();

    } catch (e) {
        console.error("Error al registrar categoría: ", e);
    }
});

const obtenerEquipos = async() => {
    const consulta_equipos = query(collection(db, "Equipos"),
        orderBy("Nombre_completo", "asc")
    );
    const documentSnapshot_equipos = await getDocs(consulta_equipos);

    if (documentSnapshot_equipos.docs.length > 0) {
        return documentSnapshot_equipos;
    } else {
        return null;
    }
}

const obtenerMiembroEquipos = async(id_equipo) => {
    const consulta_equipo_personas = query(collection(db, "Personas"),
        where("Equipo_actual", "==", id_equipo),
        orderBy("Nombre_completo", "asc")
    );
    const doc_personas = await getDocs(consulta_equipo_personas);

    if (doc_personas.docs.length > 0)
        return doc_personas;
    else
        return null;
}

const asyncForEach = async(array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

function headRows() {
    return [
        { no: 'No.', nombre: 'Nombre Completo', temporada: 'Temporada', categoria: 'Categoría' },
    ]
}

function crearData(no, nombre, temporada, categoria, tipo, numero) {
    let data = {
        no: no,
        nombre: nombre,
        temporada: temporada,
        categoria: categoria,
        tipo: tipo,
        numero: numero
    };

    return data;
}

const generarPDF = async() => {

    const { jsPDF } = window.jspdf;
    let docPDF = new jsPDF('p', 'mm', 'letter');


    jsPDF.autoTableSetDefaults({
        headStyles: { fillColor: 0 },
    })

    // Obtener todos los equipos disponibles
    let equipos = await obtenerEquipos();


    if (equipos != null) {
        let indiceEquipo = 0;
        let lengthEquipo = equipos.docs.length;
        let porcentaje = (indiceEquipo / lengthEquipo) * 100
        console.log(porcentaje + "%");
        await asyncForEach(equipos.docs, async(docEquipos) => {
            indiceEquipo++;
            porcentaje = Math.round((((indiceEquipo / lengthEquipo) * 100) + Number.EPSILON) * 100) / 100;
            await waitFor(50);
            let consulta_temporada = doc(db, "Temporadas", docEquipos._document.data.value.mapValue.fields.Temporada.stringValue);
            let docSnap_temporada = await getDoc(consulta_temporada);
            let consulta_categoria = doc(db, "Categorias", docEquipos._document.data.value.mapValue.fields.Categoria.stringValue);
            let docSnap_categoria = await getDoc(consulta_categoria);
            let bodyData = [];
            let equipo_personas = await obtenerMiembroEquipos(docEquipos.id);

            if (equipo_personas != null) {
                let indice_jugador = 0;
                equipo_personas.forEach(persona => {
                    indice_jugador++;
                    let datoPersona = crearData(
                        indice_jugador,
                        persona.data().Nombre_completo,
                        docSnap_temporada.data().Titulo,
                        docSnap_categoria.data().Descripcion
                    );
                    bodyData.push(datoPersona);
                });

                if (docPDF.lastAutoTable.finalY == undefined) {
                    docPDF.text("ROSTER DE " + docEquipos._document.data.value.mapValue.fields.Nombre_completo.stringValue.toUpperCase(), 14, 20)
                    docPDF.autoTable({
                        styles: { fontSize: 8 },
                        startY: 25,
                        head: [
                            { no: 'No.', nombre: 'Nombre completo', temporada: 'Temporada', categoria: 'Categoria' }
                        ],
                        body: bodyData,
                        theme: 'grid'
                    });
                    console.log(porcentaje + "%");
                } else {
                    docPDF.addPage('p', 'mm', 'letter')
                    let finalY = docPDF.lastAutoTable.finalY;
                    docPDF.text("ROSTER DE " + docEquipos._document.data.value.mapValue.fields.Nombre_completo.stringValue.toUpperCase(), 14, 20)
                    docPDF.autoTable({
                        styles: { fontSize: 8 },
                        startY: 25,
                        head: headRows(),
                        body: bodyData,
                        theme: 'grid',
                    });
                    console.log(porcentaje + "%");
                }
            }
        });
        console.log("Done");
    }

    return docPDF;
};

// Exportacion de equipos a PDF
btnExportar.addEventListener("click", async() => {
    btnExportar.innerHTML = "Generando...";
    btnExportar.disabled = true;
    let pdf = await generarPDF();
    btnExportar.innerHTML = "Exportar Equipos";
    btnExportar.disabled = false;
    pdf.save("Reporte_Equipos.pdf");
});