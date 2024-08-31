import { db, collection, ref, storage, doc, getDocs, query, getDownloadURL, orderBy, limit, where, getDoc, signInWithEmailAndPassword } from "./firebaseCore.js";

const cargarCalendario = async() => {
    let arrayEventos = [];

    const consulta = query(collection(db, "Calendario"));

    await getDocs(consulta).then((doc) => {
        doc.docs.forEach((item) => {
            let fechaData = item.data().Fecha.toDate();
            fechaData.setMinutes(fechaData.getMinutes() - fechaData.getTimezoneOffset());
            let evento = {
                'id': item.id,
                'title': item.data().Titulo,
                'start': fechaData.toISOString().slice(0, -1)
            };
            arrayEventos.push(evento);
        });
    });

    return arrayEventos;
}

const cargarEvento = async(id) => {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const consulta = doc(db, "Calendario", id);
    const docSnap = await getDoc(consulta);

    if (docSnap.exists()) {
        let datosEvento = {
            'Titulo': docSnap.data().Titulo,
            'Fecha': docSnap.data().Fecha.toDate().toLocaleDateString("es-MX", options),
            'Descripcion': docSnap.data().Descripcion,
            'Equipo_a': docSnap.data().Equipo_a,
            'Equipo_b': docSnap.data().Equipo_b,
            'Tipo_evento': docSnap.data().Tipo_evento
        };

        return datosEvento;
    } else {
        return null;
    }
}

const cargarEquipo = async(id) => {
    const consulta = doc(db, "Equipos", id);
    const docSnap = await getDoc(consulta);

    if (docSnap.exists()) {
        let datosEquipo = {
            'Nombre_completo': docSnap.data().Nombre_completo,
            'Logotipo': docSnap.data().Logotipo
        }

        return datosEquipo;
    } else {
        return null;
    }
}


export { cargarCalendario, cargarEvento, cargarEquipo }