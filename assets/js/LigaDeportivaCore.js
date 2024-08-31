import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "./firebaseCore.js";

const contenedorNoticias = document.getElementById("ld_contenedor_tabla");
const ldFormulario = document.getElementById("ld_formulario");
const ldContenedorTabla = document.getElementById("ld_contenedor_tabla");

// Botones del formulario //
const btnNuevo = document.getElementById("btn_nuevo");
const btnFormularioRegresar = document.getElementById("btnFormulario_regresar");

// Boton eliminar Modal //
const btnModalEliminar = document.getElementById("btnModal_eliminar");

// Botones de la paginación //
const paginacion_btnSiguiente = document.getElementById("btn_siguiente");
const paginacion_btnAtras = document.getElementById("btn_previo");

// FUNCIONES FIREBASE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// VALIDACION DE USUARIO //
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Insertar nombre del usuario en el dropdown 
        const dropdown_nombre = document.getElementById("menu-dropdown");
        dropdown_nombre.innerHTML = user.displayName;

        dropdown_nombre.setAttribute("usrid", user.uid);
        ldObtener(user.uid);
        uidUser = user.uid;
    } else {
        window.location.replace('/Login.html');
    }
});

// LECTURA FIREBASE //