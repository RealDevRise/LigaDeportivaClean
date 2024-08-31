import { db, collection, ref, storage, doc, getDocs, query, getDownloadURL, orderBy, limit, where, getDoc } from "./firebaseCore.js";
import { CargarNoticiasinicial, CargarNoticias } from "./core/front_noticias.js";

const contenedor_primera_noticia = document.getElementById("primera-noticia");
const contenedor_noticias = document.getElementById("contenedor-noticias");
const btn_CargarNoticias = document.getElementById("btn_cargarNoticias");

let index_noticia = 0;

document.addEventListener('DOMContentLoaded', async function() {
    await CargarNoticiasinicial();
});

const cargarNoticiasinicial_ = async() => {
    index_noticia = 0;
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const consulta = query(collection(db, "Noticias"),
        orderBy("Fecha_publicacion", "desc"),
        limit(7)
    );

    await getDocs(consulta).then((doc) => {
        doc.docs.forEach(async(item) => {
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
    });
}

btn_CargarNoticias.addEventListener('click', async() =>{
    
    await CargarNoticias();
});
