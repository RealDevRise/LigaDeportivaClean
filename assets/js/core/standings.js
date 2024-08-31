import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "../firebaseCore.js";

// Lectura de las categorias que existen //
const leerCategoriasDisponibles = async() => {
    const consulta = query(collection(db, "Categorias"),
        orderBy("Descripcion", "asc")
    );

    const response = await getDocs(consulta);

    if (response.docs.length > 0) {
        return response;
    } else
        return null;
};

const leerCategoria = async(idCategoria) => {
    const consulta = doc(db, "Categorias", idCategoria);
    const response = await getDoc(consulta);

    if (response.exists()) {
        return response;
    } else
        return null;

}

const leerGruposDisponibles = async() => {
    const consulta = query(collection(db, "Grupos"),
        orderBy("Nombre", "asc")
    );

    const response = await getDocs(consulta);

    if (response.docs.length > 0) {
        return response;
    } else
        return null;
};

const leerStanding = async(idCategoria) => {
    const consulta = query(collection(db, "Client_Standing"),
        where("categoria", "==", idCategoria),
        orderBy("grupo"),
        orderBy("pct", "desc")
    );

    const response = await getDocs(consulta);

    if (response.docs.length > 0) {

        return response;
    } else
        return null;
}

const leerEquipo = async(idEquipo) => {
    const consulta = doc(db, "Equipos", idEquipo);
    const response = await getDoc(consulta);

    if (response.exists()) {
        return response;
    } else
        return null;

}

const leerGrupo = async(idGrupo) => {
    const consulta = doc(db, "Grupos", idGrupo);
    const response = await getDoc(consulta);

    if (response.exists())
        return response;
    else
        return null;
}


const ActualizarGrupo = async(idEquipo, idTemporada, idCategoria, idGrupo) => {

    const consulta = query(collection(db, "Standing"),
        where("equipo", "==", idEquipo),
        where("temporada", "==", idTemporada),
        where("categoria", "==", idCategoria)
    );

    const response = await getDocs(consulta);

    await Promise.all(response.docs.map(async(equipo) => {
        const standingReference = doc(db, "Standing", equipo.id);

        await updateDoc(standingReference, {
            grupo: idGrupo
        });
    }));

}

const ActualizarGrupo_ClientStanding = async(idEquipo, idTemporada, idCategoria, idGrupo) => {
    const consulta = query(collection(db, "Client_Standing"),
        where("equipo", "==", idEquipo),
        where("temporada", "==", idTemporada),
        where("categoria", "==", idCategoria)
    );

    const response = await getDocs(consulta);

    await Promise.all(response.docs.map(async(equipo) => {
        const Client_StandingReference = doc(db, "Client_Standing", equipo.id);

        await updateDoc(Client_StandingReference, {
            grupo: idGrupo
        });
    }));

}



export {
    leerCategoriasDisponibles,
    leerGruposDisponibles,
    leerStanding,
    leerEquipo,
    leerGrupo,
    leerCategoria,
    auth,
    onAuthStateChanged,
    ActualizarGrupo,
    ActualizarGrupo_ClientStanding
}