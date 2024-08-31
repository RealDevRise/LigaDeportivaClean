import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "./firebaseCore.js";
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
const comboBox_tipoEventos = document.getElementById("select_tipo_evento");
const comboBox_equipo_a = document.getElementById("select_equipo_a");
const comboBox_equipo_b = document.getElementById("select_equipo_b");
const seccion_seleccion_equipos = document.getElementById("seccion_seleccion_equipos");

// Campos Formulario //
const campoTitulo = document.getElementById("input_titulo");
const campoFecha = document.getElementById("input_fecha");

const limite = 5;
let ultimoDocumento = null;
let primerDocumento = null;
let uidUser = "";
let id_Temporal = "";

onAuthStateChanged(auth, (user) => {
    if (user) {
        const name_dropdown = document.getElementById("menu-dropdown");
        name_dropdown.innerHTML = user.displayName;
        name_dropdown.setAttribute("usrid", user.uid);
        ldObtener(user.uid);
        cargarDatosFormulario();
        uidUser = user.uid;
    } else {
        window.location.replace('/Login.html');
    }
});

comboBox_tipoEventos.addEventListener("change", (e) => {
    if (e.target.options[e.target.selectedIndex].text == "Juego") {
        seccion_seleccion_equipos.classList.remove("hide");
        select_equipo_a.required = true;
        select_equipo_b.required = true;
    } else {
        seccion_seleccion_equipos.classList.add("hide");
        select_equipo_a.required = false;
        select_equipo_b.required = false;
    }
});

const cargarDatosFormulario = async() => {
    const consultaTipoEventos = query(collection(db, "Calendario_tipo_eventos"));
    const consultaEquipos = query(collection(db, "Equipos"));

    const documentoTipoEventos = await getDocs(consultaTipoEventos);
    if (documentoTipoEventos.docs.length > 0) {
        documentoTipoEventos.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Descripcion;
            comboBox_tipoEventos.appendChild(opcion);
        });
    }

    const documentosEquipos = await getDocs(consultaEquipos);
    if (documentosEquipos.docs.length > 0) {
        documentosEquipos.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Nombre_completo;
            comboBox_equipo_a.appendChild(opcion);
        });
    }

    if (documentosEquipos.docs.length > 0) {
        documentosEquipos.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Nombre_completo;
            comboBox_equipo_b.appendChild(opcion);
        });
    }
}

// CREAR TEMPORADA //
// Guardar a FireStore //
const ld_crear = async(datos) => {
        try {
            const docRef = await addDoc(collection(db, "Calendario"), {
                Titulo: datos.titulo,
                Descripcion: datos.descripcion,
                Fecha: datos.fecha,
                Autor: uidUser,
                Tipo_evento: datos.tipoEvento,
                Equipo_a: datos.equipoA,
                Equipo_b: datos.equipoB
            });

            // Regresar a las noticias //
            ldObtener(uidUser);
            regresarGrid();

        } catch (e) {
            console.error("Error al registrar: ", e);
        }
    }
    // Función nueva temporada //
btnNuevo.addEventListener("click", (e) => {
    limpiarFormulario();
    seccion_seleccion_equipos.classList.add("hide");
    document.getElementById('ld_principal').classList.add('hide');
    document.getElementById('seccion_ld_formulario').classList.remove('hide');
    document.getElementById('titulo-formulario').innerHTML = 'Nuevo registro';
    document.getElementById('btn_submit').innerHTML = 'Guardar';
    document.getElementById('btn_submit').setAttribute("value", "nuevo");

});

// Función para registrar/actualizar noticia //
ldFormulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const modoRegistro = document.getElementById('btn_submit').value;

    const jsonData = {
        titulo: campoTitulo.value,
        fecha: new Date(campoFecha.value),
        descripcion: $('#summernote').summernote('code'),
        tipoEvento: comboBox_tipoEventos.value,
        equipoA: comboBox_equipo_a.value,
        equipoB: comboBox_equipo_b.value
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
    const consulta = query(collection(db, "Calendario"),
        where("Autor", "==", usrId),
        orderBy("Fecha", "desc"),
        limit(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);

}

const ldLeer = async(id) => {
    const docRef = doc(db, "Calendario", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        id_Temporal = docSnap.id;
        campoTitulo.value = docSnap.data().Titulo;
        // campoFecha.value = docSnap.data().Fecha.toDate();

        let fechaData = docSnap.data().Fecha.toDate();
        fechaData.setMinutes(fechaData.getMinutes() - fechaData.getTimezoneOffset());

        campoFecha.value = fechaData.toISOString().slice(0, -1);

        $("#summernote").summernote("code", docSnap.data().Descripcion);

        comboBox_tipoEventos.value = docSnap.data().Tipo_evento;

        if (docSnap.data().Tipo_evento == "8b0X2QpcVNBtcx9T2hqt") {
            seccion_seleccion_equipos.classList.remove("hide");
            comboBox_equipo_a.value = docSnap.data().Equipo_a;
            comboBox_equipo_b.value = docSnap.data().Equipo_b;
            select_equipo_a.required = true;
            select_equipo_b.required = true;
        }

        document.getElementById('ld_principal').classList.add('hide');
        document.getElementById('seccion_ld_formulario').classList.remove('hide');
        document.getElementById('titulo-formulario').innerHTML = 'Actualizar registro';
        document.getElementById('btn_submit').innerHTML = 'Actualizar';
        document.getElementById('btn_submit').setAttribute("value", "actualizar");
    } else {
        console.log("Error al obtener documento!");
        return null;
    }
}

// ACTUALIZAR TEMPORADA //
const ld_actualizar = async(datos) => {
    const docRef = doc(db, "Calendario", id_Temporal);

    await updateDoc(docRef, {
        Titulo: datos.titulo,
        Descripcion: datos.descripcion,
        Fecha: datos.fecha,
        Tipo: datos.tipoEvento,
        Equipo_a: datos.equipoA,
        Equipo_b: datos.equipoB
    });

    ldObtener(uidUser);
    regresarGrid();
}

// ELIMINAR TEMPORADA //
btnModalEliminar.addEventListener("click", (e) => {
    ldEliminar(e.target.value);
});

const ldEliminar = async(id) => {
    await deleteDoc(doc(db, "Calendario", id));
    $('#modal-eliminar').modal('hide');
    ldObtener(uidUser);
}

// Paginacion a la siguiente pagina Noticias //
const paginaSiguiente = async(usrId) => {
    const consulta = query(collection(db, "Calendario"),
        where("Autor", "==", usrId),
        orderBy("Fecha", "desc"),
        limit(limite),
        startAfter(ultimoDocumento)
    );
    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);
}

// Paginacion a la previa pagina Noticias //
const paginaAnterior = async(usrId) => {
    const consulta = query(collection(db, "Calendario"),
        where("Autor", "==", usrId),
        orderBy("Fecha", "desc"),
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
            contenedorNoticias.innerHTML += `
            <div class="card-body">
                <h4 class="card-title" style="display:flex; align-items:center; margin-bottom:0.25rem;">${doc.data().Titulo}</h4>
                <p class="card-text" style="font-size:0.8rem; margin-bottom:0.3rem;">Fecha: <span class="noticia-fecha-publicacion">${doc.data().Fecha.toDate().toLocaleDateString("es-MX")}</span></p>
                <div class="contenedor-descripcion-evento">${doc.data().Descripcion}</div>
                <button id="${doc.id}" data-idObject="${doc.id}" class="btn btnDashboard btnDashboard-primary">Editar</button>
                <button class="btn btnDashboard btn-danger" onclick="confirmarEliminacion('${doc.id}')">Eliminar</button>
            </div>
            `;
        });




    }
}

btnSiguiente.addEventListener("click", () => {
    paginaSiguiente(uidUser);
});

btnAtras.addEventListener("click", () => {
    paginaAnterior(uidUser);
});

// Función para editar //
ldContenedorTabla.addEventListener("click", (event) => {
    const isButton = event.target.nodeName === "BUTTON";
    if (!isButton) {
        return;
    }
    if (event.target.id !== "") {
        ldLeer(event.target.id);
    }

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




// Regresa al grid con las noticias //
const regresarGrid = () => {
    document.getElementById('ld_principal').classList.remove('hide');
    document.getElementById('seccion_ld_formulario').classList.add('hide');
}

// Limpieza de formulario //
const limpiarFormulario = () => {
    ldFormulario.reset();
    $('#summernote').summernote('reset');
};