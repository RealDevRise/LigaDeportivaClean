import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "../firebaseCore.js";


const Obtener_Stats_Cliente_Rol = async (rol, categoria) => {
	const consulta = query(collection(db, "Client_Stat_Personas"),
		where("categoria", "==", categoria),
		where("rol", "==", rol),
		orderBy("nombre", "asc")
	);

	const response = await getDocs(consulta);

	if (response.docs.length > 0) {
		return response;
	} else
		return null;
}

export {
	Obtener_Stats_Cliente_Rol
}