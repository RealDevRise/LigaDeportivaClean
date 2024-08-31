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
let nameUser = "";
let idNoticia_Temporal = "";
let imagenes_subidas = [];
let imagenerPorEliminar = [];

onAuthStateChanged(auth, (user) => {
    if (user) {
        const name_dropdown = document.getElementById("menu-dropdown");
        name_dropdown.innerHTML = user.displayName;
        name_dropdown.setAttribute("usrid", user.uid);
        obtenerNoticias(user.uid);
        uidUser = user.uid;
        nameUser = user.displayName;
    } else {
        window.location.replace('/Login.html');
    }
});

// Obtener Todas Las Noticias del Usuario Logeado //
const obtenerNoticias = async(usrId) => {
    const consulta = query(collection(db, "Noticias"),
        where("Autor", "==", usrId),
        orderBy("Fecha_publicacion", "desc"),
        limit(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    cargarNoticias(documentSnapshots);

}

// Obtener una noticia a editar //
const obtenerNoticia = async(idNoticia) => {
    const docRef = doc(db, "Noticias", idNoticia);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        idNoticia_Temporal = docSnap.id;
        const listRef = ref(storage, `Noticias/${idNoticia}`);
        // Enlista todas las imagenes que contiene la noticia (si lo hay) //
        listAll(listRef)
            .then((res) => {
                res.items.forEach((itemRef) => {
                    // Se obtiene las urls de las imagenes de la noticia a editar //                    
                    getDownloadURL(ref(storage, itemRef.fullPath)).then((url) => {
                        armarImagenes(url, itemRef.name, docSnap.data().Imagen_cabecera);
                    });
                });
            }).catch((error) => {
                // Uh-oh, an error occurred!
                console.log(error);
            });

        document.getElementById("input_TituloNoticia").value = docSnap.data().Titulo;
        document.getElementById("input_DescripcionCorta").value = docSnap.data().Descripcion_breve;
        document.getElementById("input_noticia_header").checked = docSnap.data().Header;
        $("#summernote").summernote("code", docSnap.data().Contenido);

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





// Guardar Noticia a FireStore //
const guardarNoticia = async(datosNoticia) => {
    try {
        // Se sube la noticia a la base de datos //
        const docRef = await addDoc(collection(db, "Noticias"), {
            Titulo: datosNoticia.titulo,
            Descripcion_breve: datosNoticia.subtitulo,
            Header: datosNoticia.header,
            Contenido: datosNoticia.contenido,
            Autor: uidUser,
            Nombre_autor: nameUser,
            Imagen_cabecera: "",
            Fecha_publicacion: Timestamp.now()
        });

        // Subir imagenes a storage despues de registrar la noticia //
        let nombreImagenCabecera = "";
        // console.log(nombreImagenCabecera);

        if (imagenes_subidas.length > 0) {
            let aa = document.querySelectorAll("[data-cabecera]")[0];
            if (aa == undefined) {
                nombreImagenCabecera = document.getElementById("galeriaImagen").getElementsByTagName("figure")[0].getElementsByTagName("figcaption")[0].innerHTML;
            } else {
                nombreImagenCabecera = document.querySelectorAll("[data-cabecera]")[0].getElementsByTagName("figcaption")[0].innerHTML;
            }
        }

        console.log(nombreImagenCabecera);

        for (let i = 0; i < imagenes_subidas.length; i++) {
            let imageFile = imagenes_subidas[i];
            let idDocumento = docRef.id;
            let storageRef = ref(storage, `Noticias/${docRef.id}/${imageFile.name}`);


            await uploadBytes(storageRef, imageFile).then((snapshot) => {
                if (imageFile.name == nombreImagenCabecera) {
                    getDownloadURL(snapshot.ref).then((downloadURL) => {
                        const docRef = doc(db, "Noticias", idDocumento);
                        updateDoc(docRef, {
                            Imagen_cabecera: downloadURL
                        });
                    });
                }
            });
        }

        // Regresar a las noticias //
        obtenerNoticias(uidUser);
        regresarGridNoticias();

    } catch (e) {
        console.error("Error al registrar noticia: ", e);
    }
}

const eliminarImagen = async(imgName) => {
    console.log(idNoticia_Temporal);
    const imgRef = ref(storage, `Noticias/${idNoticia_Temporal}/${imgName}`);

    // Eliminar Imagen //
    deleteObject(imgRef).then(() => {
        // Imagen eliminado //
        // e.target.closest("figure.figureUploaded").remove();
        console.log("Se eliminó la imagen: " + imgName);
    }).catch((error) => {
        // Error al eliminar imagen //
        console.log("Error al eliminar imagen: ", error);
    });
}

// Actualizar noticia //
const actualizarNoticia = async(datosNoticia) => {
    const docRef = doc(db, "Noticias", idNoticia_Temporal);
    let urlImagenSubida = "";
    let nombreGaleria = document.querySelectorAll("[data-cabecera]")[0].parentElement.getAttribute("id");

    for (let i = 0; i < imagenerPorEliminar.length; i++) {
        await eliminarImagen(imagenerPorEliminar[i]);
    }

    await updateDoc(docRef, {
        Titulo: datosNoticia.titulo,
        Descripcion_breve: datosNoticia.subtitulo,
        Header: datosNoticia.header,
        Contenido: datosNoticia.contenido
    });

    if (nombreGaleria == "galeriaImagen_subidas") {
        urlImagenSubida = document.querySelectorAll("[data-cabecera]")[0].getElementsByTagName("img")[0].getAttribute("src");
        await updateDoc(docRef, { Imagen_cabecera: urlImagenSubida });
    }

    console.log(imagenerPorEliminar.length);

    for (let i = 0; i < imagenes_subidas.length; i++) {
        let imageFile = imagenes_subidas[i];
        let storageRef = ref(storage, `Noticias/${idNoticia_Temporal}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile).then((snapshot) => {
            if (nombreGaleria == "galeriaImagen") {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    updateDoc(docRef, {
                        Imagen_cabecera: downloadURL
                    });
                });
            }
        });
    }



    // for (let i = 0; i < fileUploaded.files.length; i++) {
    //     let imageFile = fileUploaded.files[i];
    //     let storageRef = ref(storage, `Noticias/${idNoticia_Temporal}/${imageFile.name}`);
    //     await uploadBytes(storageRef, imageFile).then((snapshot) => {

    //     });
    // }

    obtenerNoticias(uidUser);
    regresarGridNoticias();
}

// Eliminar noticia //
const eliminarNoticia = async(id) => {
    const listRef = ref(storage, `Noticias/${id}`);
    await deleteDoc(doc(db, "Noticias", id));

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
    const consulta = query(collection(db, "Noticias"),
        where("Autor", "==", usrId),
        orderBy("Fecha_publicacion", "desc"),
        limit(limite),
        startAfter(ultimoDocumento)
    );
    const documentSnapshots = await getDocs(consulta);
    cargarNoticias(documentSnapshots);
}

// Paginacion a la previa pagina Noticias //
const noticiaAnterior = async(usrId) => {
    const consulta = query(collection(db, "Noticias"),
        where("Autor", "==", usrId),
        orderBy("Fecha_publicacion", "desc"),
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
                <h4 class="card-title" style="margin-bottom:0.25rem;">${doc.data().Titulo}</h4>
                <p class="card-text" style="font-size:0.8rem; margin-bottom:1rem;">Fecha de publicación: <span class="noticia-fecha-publicacion">${doc.data().Fecha_publicacion.toDate().toLocaleDateString("es-MX")}</span></p>
                <p class="card-text" style="font-size:0.9rem;">${doc.data().Descripcion_breve}</p>
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
    const tituloNoticia = document.getElementById("input_TituloNoticia").value;
    const subtituloNoticia = document.getElementById("input_DescripcionCorta").value;
    const noticia_cabecera = document.getElementById("input_noticia_header").checked;
    const contenidoNoticia = $('#summernote').summernote('code');
    const jsonNoticia = {
        titulo: tituloNoticia,
        subtitulo: subtituloNoticia,
        contenido: contenidoNoticia,
        header: noticia_cabecera
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
    document.getElementById('titulo-formulario').innerHTML = 'Nueva Noticia';
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
    let nombreNodo = event.target.nodeName;

    if (nombreNodo === "BUTTON") {
        // Eliminar Imagen
        imagenerPorEliminar.push(event.target.parentElement.getElementsByTagName("figcaption")[0].innerHTML);
        event.target.parentElement.remove();
    } else if (nombreNodo === "IMG") {
        // Seleccionar Cabecera
        let nodeGaleria = galeriaImagenesSubidas.childNodes;
        let nodeGaleriaImgSubidas = document.getElementById("galeriaImagen").childNodes;

        for (let i = 0; i < nodeGaleriaImgSubidas.length; i++) {
            nodeGaleriaImgSubidas[i].removeAttribute("data-cabecera");
            nodeGaleriaImgSubidas[i].getElementsByTagName("img")[0].classList.remove("cabecera-seleccionado");
        }

        for (let i = 0; i < nodeGaleria.length; i++) {
            nodeGaleria[i].removeAttribute("data-cabecera");
            nodeGaleria[i].getElementsByTagName("img")[0].classList.remove("cabecera-seleccionado");
        }

        event.target.parentElement.setAttribute("data-cabecera", "true");
        event.target.classList.add("cabecera-seleccionado");

    }

    // const isButton = event.target.nodeName === "BUTTON";
    // if (!isButton) {
    //     console.log(event.target.nodeName);
    //     return;
    // }

    // if (event.target.getAttribute("data-img") != "") {
    //     // eliminarImagen(event.target.getAttribute("data-img"), event);
    //     imagenerPorEliminar.push(event.target.getAttribute("data-img"));
    //     console.log(imagenerPorEliminar);
    // }
});

document.getElementById("galeriaImagen").addEventListener("click", (event) => {
    let nombreNodo = event.target.nodeName;


    if (nombreNodo === "BUTTON") {
        // Eliminar Imagen del array //
        let nombreArchivo = event.target.parentElement.getElementsByTagName("figcaption")[0].innerHTML;

        let indexImagen = imagenes_subidas.findIndex(x => x.name === nombreArchivo);
        if (indexImagen > -1) {
            imagenes_subidas.splice(indexImagen, 1);
            event.target.parentElement.remove();
        }

    } else if (nombreNodo === "IMG") {
        // Aplicar seleccion de cabecera //
        let nodeGaleria = document.getElementById("galeriaImagen").childNodes;
        let nodeGaleriaImgSubidas = galeriaImagenesSubidas.childNodes;

        for (let i = 0; i < nodeGaleriaImgSubidas.length; i++) {
            nodeGaleriaImgSubidas[i].removeAttribute("data-cabecera");
            nodeGaleriaImgSubidas[i].getElementsByTagName("img")[0].classList.remove("cabecera-seleccionado");
        }

        for (let i = 0; i < nodeGaleria.length; i++) {
            nodeGaleria[i].removeAttribute("data-cabecera");
            nodeGaleria[i].getElementsByTagName("img")[0].classList.remove("cabecera-seleccionado");
        }
        event.target.parentElement.setAttribute("data-cabecera", "true");
        event.target.classList.add("cabecera-seleccionado");
    }
});

const armarImagenes = (url, imgName, imgCabecera) => {
    galeriaImagenesSubidas.classList.remove('hidden');

    let figure = document.createElement("figure");
    let btnEliminar = document.createElement("button");
    let figCap = document.createElement("figcaption");
    let img = document.createElement("img");

    figure.setAttribute("class", "figureUploaded");
    if (url == imgCabecera)
        figure.setAttribute("data-cabecera", "true");

    btnEliminar.setAttribute("class", "deleteImg");
    btnEliminar.setAttribute("type", "button");
    btnEliminar.innerHTML = "&times";

    img.setAttribute("style", "font-size:12px;");
    img.setAttribute("src", url);
    if (url == imgCabecera)
        img.setAttribute("class", "cabecera-seleccionado");

    figCap.innerText = imgName;

    figure.appendChild(btnEliminar);
    figure.appendChild(img);
    figure.appendChild(figCap);

    galeriaImagenesSubidas.appendChild(figure);
}

fileUploaded.addEventListener('change', () => {
    // let fileInput = document.getElementById("imageUploader");
    let imageContainer = document.getElementById("galeriaImagen");

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








btnFormularioRegresar.addEventListener("click", () => {
    regresarGridNoticias();
})

// Regresa al grid con las noticias //
const regresarGridNoticias = () => {
    imagenes_subidas = [];
    imagenerPorEliminar = [];
    document.getElementById('principal-noticias').classList.remove('hide');
    document.getElementById('formulario-noticia').classList.add('hide');
}

// Limpieza de formulario de noticias //
const limpiarFormularioNoticias = () => {
    document.getElementById("galeriaImagen").innerHTML = '';
    document.getElementById("imageUploader").value = null;
    document.getElementById("input_TituloNoticia").value = '';
    document.getElementById("input_DescripcionCorta").value = '';
    document.getElementById("input_noticia_header").checked = false;
    $('#summernote').summernote('reset');
};

// Eliminar Documento //
btnModalEliminar.addEventListener("click", (e) => {
    eliminarNoticia(e.target.value);
});