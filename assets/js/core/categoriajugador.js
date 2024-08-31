import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "../firebaseCore.js";

const Obtener = async() => {
    const consulta = query(collection(db, "Categoria_Jugador"),
        orderBy("descripcion", "desc")
    );

    const documentSnapshots = await getDocs(consulta);

    return documentSnapshots;
}


const Leer = async(idCategoria) => {
    const docRef = doc(db, "Categoria_Jugador", idCategoria);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap;
    } else {
        console.error(`Error al obtener datos de la persona Message ID: ${id}`);
        return null;
    }
}


export {
    Obtener,
    Leer
}