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
const modalidadMultiplicador = document.getElementById("input_multiplicadorModalidad");

const limite = 5;
let ultimoDocumento = null;
let primerDocumento = null;
let uidUser = "";
let id_Temporal = "";

onAuthStateChanged(auth, async(user) => {
    if (user) {
        const name_dropdown = document.getElementById("menu-dropdown");
        name_dropdown.innerHTML = user.displayName;
        name_dropdown.setAttribute("usrid", user.uid);
        await cargarDatosFormulario();
        ldObtener(user.uid);
        uidUser = user.uid;
    } else {
        window.location.replace('/Login.html');
    }
});



// CREAR TEMPORADA //
// Guardar a FireStore //
const ld_crear = async(datos) => {
        try {
            const docRef = await addDoc(collection(db, "Categorias"), {
                Descripcion: datos.descripcion,
                Descripcion_corta: datos.descripcionCorta,
                Director_categoria: datos.directorCategoria,
                Status: datos.estatus,
                Estatutos: datos.estatutos,
                Rango_edad_min: datos.rango_edad_min,
                Rango_edad_max: datos.rango_edad_max,
                Multiplicador: datos.multiplicador,
                Autor: uidUser,
                Fecha_publicacion: Timestamp.now()
            });

            // Regresar a las noticias //
            ldObtener(uidUser);
            regresarGrid();

        } catch (e) {
            console.error("Error al registrar categoría: ", e);
        }
    }
    // Función nueva temporada //
btnNuevo.addEventListener("click", (e) => {
    limpiarFormulario();
    document.getElementById('ld_principal').classList.add('hide');
    document.getElementById('seccion_ld_formulario').classList.remove('hide');
    document.getElementById('titulo-formulario').innerHTML = 'Nueva Categoría';
    document.getElementById('btn_submit').innerHTML = 'Guardar';
    document.getElementById('btn_submit').setAttribute("value", "nuevo");

});

// Función para registrar/actualizar noticia //
ldFormulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const modoRegistro = document.getElementById('btn_submit').value;

    const descripcion = document.getElementById("input_descripcion").value;
    const descripcionCorta = document.getElementById("input_descripcionCorta").value;
    const estatus = document.getElementById("select_status").value;
    const directorCategoria = document.getElementById('select_directorCategoria').value;
    const estatutos = $('#summernote').summernote('code');
    const rangoEdadMin = document.getElementById("rango_edad_min").value;
    const rangoEdadMax = document.getElementById("rango_edad_max").value;
    let datoMultiplicador = 1;
    if (modalidadMultiplicador.value != '')
        datoMultiplicador = modalidadMultiplicador.value;

    const jsonData = {
        descripcion: descripcion,
        descripcionCorta: descripcionCorta,
        directorCategoria: directorCategoria,
        estatus: estatus,
        estatutos: estatutos,
        rango_edad_min: rangoEdadMin,
        rango_edad_max: rangoEdadMax,
        multiplicador: datoMultiplicador
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
    const consulta = query(collection(db, "Categorias"),
        orderBy("Fecha_publicacion", "desc"),
        limit(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);

}

const ldLeer = async(id) => {
    const docRef = doc(db, "Categorias", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        id_Temporal = docSnap.id;
        document.getElementById("input_descripcion").value = docSnap.data().Descripcion;
        document.getElementById("input_descripcionCorta").value = docSnap.data().Descripcion_corta;
        document.getElementById("rango_edad_max").value = docSnap.data().Rango_edad_max;
        document.getElementById("rango_edad_min").value = docSnap.data().Rango_edad_min;
        document.getElementById("select_status").value = docSnap.data().Status;
        document.getElementById('select_directorCategoria').value = docSnap.data().Director_categoria;
        modalidadMultiplicador.value = docSnap.data().Multiplicador;
        $("#summernote").summernote("code", docSnap.data().Estatutos);

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
    const docRef = doc(db, "Categorias", id_Temporal);

    await updateDoc(docRef, {
        Descripcion: datos.descripcion,
        Descripcion_corta: datos.descripcionCorta,
        Director_categoria: datos.directorCategoria,
        Status: datos.estatus,
        Estatutos: datos.estatutos,
        Rango_edad_min: datos.rango_edad_min,
        Rango_edad_max: datos.rango_edad_max,
        Multiplicador: datos.multiplicador
    });

    ldObtener(uidUser);
    regresarGrid();
}

// ELIMINAR TEMPORADA //
btnModalEliminar.addEventListener("click", (e) => {
    ldEliminar(e.target.value);
});

const ldEliminar = async(id) => {
    await deleteDoc(doc(db, "Categorias", id));
    $('#modal-eliminar').modal('hide');
    ldObtener(uidUser);
}

// Paginacion a la siguiente pagina Noticias //
const paginaSiguiente = async(usrId) => {
    const consulta = query(collection(db, "Categorias"),
        orderBy("Fecha_publicacion", "desc"),
        limit(limite),
        startAfter(ultimoDocumento)
    );
    const documentSnapshots = await getDocs(consulta);
    ldArmarTarjetas(documentSnapshots);
}

// Paginacion a la previa pagina Noticias //
const paginaAnterior = async(usrId) => {
    const consulta = query(collection(db, "Categorias"),
        orderBy("Fecha_publicacion", "desc"),
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
            let statusClass = doc.data().Status == "1" ? "bg-success" : "bg-danger";
            let statusCategoria = doc.data().Status == "1" ? "Activo" : "No activo";
            contenedorNoticias.innerHTML += `
            <div class="card-body">
                <h4 class="card-title" style="display:flex; align-items:center; margin-bottom:0.25rem;"><span class="badge ${statusClass}" style="font-size:1rem; margin-right:5px;">${statusCategoria}</span> ${doc.data().Descripcion}</h4>
                <p class="card-text" style="font-size:0.8rem; margin-bottom:1rem;">Fecha de publicación: <span class="noticia-fecha-publicacion">${doc.data().Fecha_publicacion.toDate().toLocaleDateString("es-MX")}</span></p>
                <p class="card-text" style="font-size:0.9rem;">${doc.data().Descripcion_corta}</p>
                <button id="${doc.id}" data-idObject="${doc.id}" class="btn btnDashboard btnDashboard-primary">Editar</button>
                <button class="btn btnDashboard btn-danger" onclick="confirmarEliminacion('${doc.id}')">Eliminar</button>
            </div>
            `;
        });




    }
}

const cargarDatosFormulario = async() => {
    let selectDirector = document.getElementById("select_directorCategoria");
    const consulta = query(collection(db, "Personas"),
        where("Tipo_persona", "==", "directivo"),
        orderBy("Nombre_completo", "asc")
    );

    const documentSnapshots = await getDocs(consulta);

    if (documentSnapshots.docs.length > 0) {

        documentSnapshots.forEach(doc => {

            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Nombre_completo;
            selectDirector.appendChild(opcion);

        });

    }
};

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

// Limpieza de formulario de noticias //
const limpiarFormulario = () => {
    // document.getElementById("input_descripcion").value = '';
    // document.getElementById("input_descripcionCorta").value = '';
    // document.getElementById("input_rangoEdad").value = '';
    // document.getElementById("select_status").selectedIndex = '0';
    // document.getElementById("select_directorCategoria").selectedIndex = '0';
    ldFormulario.reset();
    $('#summernote').summernote('reset');
};