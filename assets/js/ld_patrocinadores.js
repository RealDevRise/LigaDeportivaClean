import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "./firebaseCore.js";
const contenedorNoticias = document.getElementById("div-noticias");
const formularioNoticia = document.getElementById("formularioNoticias");
const btnNuevaNoticia = document.getElementById("btn_nuevaNoticia");
const btnFormularioRegresar = document.getElementById("btnFormulario_regresar");
const btnSiguiente = document.getElementById("btn_siguiente");
const btnAtras = document.getElementById("btn_previo");
const btnModalEliminar = document.getElementById("btnModal_eliminar");
const wrapperNoticias = document.getElementById("div-noticias");
const fileUploaded = document.getElementById("imageUploader");
const galeriaImagenesSubidas = document.getElementById("galeriaImagen_subidas");
const limite = 5;
let ultimoDocumento = null;
let primerDocumento = null;
let uidUser = "";
let idNoticia_Temporal = "";

onAuthStateChanged(auth, (user) => {
    if (user) {
        const name_dropdown = document.getElementById("menu-dropdown");
        name_dropdown.innerHTML = user.displayName;
        name_dropdown.setAttribute("usrid", user.uid);
        obtenerNoticias(user.uid);
        uidUser = user.uid;
    } else {
        window.location.replace('/Login.html');
    }
});

// Obtener Todas Las Noticias del Usuario Logeado //
const obtenerNoticias = async(usrId) => {
    const consulta = query(collection(db, "Patrocinadores"),
        orderBy("Fecha_registro", "desc"),
        limit(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    cargarNoticias(documentSnapshots);

}

// Obtener una noticia a editar //
const obtenerNoticia = async(id) => {
    const docRef = doc(db, "Patrocinadores", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        idNoticia_Temporal = docSnap.id;
        const listRef = ref(storage, `Patrocinadores/${id}`);
        // Enlista todas las imagenes que contiene la noticia (si lo hay) //
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

        document.getElementById("input_nombre").value = docSnap.data().Nombre;
        document.getElementById("input_url").value = docSnap.data().Sitio_web;

        document.getElementById('principal-noticias').classList.add('hide');
        document.getElementById('formulario-noticia').classList.remove('hide');
        document.getElementById('titulo-formulario').innerHTML = 'Actualizar Noticia';
        document.getElementById('btn_submit').innerHTML = 'Actualizar';
        document.getElementById('btn_submit').setAttribute("value", "actualizar");


    } else {
        console.log("Error al obtener documento!");
        return null;
    }
}

const armarImagenes = (url, imgName) => {
    galeriaImagenesSubidas.classList.remove('hidden');


    galeriaImagenesSubidas.innerHTML += `
    <figure class="figureUploaded">
        <button type="button" class="deleteImg" data-img="${imgName}">
            &times
        </button>
        <img src="${url}" >
        <figcaption style="font-size:12px;">${imgName}</figcaption>
    </figure>
    
    `;
}

// Guardar Noticia a FireStore //
const guardarNoticia = async(datosNoticia) => {
    try {
        // Se sube la noticia a la base de datos //
        const docRef = await addDoc(collection(db, "Patrocinadores"), {
            Nombre: datosNoticia.titulo,
            Sitio_web: datosNoticia.sitio_web,
            Logotipo: "",
            Autor: uidUser,
            Fecha_registro: Timestamp.now()
        });

        // Subir imagenes a storage despues del registro //
        const idPatrocinador = docRef.id;
        for (let i = 0; i < fileUploaded.files.length; i++) {
            let imageFile = fileUploaded.files[i];
            let storageRef = ref(storage, `Patrocinadores/${docRef.id}/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    const fileRef = doc(db, "Patrocinadores", idPatrocinador);
                    updateDoc(fileRef, {
                        Logotipo: downloadURL
                    });
                });
            });
        }

        // Regresar a las noticias //
        obtenerNoticias(uidUser);
        regresarGridNoticias();

    } catch (e) {
        console.error("Error al registrar patrocinador: ", e);
    }
}

// Actualizar noticia //
const actualizarNoticia = async(datosNoticia) => {
    const docRef = doc(db, "Patrocinadores", idNoticia_Temporal);


    await updateDoc(docRef, {
        Nombre: datosNoticia.titulo,
        Sitio_web: datosNoticia.sitio_web,
    });

    for (let i = 0; i < fileUploaded.files.length; i++) {
        let imageFile = fileUploaded.files[i];
        let storageRef = ref(storage, `Patrocinadores/${idNoticia_Temporal}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile).then((snapshot) => {

        });
    }

    obtenerNoticias(uidUser);
    regresarGridNoticias();
}

// Eliminar noticia //
const eliminarNoticia = async(id) => {
    const listRef = ref(storage, `Patrocinadores/${id}`);
    await deleteDoc(doc(db, "Patrocinadores", id));

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
    obtenerNoticias(uidUser);
}

// Paginacion a la siguiente pagina Noticias //
const siguienteNoticias = async(usrId) => {
    const consulta = query(collection(db, "Patrocinadores"),
        orderBy("Fecha_registro", "desc"),
        limit(limite),
        startAfter(ultimoDocumento)
    );
    const documentSnapshots = await getDocs(consulta);
    cargarNoticias(documentSnapshots);
}

// Paginacion a la previa pagina Noticias //
const noticiaAnterior = async(usrId) => {
    const consulta = query(collection(db, "Patrocinadores"),
        orderBy("Fecha_registro", "desc"),
        endBefore(primerDocumento),
        limitToLast(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    cargarNoticias(documentSnapshots);
}

// Armado de tarjeta de noticias //
const cargarNoticias = (documentos) => {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    if (documentos.docs.length > 0) {
        ultimoDocumento = documentos.docs[documentos.docs.length - 1];
        primerDocumento = documentos.docs[0];
        contenedorNoticias.innerHTML = '';

        documentos.forEach(doc => {
            contenedorNoticias.innerHTML += `
            <div class="card-body">
                <h4 class="card-title" style="margin-bottom:0.25rem;">${doc.data().Nombre}</h4>
                <p class="card-text" style="font-size:0.8rem; margin-bottom:1rem;">Fecha de registro: <span class="noticia-fecha-publicacion">${doc.data().Fecha_registro.toDate().toLocaleDateString("es-MX")}</span></p>
                <button id="${doc.id}" data-idNoticia="${doc.id}" class="btn btnDashboard btnDashboard-primary">Editar</button>
                <button class="btn btnDashboard btn-danger" onclick="confirmarEliminacion('${doc.id}')">Eliminar</button>
            </div>
            `;
        });




    }
}

btnSiguiente.addEventListener("click", () => {
    siguienteNoticias(uidUser);
});

btnAtras.addEventListener("click", () => {
    noticiaAnterior(uidUser);
});

// Función para registrar/actualizar noticia //
formularioNoticia.addEventListener("submit", (e) => {
    e.preventDefault();
    const modoRegistro = document.getElementById('btn_submit').value;
    const tituloPatrocinador = document.getElementById("input_nombre").value;
    const sitioWeb = document.getElementById("input_url").value;

    const jsonNoticia = {
        titulo: tituloPatrocinador,
        sitio_web: sitioWeb
    };

    if (modoRegistro === "nuevo") {
        // Registro de nueva noticia //
        guardarNoticia(jsonNoticia);
    } else if (modoRegistro === "actualizar") {
        // Actualizacion de noticia //
        actualizarNoticia(jsonNoticia);
    }
});

// Función Nueva Noticia //
btnNuevaNoticia.addEventListener("click", (e) => {
    limpiarFormularioNoticias();
    document.getElementById('principal-noticias').classList.add('hide');
    document.getElementById('formulario-noticia').classList.remove('hide');
    document.getElementById('titulo-formulario').innerHTML = 'Nuevo patrocinador';
    document.getElementById('btn_submit').innerHTML = 'Guardar';
    document.getElementById('btn_submit').setAttribute("value", "nuevo");
    galeriaImagenesSubidas.innerHTML = '';
    galeriaImagenesSubidas.classList.add('hidden');
});

// Función para editar noticia //
wrapperNoticias.addEventListener("click", (event) => {
    const isButton = event.target.nodeName === "BUTTON";
    if (!isButton) {
        return;
    }
    if (event.target.id !== "") {
        galeriaImagenesSubidas.innerHTML = '';
        document.getElementById("galeriaImagen").innerHTML = '';
        document.getElementById("imageUploader").value = null;
        obtenerNoticia(event.target.id);
    }

});

// Botón para eliminar imagenes en la edición del folio //
galeriaImagenesSubidas.addEventListener("click", (event) => {
    const isButton = event.target.nodeName === "BUTTON";
    if (!isButton) {
        return;
    }

    if (event.target.getAttribute("data-img") != "") {
        eliminarImagen(event.target.getAttribute("data-img"), event);
    }
});


const eliminarImagen = (imgName, e) => {
    console.log(idNoticia_Temporal);
    const imgRef = ref(storage, `Patrocinadores/${idNoticia_Temporal}/${imgName}`);

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
    regresarGridNoticias();
})

// Regresa al grid con las noticias //
const regresarGridNoticias = () => {
    document.getElementById('principal-noticias').classList.remove('hide');
    document.getElementById('formulario-noticia').classList.add('hide');
}

// Limpieza de formulario de noticias //
const limpiarFormularioNoticias = () => {
    formularioNoticia.reset();
    $('#summernote').summernote('reset');
};

// Eliminar Documento //
btnModalEliminar.addEventListener("click", (e) => {
    eliminarNoticia(e.target.value);

});