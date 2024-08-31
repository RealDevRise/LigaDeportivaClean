import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "../firebaseCore.js";

const Cargar_Categorias = async () => {
  const consulta = query(collection(db, "Categorias"),
    orderBy("Descripcion", "asc")
  );

  const response = await getDocs(consulta);

  if (response.docs.length > 0)
    return response;
  else
    return null;

}

const Obtener_Nombre_Categoria = async (IdCategoria) => {
  const docRef = doc(db, "Categorias", IdCategoria);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().Descripcion;
  } else {
    console.error(`Error al obtener datos de la persona Message ID: ${IdCategoria}`);
    return null;
  }
}

export {
  Cargar_Categorias,
  Obtener_Nombre_Categoria
}