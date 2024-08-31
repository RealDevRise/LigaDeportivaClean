import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAt, endAt, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "./firebaseCore.js";
import * as corePersonas from "./core/personas.js";
import * as coreCategoriaJugador from "./core/categoriajugador.js";
import * as coreBitacoraPersona from "./core/bitacorapersonas.js";
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
const formulario_busqueda = document.getElementById("form_buscador");
const campo_nombre_busqueda = document.getElementById("nombre_busqueda");

// Campos del formulario //

// SECCION FORMULARIO GENERAL //
const campoNombreCompleto = document.getElementById("input_nombreCompleto");
const campoNombreCorto = document.getElementById("input_nombreCorto");
const campoTemporadaActual = document.getElementById("select_temporada");
const campoCategoriaActual = document.getElementById("select_categoria");
const campoEquipoActual = document.getElementById("select_equipo");
const campoFechaNacimiento = document.getElementById("input_fechaNacimiento");
const campoTipoPersona = document.getElementById("select_tipoPersona");
const campoCURP = document.getElementById("input_curp");

const campoDireccionCalle = document.getElementById("input_calle");
const campoDireccionNumero = document.getElementById("input_numero");
const campoDireccionColonia = document.getElementById("input_colonia");
const campoDireccionCiudad = document.getElementById("input_ciudad");
const campoDireccionEstado = document.getElementById("input_estado");
const campoDireccionPais = document.getElementById("input_pais");

// SECCION FORMULARIO PERSONAS //
const contactoPersona = document.getElementById("div_contactoPersona");
const divAccesso = document.getElementById("div_acceso");
const campoTelefono = document.getElementById("input_telefono");
const campoEmail = document.getElementById("input_email");
const checkAcceso = document.getElementById("checkAcceso");
const campoPassAcceso = document.getElementById("input_password");

// SECCION FORMULARIO JUGADOR //
const formularioJugador = document.getElementById("div_formularioJugador");
const formularioCamisa = document.getElementById("div_campoCamisa");
const formularioCategoriaJugador = document.getElementById("div_campoCategoriaJugador");
const formularioTelefonoJugador = document.getElementById("div_campoTelefonoJugador");
const formularioEdadLiga = document.getElementById("div_campoEdadLiga");
const formularioAsociacion = document.getElementById("div_campoAsociacion");
const formularioEquipoOrigen = document.getElementById("div_equipoOrigen");
const formularioObservacionJugador = document.getElementById("div_campoObservacionesJugador");
const formulatioMovimientos = document.getElementById("div_camporObservacionMovimiento");
const formularioFechaMovimiento = document.getElementById("div_campoFechaMovimiento");
const campoFechaMovimiento = document.getElementById("input_fechaMovimiento");
const campoObservacionMovimiento = document.getElementById("input_observacionesMovimiento");
const campoCamisa = document.getElementById("input_numeroCamisa");
const campoCategoriaJugador = document.getElementById("select_categoriaJugador");
const campoNombrePadre = document.getElementById("input_nombrePadre");
const campoTelefonoPadre = document.getElementById("input_telefonoPadre");
const campoEmailPadre = document.getElementById("input_emailPadre");
const campoNombreMadre = document.getElementById("input_nombreMadre");
const campoTelefonoMadre = document.getElementById("input_telefonoMadre");
const campoEmailMadre = document.getElementById("input_emailMadre");

const campoTelefonoJugador = document.getElementById("input_telefonoJugador");
const campoEdadLiga = document.getElementById("select_edadLiga");
const campoRegistroAsociacion = document.getElementById("input_registroAsociacion");
const campoEquipoOrigen = document.getElementById("select_equipoOrigen");
const campoObservacionesJugador = document.getElementById("input_observacionesJugador");

const limite = 5;
let ultimoDocumento = null;
let primerDocumento = null;
let uidUser = "";
let id_Temporal = "";
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

// Guardar a FireStore //
const ld_crear = async(datos) => {

    // Registro de la persona //
    const registrar = await corePersonas.Registrar(datos);

    if (registrar == null) {
        // Error //
        // Notificar Error //
        return;
    }

    // Registro bitácora (Solo jugadores) //
    if (datos.tipoPersona == "jugador") {

        const jsonData = {
            persona: registrar.id,
            fechamovimiento: new Date(`${campoFechaMovimiento.value}T00:00`),
            responsable: uidUser,
            temporada: datos.temporadaActual,
            categoria: datos.categoriaActual,
            equipo: datos.equipoActual,
            observaciones: campoObservacionMovimiento.value
        };

        const RegistrarBitacora = await coreBitacoraPersona.Registro(jsonData, "alta");
    }

    // Regresar al grid //
    ldObtener(uidUser);
    regresarGrid();

    // try {
    //     const docRef = await addDoc(collection(db, "Personas"), {
    //         Nombre_completo: datos.nombreCompleto,
    //         Nombre_corto: datos.nombreCorto,
    //         Temporada_actual: datos.temporadaActual,
    //         Categoria_actual: datos.categoriaActual,
    //         Equipo_actual: datos.equipoActual,
    //         Fecha_nacimiento: datos.fechaNacimiento,
    //         Tipo_persona: datos.tipoPersona,
    //         Nombre_calle: datos.calle,
    //         Numero_casa: datos.noCasa,
    //         Colonia: datos.colonia,
    //         Ciudad: datos.ciudad,
    //         Estado: datos.estado,
    //         Pais: datos.pais,
    //         Contacto_telefono: datos.telefono,
    //         Contacto_email: datos.email,
    //         Contacto_acceso_dashboard: datos.acceso,
    //         Contacto_contrasena: datos.password,
    //         Contacto_nombre_padre: datos.nombrePadre,
    //         Contacto_telefono_padre: datos.telefonoPadre,
    //         Contacto_email_padre: datos.emailPadre,
    //         Contacto_nombre_madre: datos.nombreMadre,
    //         Contacto_telefono_madre: datos.telefonoMadre,
    //         Contacto_email_madre: datos.emailMadre,
    //         Jugador_numero_camisa: datos.numeroCamisa,
    //         Notas: datos.notas,
    //         Autor: uidUser,
    //         Fecha_registro: Timestamp.now()
    //     });


    //     if (datos.acceso) {
    //         // Crear Usuario auth //
    //     }



    //     // Regresar al grid //
    //     ldObtener(uidUser);
    //     regresarGrid();

    // } catch (e) {
    //     console.error("Error al registrar categoría: ", e);
    // }
}


// Función registro nuevo //
btnNuevo.addEventListener("click", (e) => {
    limpiarFormulario();
    document.getElementById('ld_principal').classList.add('hide');
    document.getElementById('seccion_ld_formulario').classList.remove('hide');
    document.getElementById('titulo-formulario').innerHTML = 'Nueva Persona';
    document.getElementById('btn_submit').innerHTML = 'Guardar';
    document.getElementById('btn_submit').setAttribute("value", "nuevo");

});

// Función para registrar/actualizar //
ldFormulario.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("control-paginado").classList.remove("hide");
    const modoRegistro = document.getElementById('btn_submit').value;

    const jsonData = {
        nombreCompleto: campoNombreCompleto.value,
        nombreCorto: campoNombreCorto.value,
        temporadaActual: campoTemporadaActual.value,
        categoriaActual: campoCategoriaActual.value,
        telefonojugador: campoTelefonoJugador.value,
        edadliga: campoEdadLiga.value,
        registroasociacion: campoRegistroAsociacion.value,
        equipoorigen: campoEquipoOrigen.value,
        observacionjugador: campoObservacionesJugador.value,
        equipoActual: campoEquipoActual.value,
        fechaNacimiento: campoFechaNacimiento.value,
        curp: campoCURP.value,
        tipoPersona: campoTipoPersona.value,
        calle: campoDireccionCalle.value,
        noCasa: campoDireccionNumero.value,
        colonia: campoDireccionColonia.value,
        ciudad: campoDireccionCiudad.value,
        estado: campoDireccionEstado.value,
        pais: campoDireccionPais.value,
        telefono: campoTelefono.value,
        email: campoEmail.value,
        acceso: checkAcceso.checked,
        password: campoPassAcceso.value,
        numeroCamisa: campoCamisa.value,
        categoriajugador: campoCategoriaJugador.value,
        nombrePadre: campoNombrePadre.value,
        telefonoPadre: campoTelefonoPadre.value,
        emailPadre: campoEmailPadre.value,
        nombreMadre: campoNombreMadre.value,
        telefonoMadre: campoTelefonoMadre.value,
        emailMadre: campoEmailMadre.value,
        autor: uidUser,
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

formulario_busqueda.addEventListener("submit", async(e) => {
    e.preventDefault();
    await busqueda_persona();
});

const busqueda_persona = async() => {
    let documentSnapshots = null;

    if (campo_nombre_busqueda.value == '' && cache_busqueda != null) {
        location.reload();
        return;
    }

    if (campo_nombre_busqueda.value != '') {
        if (cache_busqueda == null) {
            const consulta = query(collection(db, "Personas"),
                orderBy("Nombre_completo", "asc")
            );

            documentSnapshots = await getDocs(consulta);

            if (documentSnapshots.docs.length > 0) {
                document.getElementById("control-paginado").classList.add("hide");
                cache_busqueda = documentSnapshots;
            }


        } else {
            documentSnapshots = cache_busqueda;
        }

        if (documentSnapshots.docs.length > 0) {
            armarTarjetas_busqueda(documentSnapshots);
        }
    }
}


// LEER FIRESTORE //
const ldObtener = async(usrId) => {
    const consulta = query(collection(db, "Personas"),
        orderBy("Fecha_registro", "desc"),
        limit(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);

}

const ldLeer = async(id) => {
    ldFormulario.reset();
    formularioJugador.classList.add("hide");
    formularioCamisa.classList.add("hide");
    formularioCategoriaJugador.classList.add("hide");
    formularioTelefonoJugador.classList.add("hide");
    formularioEdadLiga.classList.add("hide");
    formularioAsociacion.classList.add("hide");
    formularioEquipoOrigen.classList.add("hide");
    formularioObservacionJugador.classList.add("hide");
    formulatioMovimientos.classList.add("hide");
    formularioFechaMovimiento.classList.add("hide");
    contactoPersona.classList.add("hide");

    const docRef = doc(db, "Personas", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        id_Temporal = docSnap.id;

        campoNombreCompleto.value = docSnap.data().Nombre_completo;
        campoNombreCorto.value = docSnap.data().Nombre_corto;
        campoTemporadaActual.value = docSnap.data().Temporada_actual;
        campoCategoriaActual.value = docSnap.data().Categoria_actual;
        campoEquipoActual.value = docSnap.data().Equipo_actual;
        campoFechaNacimiento.value = docSnap.data().Fecha_nacimiento;


        if (docSnap.data().Curp != undefined)
            campoCURP.value = docSnap.data().Curp;

        campoTipoPersona.value = docSnap.data().Tipo_persona;

        campoDireccionCalle.value = docSnap.data().Nombre_calle;
        campoDireccionNumero.value = docSnap.data().Numero_casa;
        campoDireccionColonia.value = docSnap.data().Colonia;
        campoDireccionCiudad.value = docSnap.data().Ciudad;
        campoDireccionEstado.value = docSnap.data().Estado;
        campoDireccionPais.value = docSnap.data().Pais;

        $("#summernote").summernote("code", docSnap.data().Notas);

        if (docSnap.data().Tipo_persona == "jugador") {
            campoCamisa.value = docSnap.data().Jugador_numero_camisa;
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

            campoNombrePadre.value = docSnap.data().Contacto_nombre_padre;
            campoTelefonoPadre.value = docSnap.data().Contacto_telefono_padre;
            campoEmailPadre.value = docSnap.data().Contacto_email_padre;
            campoNombreMadre.value = docSnap.data().Contacto_nombre_madre;
            campoTelefonoMadre.value = docSnap.data().Contacto_telefono_madre;
            campoEmailMadre.value = docSnap.data().Contacto_email_madre;
            formularioJugador.classList.remove("hide");
            formularioCamisa.classList.remove("hide");
            formularioCategoriaJugador.classList.remove("hide");
            formularioTelefonoJugador.classList.remove("hide");
            formularioEdadLiga.classList.remove("hide");
            formularioAsociacion.classList.remove("hide");
            formularioEquipoOrigen.classList.remove("hide");
            formularioObservacionJugador.classList.remove("hide");
            formulatioMovimientos.classList.remove("hide");
            formularioFechaMovimiento.classList.remove("hide");


            // Obtener Datos del ultimo registro de bitácora //

            const obtenerUltimoRegistroBitacora = await coreBitacoraPersona.Obtener_Ultimo_Registro(id);
            if (obtenerUltimoRegistroBitacora != null) {

                obtenerUltimoRegistroBitacora.forEach(documento => {

                    if (documento.data().fecha_movimiento != undefined)
                        campoFechaMovimiento.value = documento.data().fecha_movimiento.toDate().toISOString().split('T')[0];

                    if (documento.data().observaciones != undefined)
                        campoObservacionMovimiento.value = documento.data().observaciones;
                });

            }

        } else {
            campoTelefono.value = docSnap.data().Contacto_telefono;
            campoEmail.value = docSnap.data().Contacto_email;
            checkAcceso.checked = docSnap.data().Contacto_acceso_dashboard;
            if (docSnap.data().acceso) {
                divAccesso.classList.remove("hide");
                campoPassAcceso.value = docSnap.data().Contacto_contrasena;
            }
            contactoPersona.classList.remove("hide");
        }

        document.getElementById('ld_principal').classList.add('hide');
        document.getElementById('seccion_ld_formulario').classList.remove('hide');
        document.getElementById('titulo-formulario').innerHTML = 'Actualizar persona';
        document.getElementById('btn_submit').innerHTML = 'Actualizar';
        document.getElementById('btn_submit').setAttribute("value", "actualizar");
    } else {
        console.log("Error al obtener documento!");
        return null;
    }
}

// ACTUALIZAR TEMPORADA //
const ld_actualizar = async(datos) => {
    // const docRef = doc(db, "Personas", id_Temporal);

    // await updateDoc(docRef, {
    //     Nombre_completo: datos.nombreCompleto,
    //     Nombre_corto: datos.nombreCorto,
    //     Temporada_actual: datos.temporadaActual,
    //     Categoria_actual: datos.categoriaActual,
    //     Equipo_actual: datos.equipoActual,
    //     Fecha_nacimiento: datos.fechaNacimiento,
    //     Curp: datos.curp,
    //     Tipo_persona: datos.tipoPersona,
    //     Nombre_calle: datos.calle,
    //     Numero_casa: datos.noCasa,
    //     Colonia: datos.colonia,
    //     Ciudad: datos.ciudad,
    //     Estado: datos.estado,
    //     Pais: datos.pais,
    //     Contacto_telefono: datos.telefono,
    //     Contacto_email: datos.email,
    //     Contacto_acceso_dashboard: datos.acceso,
    //     Contacto_contrasena: datos.password,
    //     Contacto_nombre_padre: datos.nombrePadre,
    //     Contacto_telefono_padre: datos.telefonoPadre,
    //     Contacto_email_padre: datos.emailPadre,
    //     Contacto_nombre_madre: datos.nombreMadre,
    //     Contacto_telefono_madre: datos.telefonoMadre,
    //     Contacto_email_madre: datos.emailMadre,
    //     Jugador_numero_camisa: datos.numeroCamisa,
    //     Notas: datos.notas
    // });

    // Actualizar persona //
    const responseActualizar = await corePersonas.Actualizar(id_Temporal, datos);

    // Registro bitácora (Solo jugadores) //
    if (datos.tipoPersona == "jugador") {

        const jsonData = {
            persona: id_Temporal,
            fechamovimiento: new Date(`${campoFechaMovimiento.value}T00:00`),
            responsable: uidUser,
            temporada: datos.temporadaActual,
            categoria: datos.categoriaActual,
            equipo: datos.equipoActual,
            observaciones: campoObservacionMovimiento.value
        };

        const RegistrarBitacora = await coreBitacoraPersona.Registro(jsonData, "alta");
    }

    // Actualizar nombre en las estadísticas
    await corePersonas.Cambiar_Nombre_Estadisticas(id_Temporal, datos.nombreCompleto);

    ldObtener(uidUser);
    regresarGrid();
}

// ELIMINAR TEMPORADA //
btnModalEliminar.addEventListener("click", (e) => {
    console.log(e.target.value);
    ldEliminar(e.target.value);
});

const ldEliminar = async(id) => {
    try {
        await deleteDoc(doc(db, "Personas", id));
    } catch (e) {
        console.log(e);
    }
    $('#modal-eliminar').modal('hide');
    ldObtener(uidUser);
}

// Paginacion a la siguiente pagina Noticias //
const paginaSiguiente = async(usrId) => {
    const consulta = query(collection(db, "Personas"),
        orderBy("Nombre_completo", "desc"),
        limit(limite),
        startAfter(ultimoDocumento)
    );
    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);
}

// Paginacion a la previa pagina Noticias //
const paginaAnterior = async(usrId) => {
    const consulta = query(collection(db, "Personas"),
        orderBy("Nombre_completo", "desc"),
        endBefore(primerDocumento),
        limitToLast(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);
}

// Armado de tarjeta por busqueda //
const armarTarjetas_busqueda = (snapshot) => {
    if (snapshot.docs.length > 0) {
        ultimoDocumento = snapshot.docs[snapshot.docs.length - 1];
        primerDocumento = snapshot.docs[0];

        contenedorNoticias.innerHTML = '';

        snapshot.forEach(doc => {
            let nombre_doc = doc.data().Nombre_completo.toLowerCase();
            let nombre_buscar = campo_nombre_busqueda.value.toLowerCase();
            let evaluar_busqueda = nombre_doc.includes(nombre_buscar);
            if (evaluar_busqueda) {
                let fechaRegistro = doc.data().Fecha_registro.toDate().toLocaleDateString("es-MX");

                let divCardBody = document.createElement("div");
                divCardBody.classList.add("card-body");

                let h4Card = document.createElement("h4");
                h4Card.classList.add("card-title");
                h4Card.setAttribute("style", "display:flex; align-items:center; margin-bottom:0.25rem;")
                h4Card.innerHTML = `<span class="badge bg-success" style="font-size:1rem; margin-right:5px;">${tipoPersona(doc.data().Tipo_persona)}</span> ${doc.data().Nombre_completo}`;
                divCardBody.appendChild(h4Card);

                let pCard = document.createElement("p")
                pCard.classList.add("card-text");
                pCard.setAttribute("style", "font-size:0.8rem; margin-bottom:0.8rem;");
                pCard.innerHTML = `Fecha de registro: <span class="noticia-fecha-publicacion">${fechaRegistro}</span>`;
                divCardBody.appendChild(pCard);

                let btnEditCard = document.createElement("button");
                btnEditCard.id = doc.id;
                btnEditCard.setAttribute("data-idObject", doc.id);
                btnEditCard.setAttribute("class", "btn btnDashboard btnDashboard-primary");
                btnEditCard.innerHTML = "Editar";
                btnEditCard.addEventListener("click", () => {
                    ldLeer(doc.id);
                });
                divCardBody.appendChild(btnEditCard);

                let btnBitacoraCard = document.createElement("button");
                btnBitacoraCard.id = doc.id;
                btnBitacoraCard.setAttribute("data-idObject", doc.id);
                btnBitacoraCard.setAttribute("class", "btn btnDashboard btnDashboard-primary");
                btnBitacoraCard.setAttribute("style", "margin-left:6px;")
                btnBitacoraCard.innerHTML = "Bitácora";
                btnBitacoraCard.addEventListener("click", async() => {
                    await leerBitacora(doc.id, doc.data().Nombre_completo);
                    document.getElementById("titulo_bitacora").innerHTML = `Bitácora de ${doc.data().Nombre_completo}`;
                    document.getElementById("seccion_ld_bitacora").classList.remove("hide");
                    document.getElementById('ld_principal').classList.add('hide');
                });
                divCardBody.appendChild(btnBitacoraCard);

                let btnEliminarCard = document.createElement("button");
                btnEliminarCard.setAttribute("class", "btn btnDashboard btn-danger");
                btnEliminarCard.setAttribute("style", "border: 1px solid transparent; margin-left: 6px;");
                btnEliminarCard.addEventListener("click", () => {
                    confirmarEliminacion(doc.id);
                });
                btnEliminarCard.innerHTML = "Eliminar";
                divCardBody.appendChild(btnEliminarCard);

                contenedorNoticias.appendChild(divCardBody);


                //     contenedorNoticias.innerHTML += `
                // <div class="card-body">
                //     <h4 class="card-title" style="display:flex; align-items:center; margin-bottom:0.25rem;"><span class="badge bg-success" style="font-size:1rem; margin-right:5px;">${tipoPersona(doc.data().Tipo_persona)}</span> ${doc.data().Nombre_completo}</h4>
                //     <p class="card-text" style="font-size:0.8rem; margin-bottom:0.8rem;">Fecha de registro: <span class="noticia-fecha-publicacion">${fechaRegistro}</span></p>
                //     <button id="${doc.id}" data-idObject="${doc.id}" class="btn btnDashboard btnDashboard-primary">Editar</button>

                //     <button class="btn btnDashboard btn-danger" onclick="confirmarEliminacion('${doc.id}')">Eliminar</button>
                // </div>
                // `;
            }
        });
    }
}

// Armado de tarjeta //
const ldArmarTarjetas = (documentos) => {
    if (documentos.docs.length > 0) {
        ultimoDocumento = documentos.docs[documentos.docs.length - 1];
        primerDocumento = documentos.docs[0];
        contenedorNoticias.innerHTML = '';

        documentos.forEach(doc => {
            let fechaRegistro = doc.data().Fecha_registro.toDate().toLocaleDateString("es-MX");

            let divCardBody = document.createElement("div");
            divCardBody.classList.add("card-body");

            let h4Card = document.createElement("h4");
            h4Card.classList.add("card-title");
            h4Card.setAttribute("style", "display:flex; align-items:center; margin-bottom:0.25rem;")
            h4Card.innerHTML = `<span class="badge bg-success" style="font-size:1rem; margin-right:5px;">${tipoPersona(doc.data().Tipo_persona)}</span> ${doc.data().Nombre_completo}`;
            divCardBody.appendChild(h4Card);

            let pCard = document.createElement("p")
            pCard.classList.add("card-text");
            pCard.setAttribute("style", "font-size:0.8rem; margin-bottom:0.8rem;");
            pCard.innerHTML = `Fecha de registro: <span class="noticia-fecha-publicacion">${fechaRegistro}</span>`;
            divCardBody.appendChild(pCard);

            let btnEditCard = document.createElement("button");
            btnEditCard.id = doc.id;
            btnEditCard.setAttribute("data-idObject", doc.id);
            btnEditCard.setAttribute("class", "btn btnDashboard btnDashboard-primary");
            btnEditCard.innerHTML = "Editar";
            btnEditCard.addEventListener("click", () => {
                ldLeer(doc.id);
            });
            divCardBody.appendChild(btnEditCard);

            let btnBitacoraCard = document.createElement("button");
            btnBitacoraCard.id = doc.id;
            btnBitacoraCard.setAttribute("data-idObject", doc.id);
            btnBitacoraCard.setAttribute("class", "btn btnDashboard btnDashboard-primary");
            btnBitacoraCard.setAttribute("style", "margin-left:6px;")
            btnBitacoraCard.innerHTML = "Bitácora";
            btnBitacoraCard.addEventListener("click", async() => {
                await leerBitacora(doc.id, doc.data().Nombre_completo);
                document.getElementById("titulo_bitacora").innerHTML = `Bitácora de ${doc.data().Nombre_completo}`;
                document.getElementById("seccion_ld_bitacora").classList.remove("hide");
                document.getElementById('ld_principal').classList.add('hide');
            });
            divCardBody.appendChild(btnBitacoraCard);

            let btnEliminarCard = document.createElement("button");
            btnEliminarCard.setAttribute("class", "btn btnDashboard btn-danger");
            btnEliminarCard.setAttribute("style", "border: 1px solid transparent; margin-left: 6px;");
            btnEliminarCard.addEventListener("click", () => {
                confirmarEliminacion(doc.id);
            });
            btnEliminarCard.innerHTML = "Eliminar";
            divCardBody.appendChild(btnEliminarCard);

            contenedorNoticias.appendChild(divCardBody);

            // contenedorNoticias.innerHTML += `
            // <div class="card-body">
            //     <h4 class="card-title" style="display:flex; align-items:center; margin-bottom:0.25rem;"><span class="badge bg-success" style="font-size:1rem; margin-right:5px;">${tipoPersona(doc.data().Tipo_persona)}</span> ${doc.data().Nombre_completo}</h4>
            //     <p class="card-text" style="font-size:0.8rem; margin-bottom:0.8rem;">Fecha de registro: <span class="noticia-fecha-publicacion">${fechaRegistro}</span></p>
            //     <button id="${doc.id}" data-idObject="${doc.id}" class="btn btnDashboard btnDashboard-primary">Editar</button>

            //     <button class="btn btnDashboard btn-danger" onclick="confirmarEliminacion('${doc.id}')">Eliminar</button>
            // </div>
            // `;
        });




    }
}

document.getElementById("btnBitacoraRegresar").addEventListener("click", () => {
    document.getElementById("seccion_ld_bitacora").classList.add("hide");
    document.getElementById('ld_principal').classList.remove('hide');
});

const leerBitacora = async(id = "", nombreCompleto = "") => {
    let tableBodyBitacora = document.getElementById("tbody_bitacora");
    tableBodyBitacora.innerHTML = "";
    const consulta = query(collection(db, "Bitacora_personas"),
        where("persona", "==", id),
        orderBy("fecha", "desc")
    );

    const docSnap = await getDocs(consulta);

    if (docSnap.docs.length > 0) {
        docSnap.forEach(async(documento) => {
            let idTemporada_ = documento.data().temporada;
            let idCategoria_ = documento.data().categoria;
            let idEquipo_ = documento.data().equipo;

            let nombreTemporada;
            if (idTemporada_ == undefined) nombreTemporada = "N/A";
            else nombreTemporada = await obtenerNombreTemporada(idTemporada_);

            let nombreCategoria;
            if (idCategoria_ == undefined) nombreCategoria = "N/A";
            else nombreCategoria = await obtenerNombreCategoria(idCategoria_);

            let nombreEquipo;
            if (idEquipo_ == undefined) nombreEquipo = "N/A";
            else nombreEquipo = await obtenerNombreEquipo(idEquipo_);




            let trBody = document.createElement("tr");


            let tdBadgeAccion = document.createElement("td");
            if (documento.data().accion == "alta")
                tdBadgeAccion.innerHTML = `<span class="badge badge-success" style="font-size:100%;">Alta</span>`;
            else
                tdBadgeAccion.innerHTML = `<span class="badge badge-danger" style="font-size:100%;">Baja</span>`;
            trBody.appendChild(tdBadgeAccion);

            let tdFechaAccion = document.createElement("td");
            tdFechaAccion.innerHTML = documento.data().fecha.toDate().toLocaleDateString("es-MX");
            trBody.appendChild(tdFechaAccion);

            let tdTemporada = document.createElement("td");
            tdTemporada.innerHTML = nombreTemporada;
            trBody.appendChild(tdTemporada);

            let tdCategoria = document.createElement("td");
            tdCategoria.innerHTML = nombreCategoria;
            trBody.appendChild(tdCategoria);

            let tdEquipo = document.createElement("td");
            tdEquipo.innerHTML = nombreEquipo;
            trBody.appendChild(tdEquipo);

            let tdFechaMovimiento = document.createElement("td");
            if (documento.data().fecha_movimiento == undefined)
                tdFechaMovimiento.innerHTML = "N/A";
            else
                tdFechaMovimiento.innerHTML = documento.data().fecha_movimiento.toDate().toLocaleDateString("es-MX");

            trBody.appendChild(tdFechaMovimiento);


            let tdObs = document.createElement("td");
            if (documento.data().observaciones == undefined)
                tdObs.innerHTML = "N/A";
            else
                tdObs.innerHTML = documento.data().observaciones;

            trBody.appendChild(tdObs);

            tableBodyBitacora.appendChild(trBody);
        });
    }
}

const obtenerNombrePersona = async(id = "") => {
    const docRef = doc(db, "Personas", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
        return docSnap.data().Nombre_completo;
    else
        return "N/A";
}

const obtenerNombreEquipo = async(id = "") => {
    const docRef = doc(db, "Equipos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
        return docSnap.data().Nombre_completo;
    else
        return "N/A";
}

const obtenerNombreTemporada = async(id) => {
    const docRef = doc(db, "Temporadas", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
        return docSnap.data().Titulo;
    else
        return "N/A";
}

const obtenerNombreCategoria = async(id) => {
        const docRef = doc(db, "Categorias", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists())
            return docSnap.data().Descripcion;
        else
            return "N/A";
    }
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

const cargaDatosFormulario = async(usrId) => {
    const consultaTemporadas = query(collection(db, "Temporadas"),
        orderBy("Fecha_publicacion", "desc")
    );

    const consultaCategorias = query(collection(db, "Categorias"),
        where("Status", "==", "1"),
        orderBy("Fecha_publicacion", "desc")
    );

    const consultaEquipo = query(collection(db, "Equipos"),
        orderBy("Nombre_completo", "asc")
    );



    const documentoTemporada = await getDocs(consultaTemporadas);
    if (documentoTemporada.docs.length > 0) {
        documentoTemporada.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Titulo;
            campoTemporadaActual.appendChild(opcion);
        });
    }

    const documentoCategoria = await getDocs(consultaCategorias);
    if (documentoCategoria.docs.length > 0) {
        documentoCategoria.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Descripcion;
            campoCategoriaActual.appendChild(opcion);
        });
    }

    const documentoEquipo = await getDocs(consultaEquipo);
    if (documentoEquipo.docs.length > 0) {
        documentoEquipo.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Nombre_completo;
            campoEquipoActual.appendChild(opcion);
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

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
}

const tipoPersona = (tipo) => {
    switch (tipo) {
        case "admin":
            return "Administrador";
            break;

        case "directivo":
            return "Directivo";
            break;

        case "coach":
            return "Coach";
            break;

        case "manejador":
            return "Manejador";
            break;

        case "familia":
            return "Familia";
            break;

        case "jugador":
            return "Jugador";
            break;
    }
};

btnSiguiente.addEventListener("click", () => {
    paginaSiguiente(uidUser);
});

btnAtras.addEventListener("click", () => {
    paginaAnterior(uidUser);
});



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


// Acceso a la plataforma //
checkAcceso.addEventListener("change", (e) => {
    const reqPass = document.getElementById("input_password");
    if (e.target.checked) {
        divAccesso.classList.remove("hide");
        reqPass.required = true;
    } else {
        divAccesso.classList.add("hide");
        reqPass.required = false;
    }
});

// Regresa al grid con las noticias //
const regresarGrid = () => {
    document.getElementById('ld_principal').classList.remove('hide');
    document.getElementById('seccion_ld_formulario').classList.add('hide');
}

// Limpieza de formulario de noticias //
const limpiarFormulario = () => {
    ldFormulario.reset();
    formularioJugador.classList.add("hide");
    formularioCamisa.classList.add("hide");
    formularioCategoriaJugador.classList.add("hide");
    formularioTelefonoJugador.classList.add("hide");
    formularioEdadLiga.classList.add("hide");
    formularioAsociacion.classList.add("hide");
    formularioEquipoOrigen.classList.add("hide");
    formularioObservacionJugador.classList.add("hide");
    formulatioMovimientos.classList.add("hide");
    formularioFechaMovimiento.classList.add("hide");
    contactoPersona.classList.add("hide");
    $('#summernote').summernote('reset');
};


const limpiarFormularioJugador = () => {
    campoCamisa.value = "";
    campoCategoriaJugador.selectedIndex = 0;
    campoObservacionMovimiento.value = "";
    campoFechaMovimiento.value = "";
    campoNombrePadre.value = "";
    campoTelefonoPadre.value = "";
    campoEmailPadre.value = "";
    campoNombreMadre.value = "";
    campoTelefonoMadre.value = "";
    campoEmailMadre.value = "";
    formularioJugador.classList.add("hide");
    formularioCamisa.classList.add("hide");
    formularioCategoriaJugador.classList.add("hide");
    formularioTelefonoJugador.classList.add("hide");
    formularioEdadLiga.classList.add("hide");
    formularioAsociacion.classList.add("hide");
    formularioEquipoOrigen.classList.add("hide");
    formularioObservacionJugador.classList.add("hide");
    formulatioMovimientos.classList.add("hide");
    formularioFechaMovimiento.classList.add("hide");
};

const limpiarFormularioPersona = () => {
    campoTelefono.value = "";
    campoEmail.value = "";
    checkAcceso.checked = false;
    campoPassAcceso.value = "";
    contactoPersona.classList.add("hide");
    divAccesso.classList.add("hide");
};

// tipo de persona //
campoTipoPersona.addEventListener("change", (e) => {
    if (e.target.value == "jugador") {
        limpiarFormularioPersona();
        formularioJugador.classList.remove("hide");
        formularioCamisa.classList.remove("hide");
        formularioCategoriaJugador.classList.remove("hide");
        formularioTelefonoJugador.classList.remove("hide");
        formularioEdadLiga.classList.remove("hide");
        formularioAsociacion.classList.remove("hide");
        formularioEquipoOrigen.classList.remove("hide");
        formularioObservacionJugador.classList.remove("hide");
        formulatioMovimientos.classList.remove("hide");
        formularioFechaMovimiento.classList.remove("hide");
    } else {
        limpiarFormularioJugador();
        contactoPersona.classList.remove("hide");
    }
});