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
// const comboBox_tipoEventos = document.getElementById("select_tipo_evento");
const comboBox_equipo_a = document.getElementById("select_equipo_a");
const comboBox_equipo_b = document.getElementById("select_equipo_b");
const seccion_seleccion_equipos = document.getElementById("seccion_seleccion_equipos");

// Campos Formulario //
const campoTitulo = document.getElementById("input_nombre");
// const campoFecha = document.getElementById("input_fecha");

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
        uidUser = user.uid;
    } else {
        window.location.replace('/Login.html');
    }
});

// CREAR //
// Guardar a FireStore //
const ld_crear = async(datos) => {
        try {
            const docRef = await addDoc(collection(db, "Campos"), {
                Nombre: datos.titulo,
                Descripcion: datos.descripcion,
                Autor: uidUser,
                Fecha_creacion: Timestamp.now()
            });

            // Regresar //
            ldObtener(uidUser);
            regresarGrid();

        } catch (e) {
            console.error("Error al registrar: ", e);
        }
    }
    // Función nueva temporada //
btnNuevo.addEventListener("click", (e) => {
    limpiarFormulario();
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
        descripcion: $('#summernote').summernote('code')
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
    const consulta = query(collection(db, "Campos"),
        orderBy("Fecha_creacion", "desc"),
        limit(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);

}

const ldLeer = async(id) => {
    const docRef = doc(db, "Campos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        id_Temporal = docSnap.id;
        campoTitulo.value = docSnap.data().Nombre;
        $("#summernote").summernote("code", docSnap.data().Descripcion);

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
    const docRef = doc(db, "Campos", id_Temporal);

    await updateDoc(docRef, {
        Nombre: datos.titulo,
        Descripcion: datos.descripcion
    });

    ldObtener(uidUser);
    regresarGrid();
}

// ELIMINAR TEMPORADA //
btnModalEliminar.addEventListener("click", (e) => {
    ldEliminar(e.target.value);
});

const ldEliminar = async(id) => {
    await deleteDoc(doc(db, "Campos", id));
    $('#modal-eliminar').modal('hide');
    ldObtener(uidUser);
}

// Paginacion a la siguiente pagina//
const paginaSiguiente = async() => {
    const consulta = query(collection(db, "Campos"),
        orderBy("Fecha_creacion", "desc"),
        limit(limite),
        startAfter(ultimoDocumento)
    );
    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);
}

// Paginacion a la previa pagina //
const paginaAnterior = async() => {
    const consulta = query(collection(db, "Campos"),
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
            contenedorNoticias.innerHTML += `
            <div class="card-body">
                <h4 class="card-title" style="display:flex; align-items:center; margin-bottom:0.25rem;">${doc.data().Nombre}</h4>
                <p class="card-text" style="font-size:0.8rem; margin-bottom:0.3rem;">Fecha de registro: <span class="noticia-fecha-publicacion">${doc.data().Fecha_creacion.toDate().toLocaleDateString("es-MX")}</span></p>
                <button id="${doc.id}" data-idObject="${doc.id}" class="btn btnDashboard btnDashboard-primary">Editar</button>
                <button class="btn btnDashboard btn-danger" onclick="confirmarEliminacion('${doc.id}')">Eliminar</button>
            </div>
            `;
        });
    }
}

btnSiguiente.addEventListener("click", () => {
    paginaSiguiente();
});

btnAtras.addEventListener("click", () => {
    paginaAnterior();
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