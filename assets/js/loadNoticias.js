import { db, collection, ref, storage, doc, getDocs, query, getDownloadURL, orderBy, limit, where, getDoc, listAll } from "./firebaseCore.js";

const span_titulo = document.getElementById("span_titulo_noticia");
const contenedor_articulo = document.getElementById("contenedor_articulo");
const span_autor = document.getElementById("span_autor_noticia");
const span_fecha = document.getElementById("span_fecha_noticia");
const galeria_imagenes = document.getElementById("contenedor_galeria_imagenes");
const background_noticia = document.getElementById("background_noticia");

document.addEventListener('DOMContentLoaded', async function() {
    cargaNoticia();
});

const cargaNoticia = async() => {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const idNoticia = window.location.href.split('/')[4];
    const docRef = doc(db, "Noticias", idNoticia);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        background_noticia.setAttribute("style", `background-image: url(${docSnap.data().Imagen_cabecera});`)
        span_titulo.innerHTML = docSnap.data().Titulo;
        span_autor.innerHTML = docSnap.data().Nombre_autor;
        span_fecha.innerHTML = docSnap.data().Fecha_publicacion.toDate().toLocaleDateString("es-MX", options);
        contenedor_articulo.innerHTML = docSnap.data().Contenido;

        const listRef = ref(storage, `Noticias/${idNoticia}`);
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
    }
}

const armarImagenes = (url, imgName) => {
    galeria_imagenes.innerHTML += `
    <a href="${url}" data-lightbox="galeriaFotos"><img src="${url}" alt="${imgName}"></a>
    `;
}