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

// CREAR TEMPORADA //
// Guardar Noticia a FireStore //
const ld_crear = async(datos) => {
        try {
            const docRef = await addDoc(collection(db, "Temporadas"), {
                Titulo: datos.titulo,
                Descripcion: datos.descripcion,
                Periodo: datos.periodo,
                Fecha_inauguracion: datos.fechaInauguracion,
                Autor: uidUser,
                Fecha_publicacion: Timestamp.now()
            });

            // Regresar a las noticias //
            ldObtener(uidUser);
            regresarGrid();

        } catch (e) {
            console.error("Error al registrar temporada: ", e);
        }
    }
    // Función nueva temporada //
btnNuevo.addEventListener("click", (e) => {
    limpiarFormulario();
    document.getElementById('ld_principal').classList.add('hide');
    document.getElementById('seccion_ld_formulario').classList.remove('hide');
    document.getElementById('titulo-formulario').innerHTML = 'Nueva Temporada';
    document.getElementById('btn_submit').innerHTML = 'Guardar';
    document.getElementById('btn_submit').setAttribute("value", "nuevo");

});

// Función para registrar/actualizar noticia //
ldFormulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const modoRegistro = document.getElementById('btn_submit').value;
    const titulo = document.getElementById("input_nombreTemporada").value;
    const fechaInauguracion = document.getElementById("input_fechaInauguracion").value;
    const periodo = document.getElementById('input_periodo').value;
    const descripcion = $('#summernote').summernote('code');
    const jsonData = {
        titulo: titulo,
        fechaInauguracion: fechaInauguracion,
        periodo: periodo,
        descripcion: descripcion
    };

    if (modoRegistro === "nuevo") {
        // Registro de nueva noticia //
        ld_crear(jsonData);
    } else if (modoRegistro === "actualizar") {
        // Actualizacion de noticia //
        ld_actualizar(jsonData);
    }
});

// LEER TEMPORADA //
const ldObtener = async(usrId) => {
    const consulta = query(collection(db, "Temporadas"),
        where("Autor", "==", usrId),
        orderBy("Fecha_publicacion", "desc"),
        limit(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);

}

const ldLeer = async(id) => {
    const docRef = doc(db, "Temporadas", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        id_Temporal = docSnap.id;
        document.getElementById("input_nombreTemporada").value = docSnap.data().Titulo;
        document.getElementById("input_fechaInauguracion").value = docSnap.data().Fecha_inauguracion;
        document.getElementById("input_periodo").value = docSnap.data().Periodo;
        $("#summernote").summernote("code", docSnap.data().Descripcion);

        document.getElementById('ld_principal').classList.add('hide');
        document.getElementById('seccion_ld_formulario').classList.remove('hide');
        document.getElementById('titulo-formulario').innerHTML = 'Actualizar Temporada';
        document.getElementById('btn_submit').innerHTML = 'Actualizar';
        document.getElementById('btn_submit').setAttribute("value", "actualizar");
    } else {
        console.log("Error al obtener documento!");
        return null;
    }
}

// ACTUALIZAR TEMPORADA //
const ld_actualizar = async(datos) => {
    const docRef = doc(db, "Temporadas", id_Temporal);

    await updateDoc(docRef, {
        Titulo: datos.titulo,
        Descripcion: datos.descripcion,
        Periodo: datos.periodo,
        Fecha_inauguracion: datos.fechaInauguracion
    });

    ldObtener(uidUser);
    regresarGrid();
}

// ELIMINAR TEMPORADA //
btnModalEliminar.addEventListener("click", (e) => {
    ldEliminar(e.target.value);
});

const ldEliminar = async(id) => {
    await deleteDoc(doc(db, "Temporadas", id));
    $('#modal-eliminar').modal('hide');
    ldObtener(uidUser);
}

// Paginacion a la siguiente pagina Noticias //
const paginaSiguiente = async(usrId) => {
    const consulta = query(collection(db, "Temporadas"),
        where("Autor", "==", usrId),
        orderBy("Fecha_publicacion", "desc"),
        limit(limite),
        startAfter(ultimoDocumento)
    );
    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);
}

// Paginacion a la previa pagina Noticias //
const paginaAnterior = async(usrId) => {
    const consulta = query(collection(db, "Temporadas"),
        where("Autor", "==", usrId),
        orderBy("Fecha_publicacion", "desc"),
        endBefore(primerDocumento),
        limitToLast(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);
}

// Armado de tarjeta de noticias //
const ldArmarTarjetas = (documentos) => {
    if (documentos.docs.length > 0) {
        ultimoDocumento = documentos.docs[documentos.docs.length - 1];
        primerDocumento = documentos.docs[0];
        contenedorNoticias.innerHTML = '';

        documentos.forEach(doc => {
            contenedorNoticias.innerHTML += `
            <div class="card-body">
                <h4 class="card-title" style="margin-bottom:0.25rem;">${doc.data().Titulo}</h4>
                <p class="card-text" style="font-size:0.8rem; margin-bottom:1rem;">Fecha de publicación: <span class="noticia-fecha-publicacion">${doc.data().Fecha_publicacion.toDate().toLocaleDateString("es-MX")}</span></p>
                <p class="card-text" style="font-size:0.9rem;">${doc.data().Descripcion}</p>
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
})

// Regresa al grid con las noticias //
const regresarGrid = () => {
    document.getElementById('ld_principal').classList.remove('hide');
    document.getElementById('seccion_ld_formulario').classList.add('hide');
}

// Limpieza de formulario de noticias //
const limpiarFormulario = () => {
    document.getElementById("input_nombreTemporada").value = '';
    document.getElementById("input_fechaInauguracion").value = '';
    document.getElementById("input_periodo").value = '';
    $('#summernote').summernote('reset');
};