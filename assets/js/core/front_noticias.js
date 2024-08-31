import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "../firebaseCore.js";

const btn_CargarNoticias = document.getElementById("btn_cargarNoticias");

let index_noticia = 0;
let primerDocumento = null;
let ultimoDocumento = null;
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

const contenedor_primera_noticia = document.getElementById("primera-noticia");
const contenedor_noticias = document.getElementById("contenedor-noticias");

const CargarNoticiasinicial = async () => {
    index_noticia = 0;

    const consulta = query(collection(db, "Noticias"),
        orderBy("Fecha_publicacion", "desc"),
        limit(7)
    );

    await getDocs(consulta).then((doc) => {

        if (doc.docs.length > 0) {

            ultimoDocumento = doc.docs[doc.docs.length - 1];
            primerDocumento = doc.docs[0];


            doc.docs.forEach(async (item) => {
                if (index_noticia == 0) {
                    contenedor_primera_noticia.innerHTML += `
                <img src="${item.data().Imagen_cabecera} " alt="${item.data().Titulo}">
                <div class="text--block">
                    <h1>${item.data().Titulo}</h1>
                    <p>${item.data().Descripcion_breve}</p>
                    <div><button onclick="irNoticia('${item.id}')" class="boton boton-primary" style="margin-top:15px; width:20%;">Ver Noticia</button></div>
                </div>
                
              `;
                    index_noticia++;
                } else {
                    contenedor_noticias.innerHTML += `
              <div class="tarjeta--noticia">
                    <a href="/noticias/${item.id}"><img src="${item.data().Imagen_cabecera}" alt="${item.data().Titulo}"></a>
                    <div class="noticia-text-block">
                        <p class="titulo--noticia">${item.data().Titulo}</p>
                        <p class="fecha--noticia">${item.data().Fecha_publicacion.toDate().toLocaleDateString("es-MX", options)}</p>
                        <a href="#">
                            <p class="descripcion--noticia">${item.data().Descripcion_breve}</p>
                        </a>
                    </div>
                </div>
              `;
                }

            });
        }


    });
}

// Funcion para cargar mas noticias
const CargarNoticias = async () => {
    btn_CargarNoticias.innerHTML = "Cargando...";
    const consulta = query(collection(db, "Noticias"),
        orderBy("Fecha_publicacion", "desc"),
        limit(6),
        startAfter(ultimoDocumento)
    );

    const noticias = await getDocs(consulta);

    if (noticias.docs.length > 0) {
        ultimoDocumento = noticias.docs[noticias.docs.length - 1];
        primerDocumento = noticias.docs[0];

        noticias.forEach(item => {
            contenedor_noticias.innerHTML += `
              <div class="tarjeta--noticia">
                    <a href="/noticias/${item.id}"><img src="${item.data().Imagen_cabecera}" alt="${item.data().Titulo}"></a>
                    <div class="noticia-text-block">
                        <p class="titulo--noticia">${item.data().Titulo}</p>
                        <p class="fecha--noticia">${item.data().Fecha_publicacion.toDate().toLocaleDateString("es-MX", options)}</p>
                        <a href="#">
                            <p class="descripcion--noticia">${item.data().Descripcion_breve}</p>
                        </a>
                    </div>
                </div>
              `;
        });

        btn_CargarNoticias.innerHTML = "Mas noticias";

    } else {
        btn_CargarNoticias.innerHTML = "No hay mas noticias";
        btn_CargarNoticias.disabled = true;
    }
}

export {
    CargarNoticiasinicial,
    CargarNoticias
}