import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "../firebaseCore.js";

const Cargar_Todos_Los_Equipos = async () => {
    const consulta = query(collection(db, "Equipos"),
        orderBy("Nombre_completo", "asc")
    );

    const response = await getDocs(consulta);

    if (response.docs.length > 0)
        return response;
    else
        return null;

}

const Obtener_Nombre_Equipo = async (IdEquipo) => {
    const docRef = doc(db, "Equipos", IdEquipo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap;
    } else {
        console.error(`Error al obtener datos de la persona Message ID: ${IdCategoria}`);
        return null;
    }
}

export {
    Cargar_Todos_Los_Equipos,
    Obtener_Nombre_Equipo
}