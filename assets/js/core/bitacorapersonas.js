import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "../firebaseCore.js";

// Registro bitacora //
const Registro = async(datos, movimiento) => {
    try {

        const docRef = await addDoc(collection(db, "Bitacora_personas"), {
            accion: movimiento,
            persona: datos.persona,
            fecha: Timestamp.now(),
            fecha_movimiento: datos.fechamovimiento,
            responsable: datos.responsable,
            temporada: datos.temporada,
            categoria: datos.categoria,
            equipo: datos.equipo,
            observaciones: datos.observaciones
        });

        return docRef;

    } catch (e) {
        console.error(`Error al registrar bitácora: ${e}`);
        return null;
    }
}

const Obtener_Ultimo_Registro = async(idJugador) => {
    const consulta = query(collection(db, "Bitacora_personas"),
        where("persona", "==", idJugador),
        orderBy("fecha", "desc"),
        limit(1)
    );

    const response = await getDocs(consulta);

    if (response.docs.length > 0)
        return response;
    else
        return null;
}



export {
    Registro,
    Obtener_Ultimo_Registro
}