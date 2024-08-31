import { db, collection, ref, storage, doc, getDocs, query, getDownloadURL, orderBy, limit, where, getDoc, startAt, startAfter, endBefore, limitToLast } from "./firebaseCore.js";
let limitePaginacion = 25;
let modoRol = "bateo";
let latestDoc = null;

const lectura_filtro_temporada = async() => {
    const consulta = query(collection(db, "Temporadas"),
        orderBy("Fecha_inauguracion", "desc")
    );

    const snap = await getDocs(consulta);

    if (snap.docs.length > 0)
        return snap;
    else
        return null;
}

const lectura_filtro_categoria = async() => {
    const consulta = query(collection(db, "Categorias"),
        orderBy("Fecha_publicacion", "desc")
    );

    const snap = await getDocs(consulta);

    if (snap.docs.length > 0)
        return snap;
    else
        return null;
}

const lectura_filtro_equipos = async() => {
    const consulta = query(collection(db, "Equipos"),
        orderBy("Nombre_completo", "asc")
    );

    const snap = await getDocs(consulta);

    if (snap.docs.length > 0)
        return snap;
    else
        return null;
}

const lectura_todosLosJugadores = async(rol) => {
    modoRol = rol;
    let consulta = null;

    if (modoRol == "bateo") {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }

    } else {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    }

    const snap = await getDocs(consulta);

    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }

    // if (snap.docs.length > 0) {

    //     return snap;

    // } else {
    //     console.log("Pues no hay");
    //     return null;
    // }


}

const lectura_jugadores_individuales_nuevo = async(idTemporada = "", idCategoria = "", idEquipo = "", rol = "") => {

    // console.log(idTemporada);
    // console.log(idCategoria);
    // console.log(idEquipo);
    latestDoc = null;
    modoRol = rol;

    if (idTemporada == "" && idCategoria == "" && idEquipo == "") {
        return await lectura_todosLosJugadores(rol);
    } else if (idTemporada != "" && idCategoria == "" && idEquipo == "") {
        return await consultaFiltroTemporada(idTemporada, rol);
    } else if (idTemporada == "" && idCategoria != "" && idEquipo == "") {
        return await consultaFiltrocategoria(idCategoria, rol);
    } else if (idTemporada != "" && idCategoria != "" && idEquipo == "") {
        return await consultaFiltroTemporadaCategoria(idTemporada, idCategoria, rol);
    } else if (idTemporada == "" && idCategoria == "" && idEquipo != "") {
        return await consultaFiltroEquipo(idEquipo, rol);
    } else if (idTemporada != "" && idCategoria == "" && idEquipo != "") {
        return await consultaFiltroTemporadaEquipo(idTemporada, idEquipo, rol);
    } else if (idTemporada == "" && idCategoria != "" && idEquipo != "") {
        return await consultaFiltroCategoriaEquipo(idCategoria, idEquipo, rol);
    } else if (idTemporada != "" && idCategoria != "" && idEquipo != "") {
        return await consultaFiltroTemporadaCategoriaEquipo(idTemporada, idCategoria, idEquipo, rol);
    }

}

const lectura_jugadores_individuales_actual = async(idTemporada = "", idCategoria = "", idEquipo = "", rol = "") => {

    // console.log(idTemporada);
    // console.log(idCategoria);
    // console.log(idEquipo);
    modoRol = rol;

    if (idTemporada == "" && idCategoria == "" && idEquipo == "") {
        return await lectura_todosLosJugadores(rol);
    } else if (idTemporada != "" && idCategoria == "" && idEquipo == "") {
        return await consultaFiltroTemporada(idTemporada, rol);
    } else if (idTemporada == "" && idCategoria != "" && idEquipo == "") {
        return await consultaFiltrocategoria(idCategoria, rol);
    } else if (idTemporada != "" && idCategoria != "" && idEquipo == "") {
        return await consultaFiltroTemporadaCategoria(idTemporada, idCategoria, rol);
    } else if (idTemporada == "" && idCategoria == "" && idEquipo != "") {
        return await consultaFiltroEquipo(idEquipo, rol);
    } else if (idTemporada != "" && idCategoria == "" && idEquipo != "") {
        return await consultaFiltroTemporadaEquipo(idTemporada, idEquipo, rol);
    } else if (idTemporada == "" && idCategoria != "" && idEquipo != "") {
        return await consultaFiltroCategoriaEquipo(idCategoria, idEquipo, rol);
    } else if (idTemporada != "" && idCategoria != "" && idEquipo != "") {
        return await consultaFiltroTemporadaCategoriaEquipo(idTemporada, idCategoria, idEquipo, rol);
    }

}

const lectura_equipo_nuevo = async(idTemporada = "", idCategoria = "", idEquipo = "") => {
    latestDoc = null;

    if (idTemporada == "" && idCategoria == "" && idEquipo == "") {
        return await consultaEquipo_Todo();
    } else if (idTemporada != "" && idCategoria == "" && idEquipo == "") {
        return await consultaEquipo_FiltroTemporada(idTemporada);
    } else if (idTemporada == "" && idCategoria != "" && idEquipo == "") {
        return await consultaEquipo_FiltroCategoria(idCategoria);
    } else if (idTemporada != "" && idCategoria != "" && idEquipo == "") {
        return await consultaEquipo_FiltroTemporadaCategoria(idTemporada, idCategoria);
    } else if (idTemporada == "" && idCategoria == "" && idEquipo != "") {
        return await consultaEquipo_FiltroEquipo(idEquipo);
    } else if (idTemporada != "" && idCategoria == "" && idEquipo != "") {
        return await consultaEquipo_FiltroTemporadaEquipo(idTemporada, idEquipo);
    } else if (idTemporada == "" && idCategoria != "" && idEquipo != "") {
        return await consultaEquipo_FiltroCategoriaEquipo(idCategoria, idEquipo);
    } else if (idTemporada != "" && idCategoria != "" && idEquipo != "") {
        return await consultaEquipo_FiltroTemporadaCategoriaEquipo(idTemporada, idCategoria, idEquipo);
    }
}

const lectura_equipo_actual = async(idTemporada = "", idCategoria = "", idEquipo = "") => {
    if (idTemporada == "" && idCategoria == "" && idEquipo == "") {
        return await consultaEquipo_Todo();
    } else if (idTemporada != "" && idCategoria == "" && idEquipo == "") {
        return await consultaEquipo_FiltroTemporada(idTemporada);
    } else if (idTemporada == "" && idCategoria != "" && idEquipo == "") {
        return await consultaEquipo_FiltroCategoria(idCategoria);
    } else if (idTemporada != "" && idCategoria != "" && idEquipo == "") {
        return await consultaEquipo_FiltroTemporadaCategoria(idTemporada, idCategoria);
    } else if (idTemporada == "" && idCategoria == "" && idEquipo != "") {
        return await consultaEquipo_FiltroEquipo(idEquipo);
    } else if (idTemporada != "" && idCategoria == "" && idEquipo != "") {
        return await consultaEquipo_FiltroTemporadaEquipo(idTemporada, idEquipo);
    } else if (idTemporada == "" && idCategoria != "" && idEquipo != "") {
        return await consultaEquipo_FiltroCategoriaEquipo(idCategoria, idEquipo);
    } else if (idTemporada != "" && idCategoria != "" && idEquipo != "") {
        return await consultaEquipo_FiltroTemporadaCategoriaEquipo(idTemporada, idCategoria, idEquipo);
    }
}

const consultaFiltroTemporada = async(idTemporada, rol) => {
    let consulta = null;

    if (rol == "bateo") {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    } else {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    }

    const snap = await getDocs(consulta);

    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }

    // if (snap.docs.length > 0) {
    //     latestDoc = snap.docs[snap.docs.length - 1];

    //     if (snap.empty) {

    //     }
    //     return snap;
    // } else
    //     return null;
}

const consultaFiltrocategoria = async(idCategoria, rol) => {
    let consulta = null;

    if (rol == "bateo") {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("categoria", "==", idCategoria),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("categoria", "==", idCategoria),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    } else {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("categoria", "==", idCategoria),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("categoria", "==", idCategoria),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    }

    const snap = await getDocs(consulta);

    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }

    // if (snap.docs.length > 0)
    //     return snap;
    // else
    //     return null;
}

const consultaFiltroEquipo = async(idEquipo, rol) => {
    let consulta = null;

    if (rol == "bateo") {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    } else {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    }

    const snap = await getDocs(consulta);
    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }
    // if (snap.docs.length > 0)
    //     return snap;
    // else
    //     return null;
}

const consultaFiltroTemporadaCategoria = async(idTemporada, idCategoria, rol) => {
    let consulta = null;

    if (rol == "bateo") {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("categoria", "==", idCategoria),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("categoria", "==", idCategoria),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    } else {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("categoria", "==", idCategoria),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("categoria", "==", idCategoria),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    }

    const snap = await getDocs(consulta);
    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }

    // if (snap.docs.length > 0)
    //     return snap;
    // else
    //     return null;
}

const consultaFiltroTemporadaEquipo = async(idTemporada, idEquipo, rol) => {
    let consulta = null;

    if (rol == "bateo") {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    } else {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    }

    const snap = await getDocs(consulta);

    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }

    // if (snap.docs.length > 0)
    //     return snap;
    // else
    //     return null;
}

const consultaFiltroCategoriaEquipo = async(idCategoria, idEquipo, rol) => {
    let consulta = null;

    if (rol == "bateo") {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("categoria", "==", idCategoria),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("categoria", "==", idCategoria),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    } else {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("categoria", "==", idCategoria),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("categoria", "==", idCategoria),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    }

    const snap = await getDocs(consulta);


    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }

    // if (snap.docs.length > 0)
    //     return snap;
    // else
    //     return null;
}

const consultaFiltroTemporadaCategoriaEquipo = async(idTemporada, idCategoria, idEquipo, rol) => {
    let consulta = null;

    if (rol == "bateo") {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("categoria", "==", idCategoria),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("categoria", "==", idCategoria),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("avg", "desc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    } else {
        if (latestDoc == null) {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("categoria", "==", idCategoria),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                limit(limitePaginacion)
            );
        } else {
            consulta = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", idTemporada),
                where("categoria", "==", idCategoria),
                where("equipo_actual", "==", idEquipo),
                where("rol", "==", rol),
                orderBy("era", "asc"),
                startAfter(latestDoc),
                limit(limitePaginacion)
            );
        }
    }

    const snap = await getDocs(consulta);
    latestDoc = snap.docs[snap.docs.length - 1];
    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }

}

const consultaEquipo_Todo = async() => {
    let consulta = null;

    if (latestDoc == null) {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            orderBy("avg", "desc"),
            limit(limitePaginacion)
        );
    } else {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            orderBy("avg", "desc"),
            startAfter(latestDoc),
            limit(limitePaginacion)
        );
    }

    const snap = await getDocs(consulta);

    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }
}

const consultaEquipo_FiltroTemporada = async(idTemporada) => {
    let consulta = null;

    if (latestDoc == null) {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("temporada", "==", idTemporada),
            orderBy("avg", "desc"),
            limit(limitePaginacion)
        );
    } else {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("temporada", "==", idTemporada),
            orderBy("avg", "desc"),
            startAfter(latestDoc),
            limit(limitePaginacion)
        );
    }

    const snap = await getDocs(consulta);

    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }
}

const consultaEquipo_FiltroCategoria = async(idCategoria) => {
    let consulta = null;

    if (latestDoc == null) {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("categoria", "==", idCategoria),
            orderBy("avg", "desc"),
            limit(limitePaginacion)
        );
    } else {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("categoria", "==", idCategoria),
            orderBy("avg", "desc"),
            startAfter(latestDoc),
            limit(limitePaginacion)
        );
    }

    const snap = await getDocs(consulta);

    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }
}

const consultaEquipo_FiltroEquipo = async(idEquipo) => {
    let consulta = null;

    if (latestDoc == null) {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("equipo", "==", idEquipo),
            orderBy("avg", "desc"),
            limit(limitePaginacion)
        );
    } else {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("equipo", "==", idEquipo),
            orderBy("avg", "desc"),
            startAfter(latestDoc),
            limit(limitePaginacion)
        );
    }

    const snap = await getDocs(consulta);
    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }

}

const consultaEquipo_FiltroTemporadaCategoria = async(idTemporada, idCategoria) => {
    let consulta = null;

    if (latestDoc == null) {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("temporada", "==", idTemporada),
            where("categoria", "==", idCategoria),
            orderBy("avg", "desc"),
            limit(limitePaginacion)
        );
    } else {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("temporada", "==", idTemporada),
            where("categoria", "==", idCategoria),
            orderBy("avg", "desc"),
            startAfter(latestDoc),
            limit(limitePaginacion)
        );
    }

    const snap = await getDocs(consulta);

    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }
}

const consultaEquipo_FiltroTemporadaEquipo = async(idTemporada, idEquipo) => {
    let consulta = null;

    if (latestDoc == null) {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("temporada", "==", idTemporada),
            where("equipo", "==", idEquipo),
            orderBy("avg", "desc"),
            limit(limitePaginacion)
        );
    } else {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("temporada", "==", idTemporada),
            where("equipo", "==", idEquipo),
            orderBy("avg", "desc"),
            startAfter(latestDoc),
            limit(limitePaginacion)
        );
    }

    const snap = await getDocs(consulta);

    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }
}

const consultaEquipo_FiltroCategoriaEquipo = async(idCategoria, idEquipo) => {
    let consulta = null;

    if (latestDoc == null) {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("categoria", "==", idCategoria),
            where("equipo", "==", idEquipo),
            orderBy("avg", "desc"),
            limit(limitePaginacion)
        );
    } else {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("categoria", "==", idCategoria),
            where("equipo", "==", idEquipo),
            orderBy("avg", "desc"),
            startAfter(latestDoc),
            limit(limitePaginacion)
        );
    }

    const snap = await getDocs(consulta);

    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {
        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }
}

const consultaEquipo_FiltroTemporadaCategoriaEquipo = async(idTemporada, idCategoria, idEquipo) => {
    let consulta = null;
    if (latestDoc == null) {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("temporada", "==", idTemporada),
            where("categoria", "==", idCategoria),
            where("equipo", "==", idEquipo),
            orderBy("avg", "desc"),
            limit(limitePaginacion)
        );
    } else {
        consulta = query(collection(db, "Client_Stat_Equipos"),
            where("temporada", "==", idTemporada),
            where("categoria", "==", idCategoria),
            where("equipo", "==", idEquipo),
            orderBy("avg", "desc"),
            startAfter(latestDoc),
            limit(limitePaginacion)
        );
    }

    const snap = await getDocs(consulta);

    latestDoc = snap.docs[snap.docs.length - 1];

    if (snap.empty) {

        document.getElementById("btnCargarMasDatos").disabled = true;
        document.getElementById("btnCargarMasDatos").innerHTML = "Ya no hay mas registros";
        return null;
    } else {
        return snap;
    }
}



export {
    lectura_todosLosJugadores,
    lectura_filtro_temporada,
    lectura_filtro_categoria,
    lectura_filtro_equipos,
    lectura_jugadores_individuales_nuevo,
    lectura_jugadores_individuales_actual,
    lectura_equipo_nuevo,
    lectura_equipo_actual
}