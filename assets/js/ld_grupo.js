import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "./firebaseCore.js";
import { ActualizarGrupo, ActualizarGrupo_ClientStanding } from "./core/standings.js";

const contenedorNoticias = document.getElementById("div-noticias");
const formulario = document.getElementById("formularioNoticias");
const btnNuevaNoticia = document.getElementById("btn_nuevo");
const btnFormularioRegresar = document.getElementById("btnFormulario_regresar");
const btnSiguiente = document.getElementById("btn_siguiente");
const btnAtras = document.getElementById("btn_previo");
const btnModalEliminar = document.getElementById("btnModal_eliminar");
const wrapperNoticias = document.getElementById("div-noticias");
const fileUploaded = document.getElementById("imageUploader");
const galeriaImagenesSubidas = document.getElementById("galeriaImagen_subidas");
const btn_agregarEquipos = document.getElementById("btnAgregarEquipos");
const select_temporada = document.getElementById("selectTemporada");
const select_categoria = document.getElementById("selectCategoria");
const select_equipos = document.getElementById("selectGrupoEquipos");
const btn_agregarGrupoEquipo = document.getElementById("btn_agregar_grupoEquipo");
const cuerpoTablaGrupoEquipos = document.getElementById("cuerpoTablaGrupoEquipos");
const tablaGrupoEquipos = document.getElementById("tablaGrupoEquipos");
let equipos_seleccionados = [];
const limite = 5;
let ultimoDocumento = null;
let primerDocumento = null;
let uidUser = "";
let idNoticia_Temporal = "";

select_temporada.addEventListener("change", (e) => {
    limpiar_datos_GrupoEquipos();
    if (select_temporada.value != "" && select_categoria.value != "")
        btn_agregarEquipos.disabled = false;
    else
        btn_agregarEquipos.disabled = true;
});

select_categoria.addEventListener("change", (e) => {
    limpiar_datos_GrupoEquipos();
    if (select_temporada.value != "" && select_categoria.value != "")
        btn_agregarEquipos.disabled = false;
    else
        btn_agregarEquipos.disabled = true;
});

const limpiar_datos_GrupoEquipos = () => {
    cuerpoTablaGrupoEquipos.innerHTML = "";
    equipos_seleccionados = [];
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const name_dropdown = document.getElementById("menu-dropdown");
        name_dropdown.innerHTML = user.displayName;
        name_dropdown.setAttribute("usrid", user.uid);
        obtenerGrupos(user.uid);
        obtenerDataFormulario();
        uidUser = user.uid;
    } else {
        window.location.replace('/Login.html');
    }
});

// Obtener Todas Las Noticias del Usuario Logeado //
const obtenerGrupos = async(usrId) => {
    const consulta = query(collection(db, "Grupos"),
        where("Autor", "==", usrId),
        orderBy("Fecha_registro", "desc"),
        limit(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    cargarGrupos(documentSnapshots);

}

// Obtener una noticia a editar //
const obtenerRegistro = async(idRegistro) => {
    const docRef = doc(db, "Grupos", idRegistro);
    const docSnap = await getDoc(docRef);


    if (docSnap.exists()) {
        cuerpoTablaGrupoEquipos.innerHTML = "";
        equipos_seleccionados = [];
        idNoticia_Temporal = docSnap.id;
        btn_agregarEquipos.disabled = false;

        document.getElementById("input_nombre").value = docSnap.data().Nombre;
        document.getElementById("input_descripcion").value = docSnap.data().Descripcion;
        document.getElementById("selectTemporada").value = docSnap.data().Temporada;
        document.getElementById("selectCategoria").value = docSnap.data().Categoria;
        $("#summernote").summernote("code", docSnap.data().Notas);

        // cargar equipos al grid //
        docSnap.data().Equipos.forEach((equipo) => {
            equipos_seleccionados.push(equipo);
            armarTablaGrupoEquipo(equipo);
        });


        document.getElementById('principal-noticias').classList.add('hide');
        document.getElementById('formulario-noticia').classList.remove('hide');
        document.getElementById('titulo-formulario').innerHTML = 'Actualizar Grupo';
        document.getElementById('btn_submit').innerHTML = 'Actualizar';
        document.getElementById('btn_submit').setAttribute("value", "actualizar");


    } else {
        console.log("Error al obtener documento!");
        return null;
    }
}

const armarTablaGrupoEquipo = async(idEquipo) => {
    const docRef = doc(db, "Equipos", idEquipo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // Agrega los equipos a la tabla de Grupo Equipos //
        cuerpoTablaGrupoEquipos.innerHTML += `
        <tr>
            <td>${docSnap.data().Nombre_completo}</td>
            <td>
                <button type="button" data-id='${idEquipo}' class="btn btnDashboard btnDashboard-transparent"><i class="fas fa-user-times" style="margin-right:4px;"></i>Remover</button>
            </td>
        </tr>
        `;
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
const guardarRegistro = async(datos) => {
    try {
        // Se sube la noticia a la base de datos //
        const docRef = await addDoc(collection(db, "Grupos"), {
            Nombre: datos.nombre_grupo,
            Descripcion: datos.descripcion_grupo,
            Temporada: datos.temporada_grupo,
            Categoria: datos.categoria_grupo,
            Equipos: datos.equipos_grupo,
            Notas: datos.notas,
            Autor: uidUser,
            Fecha_registro: Timestamp.now()
        });

        // Actualizar grupo en Standing //
        await Promise.all(datos.equipos_grupo.map(async(equipo) => {
            await ActualizarGrupo(equipo, datos.temporada_grupo, datos.categoria_grupo, docRef.id);
        }));

        // Actualizar grupo en Client Standing //
        await Promise.all(datos.equipos_grupo.map(async(equipo) => {
            await ActualizarGrupo_ClientStanding(equipo, datos.temporada_grupo, datos.categoria_grupo, docRef.id);
        }));



        // Regresar a las noticias //
        obtenerGrupos(uidUser);
        regresarGrid();

    } catch (e) {
        console.error("Error al registrar: ", e);
    }
}

// Actualizar Registro //
const actualizarRegistro = async(datos) => {
    const docRef = doc(db, "Grupos", idNoticia_Temporal);


    await updateDoc(docRef, {
        Nombre: datos.nombre_grupo,
        Descripcion: datos.descripcion_grupo,
        Temporada: datos.temporada_grupo,
        Categoria: datos.categoria_grupo,
        Equipos: datos.equipos_grupo,
        Notas: datos.notas,
    });

    // Actualizar grupo en Standing //
    await Promise.all(datos.equipos_grupo.map(async(equipo) => {
        await ActualizarGrupo(equipo, datos.temporada_grupo, datos.categoria_grupo, idNoticia_Temporal);
    }));

    // Actualizar grupo en Client Standing //
    await Promise.all(datos.equipos_grupo.map(async(equipo) => {
        await ActualizarGrupo_ClientStanding(equipo, datos.temporada_grupo, datos.categoria_grupo, idNoticia_Temporal);
    }));

    obtenerGrupos(uidUser);
    regresarGrid();
}

// Eliminar noticia //
const eliminarRegistro = async(id) => {
    let DataGrupo = await ObtenerEquiposGrupo(id);
    await deleteDoc(doc(db, "Grupos", id));

    if (DataGrupo != null) {
        // Actualizar grupo en Standing //
        console.log("Actualizando Standing");
        await Promise.all(DataGrupo.data().Equipos.map(async(equipo) => {
            await ActualizarGrupo(equipo, DataGrupo.data().Temporada, DataGrupo.data().Categoria, "");
        }));
        console.log("Actualizando Client Standing");
        // Actualizar grupo en Client Standing //
        await Promise.all(DataGrupo.data().Equipos.map(async(equipo) => {
            await ActualizarGrupo_ClientStanding(equipo, DataGrupo.data().Temporada, DataGrupo.data().Categoria, "");
        }));
    }

    $('#modal-eliminar').modal('hide');
    obtenerGrupos(uidUser);
}

const ObtenerEquiposGrupo = async(id) => {
    const docRef = doc(db, "Grupos", id);
    const docSnap = await getDoc(docRef);
    let Grupos_Equipos = [];

    if (docSnap.exists()) {
        return docSnap;
    } else
        return null;
}

// Paginacion a la siguiente pagina Noticias //
const siguienteNoticias = async(usrId) => {
    const consulta = query(collection(db, "Grupos"),
        where("Autor", "==", usrId),
        orderBy("Fecha_registro", "desc"),
        limit(limite),
        startAfter(ultimoDocumento)
    );
    const documentSnapshots = await getDocs(consulta);
    cargarNoticias(documentSnapshots);
}

// Paginacion a la previa pagina Noticias //
const noticiaAnterior = async(usrId) => {
    const consulta = query(collection(db, "Grupos"),
        where("Autor", "==", usrId),
        orderBy("Fecha_registro", "desc"),
        endBefore(primerDocumento),
        limitToLast(limite)
    );

    const documentSnapshots = await getDocs(consulta);
    cargarNoticias(documentSnapshots);
}

// Armado de tarjeta de noticias //
const cargarGrupos = (documentos) => {
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
                <p class="card-text" style="font-size:0.9rem;">${doc.data().Descripcion}</p>
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
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const modoRegistro = document.getElementById('btn_submit').value;

    const nombreGrupo = document.getElementById("input_nombre").value;
    const descripcion = document.getElementById("input_descripcion").value;
    const temporada = document.getElementById("selectTemporada").value;
    const categoria = document.getElementById("selectCategoria").value;

    const jsonNoticia = {
        nombre_grupo: nombreGrupo,
        descripcion_grupo: descripcion,
        temporada_grupo: temporada,
        categoria_grupo: categoria,
        equipos_grupo: equipos_seleccionados,
        notas: $('#summernote').summernote('code')
    };

    if (modoRegistro === "nuevo") {
        // Registro de nueva noticia //
        guardarRegistro(jsonNoticia);
    } else if (modoRegistro === "actualizar") {
        // Actualizacion de noticia //
        actualizarRegistro(jsonNoticia);
    }
});

// Función Nueva Noticia //
btnNuevaNoticia.addEventListener("click", (e) => {
    cuerpoTablaGrupoEquipos.innerHTML = "";
    limpiarFormularioNoticias();
    document.getElementById('principal-noticias').classList.add('hide');
    document.getElementById('formulario-noticia').classList.remove('hide');
    document.getElementById('titulo-formulario').innerHTML = 'Nuevo grupo';
    document.getElementById('btn_submit').innerHTML = 'Guardar';
    document.getElementById('btn_submit').setAttribute("value", "nuevo");
    // obtenerDataFormulario();
    btn_agregarEquipos.disabled = true;
    galeriaImagenesSubidas.innerHTML = '';
    galeriaImagenesSubidas.classList.add('hidden');
});

const obtenerDataFormulario = async() => {

    select_temporada.innerHTML = "";
    select_temporada.innerHTML = `<option value="" disabled selected>Seleccionar Temporada...</option>`;

    select_categoria.innerHTML = "";
    select_categoria.innerHTML = `<option value="" disabled selected>Seleccionar Categoría...</option>`;

    const consulta_temporadas = query(collection(db, "Temporadas"),
        orderBy("Titulo", "asc")
    );

    const consulta_categorias = query(collection(db, "Categorias"),
        orderBy("Descripcion", "asc")
    );

    const documentSnapshots_temporadas = await getDocs(consulta_temporadas);
    if (documentSnapshots_temporadas.docs.length > 0) {
        documentSnapshots_temporadas.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Titulo;
            select_temporada.appendChild(opcion);
        });
    }

    const documentSnapshots_categorias = await getDocs(consulta_categorias);
    if (documentSnapshots_categorias.docs.length > 0) {
        documentSnapshots_categorias.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Descripcion;
            select_categoria.appendChild(opcion);
        });
    }
}

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
        obtenerRegistro(event.target.id);
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
    regresarGrid();
})

// Regresa al grid con las noticias //
const regresarGrid = () => {
    document.getElementById('principal-noticias').classList.remove('hide');
    document.getElementById('formulario-noticia').classList.add('hide');
}

// Limpieza de formulario de noticias //
const limpiarFormularioNoticias = () => {
    formulario.reset();
    $('#summernote').summernote('reset');
    equipos_seleccionados = [];
};

// Eliminar Documento //
btnModalEliminar.addEventListener("click", (e) => {
    eliminarRegistro(e.target.value);

});

// Cargar equipos //
document.getElementById("btnAgregarEquipos").addEventListener("click", async(e) => {
    const modoRegistro = document.getElementById('btn_submit').value;
    const temporada = select_temporada.value;
    const categoria = select_categoria.value;
    select_equipos.innerHTML = "";
    select_equipos.innerHTML = `<option value="" disabled selected>Seleccionar Equipo...</option>`;

    const consulta = query(collection(db, "Equipos"),
        where("Temporada", "==", temporada),
        where("Categoria", "==", categoria),
        orderBy("Nombre_completo", "asc")
    );

    const documentSnapshots = await getDocs(consulta);

    if (documentSnapshots.docs.length > 0) {
        documentSnapshots.forEach(doc => {

            let indexEquipo = equipos_seleccionados.indexOf(doc.id);
            if (indexEquipo === -1) {
                let opcion = document.createElement("option");
                opcion.value = doc.id;
                opcion.innerHTML = doc.data().Nombre_completo;
                select_equipos.appendChild(opcion);
            }

        });
    }

});

btn_agregarGrupoEquipo.addEventListener("click", async() => {
    let nombreEquipo = select_equipos.options[select_equipos.selectedIndex].text;
    let idEquipo = select_equipos.value;

    if (idEquipo == "") {} else {
        select_equipos.remove(select_equipos.selectedIndex);
        equipos_seleccionados.push(idEquipo);


        select_equipos.selectedIndex = 0;

        // Actualizar la tabla
        cuerpoTablaGrupoEquipos.innerHTML += `
        <tr>
            <td>${nombreEquipo}</td>
            <td>
                <button type="button" data-id='${idEquipo}' class="btn btnDashboard btnDashboard-transparent"><i class="fas fa-user-times" style="margin-right:4px;"></i>Remover</button>
            </td>
        </tr>
        `;
    }



});

document.getElementById("btn_aceptar_grupoEquipos").addEventListener("click", () => {

})

document.getElementById("btn_cancelar_equipos").addEventListener("click", () => {
    // cuerpoTablaGrupoEquipos.innerHTML = "";
    // equipos_seleccionados = [];
});


tablaGrupoEquipos.addEventListener("click", async(e) => {
    const isButton = e.target.nodeName === "BUTTON";

    if (!isButton)
        return;
    else {
        const idEquipo = e.target.dataset.id;

        // Remover id del array de equipos seleccionados //
        let indexEquipo = equipos_seleccionados.indexOf(e.target.dataset.id);
        if (indexEquipo !== -1) {
            e.target.parentElement.parentElement.remove();
            equipos_seleccionados.splice(indexEquipo, 1);


            // Devolver equipo al componente de select
            const docRef = doc(db, "Equipos", idEquipo);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                let opcion = document.createElement("option");
                opcion.value = docSnap.id;
                opcion.innerHTML = docSnap.data().Nombre_completo;
                select_equipos.appendChild(opcion);
            } else {
                console.log("Error al obtener Equipo con id: " + idEquipo);
            }
        }

    }
});