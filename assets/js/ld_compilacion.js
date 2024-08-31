import * as coreCompilacion from "./corecompilacion.js";

const gridPrincipal = document.getElementById("ld_contenedor_tabla");
const btnNuevo = document.getElementById("btn_nuevo");
const btnFormularioRegresar = document.getElementById("btnFormulario_regresar");
const btnSiguiente = document.getElementById("btn_siguiente");
const btnAtras = document.getElementById("btn_previo");
const btnModalEliminar = document.getElementById("btnModal_eliminar");

let ultimoDocumento = null;
let primerDocumento = null;
let uidUser = "";
let idRegistro = "";

/*********** EVENTOS GENERALES **********/
document.addEventListener('DOMContentLoaded', async() => {
    coreCompilacion.onAuthStateChanged(coreCompilacion.auth, async(user) => {
        if (user) {
            const name_dropdown = document.getElementById("menu-dropdown");
            name_dropdown.innerHTML = user.displayName;
            name_dropdown.setAttribute("usrid", user.uid);
            uidUser = user.uid;
            let listaCompilacion = await coreCompilacion.leer();
            armarTabla(listaCompilacion);
        } else {
            window.location.replace('/Login.html');
        }
    });
});

const armarTabla = async(snapshot) => {
    if (snapshot != null) {
        ultimoDocumento = snapshot.docs[snapshot.docs.length - 1];
        primerDocumento = snapshot.docs[0];
        gridPrincipal.innerHTML = '';

        snapshot.forEach(doc => {

            let divCardBody = document.createElement("div");
            divCardBody.classList.add("card-body");

            let h4CardTitle = document.createElement("h4");
            h4CardTitle.classList.add("card-title");
            h4CardTitle.setAttribute("style", "display:flex; align-items:center; margin-bottom:0.25rem;");
            h4CardTitle.innerHTML = doc.data().nombre;
            divCardBody.appendChild(h4CardTitle);

            let pCardText = document.createElement("p");
            pCardText.classList.add("card-text");
            pCardText.setAttribute("style", "font-size:0.8rem; margin-bottom:0.3rem;");
            pCardText.innerHTML = `Fecha de registro: <span class="noticia-fecha-publicacion">${doc.data().fecha_registro.toDate().toLocaleDateString("es-MX")}</span>`;
            divCardBody.appendChild(pCardText);

            let buttonEditar = document.createElement("button");
            // buttonEditar.setAttribute("id", doc.id);
            buttonEditar.setAttribute("class", "btn btnDashboard btnDashboard-primary");
            buttonEditar.setAttribute("style", "margin-right:6px;");
            buttonEditar.innerHTML = "Editar";
            buttonEditar.addEventListener("click", () => {
                window.location.replace(`/Dashboard/compilacion/scorebook.html?id=${doc.id}`);
                // obtenerProgramacion(doc.id);
            });
            divCardBody.appendChild(buttonEditar);

            let buttonEliminar = document.createElement("button");
            buttonEliminar.setAttribute("class", "btn btnDashboard btnDashboard-danger");
            buttonEliminar.addEventListener("click", () => {
                confirmarEliminacion(doc.id);
            });
            buttonEliminar.innerHTML = "Eliminar";
            divCardBody.appendChild(buttonEliminar);

            gridPrincipal.appendChild(divCardBody);

        });
    }
};

// Abrir nuevo registro de programación de juego //
btnNuevo.addEventListener("click", async(e) => {
    window.location.replace(`/Dashboard/compilacion/scorebook.html`);
});

btnSiguiente.addEventListener("click", async() => {
    let compilacion = await coreCompilacion.paginaSiguiente(ultimoDocumento);
    armarTabla(compilacion);
});

btnAtras.addEventListener("click", async() => {
    let compilacion = await coreCompilacion.paginaAnterior(primerDocumento);
    armarTabla(compilacion);
});

// Boton de eliminar dentro del modal de confirmación //
btnModalEliminar.addEventListener('click', async(e) => {
    let eliminarCompilacion = await coreCompilacion.eliminar(e.target.value);

    if (eliminarCompilacion == "1") {
        $('#modal-eliminar').modal('hide');
        let listaCompilacion = await coreCompilacion.getList();
        armarTabla(listaCompilacion);
    } else
        console.error(eliminarCompilacion);
});