import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "./firebaseCore.js";
const limitePaginacion = 5;

const crear = async (datos) => {
    try {
        const docRef = await addDoc(collection(db, "Compilacion"), {
            nombre: datos.nombre,
            programacion: datos.programacion,
            temporada: datos.temporada,
            categoria: datos.categoria,
            partida: datos.partida,
            fecha_partida: datos.fecha_partida,
            infraccion_local: datos.infraccion_local,
            infraccion_visita: datos.infraccion_visita,
            scorebook_equipo_local: datos.scorebook_local,
            carreras_equipo_local: datos.carreras_local,
            logotipo_local: datos.logo_local,
            nombre_equipo_local: datos.nombreLocal,
            equipo_local: datos.idLocal,
            scorebook_equipo_visita: datos.scorebook_visita,
            carreras_equipo_visita: datos.carreras_visita,
            logotipo_visita: datos.logo_visita,
            nombre_equipo_visita: datos.nombreVisita,
            equipo_visita: datos.idVisita,
            fecha_registro: Timestamp.now(),
            autor: datos.usuario
        });
        return { response: "1", result: docRef.id };
    } catch (e) {
        return { response: "0", result: e };
    }
}

const actualizar = async (datos, id) => {
    const docRef = doc(db, "Compilacion", id);

    try {
        await updateDoc(docRef, {
            nombre: datos.nombre,
            programacion: datos.programacion,
            temporada: datos.temporada,
            categoria: datos.categoria,
            partida: datos.partida,
            fecha_partida: datos.fecha_partida,
            infraccion_local: datos.infraccion_local,
            infraccion_visita: datos.infraccion_visita,
            scorebook_equipo_local: datos.scorebook_local,
            carreras_equipo_local: datos.carreras_local,
            logotipo_local: datos.logo_local,
            nombre_equipo_local: datos.nombreLocal,
            equipo_local: datos.idLocal,
            scorebook_equipo_visita: datos.scorebook_visita,
            carreras_equipo_visita: datos.carreras_visita,
            logotipo_visita: datos.logo_visita,
            nombre_equipo_visita: datos.nombreVisita,
            equipo_visita: datos.idVisita
        });
        return { response: "1", result: "" };
    } catch (e) {
        return { response: "0", result: e };
    }
}

const leer = async () => {
    const consulta = query(collection(db, "Compilacion"),
        orderBy("fecha_registro", "desc"),
        limit(limitePaginacion)
    );

    const snapshot = await getDocs(consulta);

    if (snapshot.docs.length > 0)
        return snapshot;
    else
        return null;
}

const eliminar = async (id) => {
    try {
        await deleteDoc(doc(db, 'Compilacion', id));
        return "1";
    } catch (e) {
        return e;
    }
}

const obtener = async (id) => {
    const docRef = doc(db, "Compilacion", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
        return docSnap;
    else
        return null;
}

const obtenerProgramacion = async (id) => {
    const docRef = doc(db, "ProgramacionJuegos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists())
        return docSnap;
    else
        return null;
}

const getList = async () => {
    const consulta = query(collection(db, "Compilacion"),
        orderBy("fecha", "desc"),
        limit(limitePaginacion)
    );

    const docSnap = await getDocs(consulta);

    if (docSnap.docs.length > 0)
        return docSnap;
    else
        return null;
}

const getCompilacion = async (id) => {
    const consulta = doc(db, "Compilacion", id);
    const docSnap = await getDoc(consulta);

    if (docSnap.exists())
        return docSnap;
    else
        return null;
}

const paginaSiguiente = async (doc) => {
    const consulta = query(collection(db, "Compilacion"),
        orderBy("fecha", "desc"),
        limit(limitePaginacion),
        startAfter(doc)
    );

    const snapshot = await getDocs(consulta);

    if (snapshot.docs.length > 0)
        return snapshot;
    else
        return null;
}

const paginaAnterior = async (doc) => {
    const consulta = query(collection(db, "Compilacion"),
        orderBy("fecha", "desc"),
        endBefore(doc),
        limitToLast(limitePaginacion)
    );

    const snapshot = await getDocs(consulta);

    if (snapshot.docs.length > 0)
        return snapshot;
    else
        return null;
}

const ListaProgramacion = async () => {
    const consulta = query(collection(db, "ProgramacionJuegos"));
    const documentSnapshot = await getDocs(consulta);

    if (documentSnapshot.docs.length > 0) {
        return documentSnapshot;
    } else {
        return null;
    }
}

const ListaDetalleProgramacion = async (id) => {
    const consulta = doc(db, "ProgramacionJuegos", id);
    const docSnap = await getDoc(consulta);

    if (docSnap.exists())
        return docSnap;
    else
        return null;
}

const ListaTemporadas = async () => {
    const consulta = query(collection(db, "Temporadas"));
    const documentSnapshot = await getDocs(consulta);

    if (documentSnapshot.docs.length > 0) {
        return documentSnapshot;
    } else {
        return null;
    }
}

const ListaCategorias = async (temporada) => {
    const consulta = query(collection(db, "Categorias"));
    const documentSnapshot = await getDocs(consulta);

    if (documentSnapshot.docs.length > 0) {
        return documentSnapshot;
    } else {
        return null;
    }
}

const ListaJugadores = async (temporada, categoria, equipo) => {
    const consulta = query(collection(db, "Personas"),
        where("Temporada_actual", "==", temporada),
        where("Categoria_actual", "==", categoria),
        where("Equipo_actual", "==", equipo),
        where("Tipo_persona", "==", "jugador"),
        orderBy("Nombre_completo", "asc")
    );
    const documentSnapshot = await getDocs(consulta);

    if (documentSnapshot.docs.length > 0) {
        return documentSnapshot;
    } else {
        return null;
    }
}

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

const ListaJugadoresBaja = async (equipo) => {
    let jugadores = [];
    const consulta = query(collection(db, "Bitacora_personas"), where("equipo", "==", equipo), where("accion", "==", "baja"));
    const documentSnapshot = await getDocs(consulta);

    if (documentSnapshot.docs.length > 0) {
        // await Promise.all(documentSnapshot.docs.map(async(dato) =>{
        //     let persona = await getJugador(dato._document.data.value.mapValue.fields.persona.stringValue);
        //     if(persona != null)
        //         jugadores.push(persona);
        // }));

        await Promise.all(documentSnapshot.docs.map(async (dato) => {
            let persona = await getJugador(dato._document.data.value.mapValue.fields.persona.stringValue);
            if (persona != null)
                jugadores.push(persona);
        }));

        // await asyncForEach(documentSnapshot.docs, async(docPersonas) =>{
        //     await waitFor(50);
        //     let persona = await getJugador(docPersonas._document.data.value.mapValue.fields.persona.stringValue);
        //     jugadores.push(persona);
        // });

        return jugadores;

    } else {
        return [];
    }
}

const ListaJugadoresBajaGeneral = async () => {
    let jugadores = [];
    const consulta = query(collection(db, "Personas"), where("Equipo_actual", "==", ""), orderBy("Nombre_completo", "asc"));
    const docSnap = await getDocs(consulta);

    if (docSnap.docs.length > 0) {

        docSnap.forEach(doc => {

            let objPersona = {
                id: doc.id,
                nombre: doc.data().Nombre_completo
            };

            jugadores.push(objPersona);

        });



    }

    const consulta_bitacora = query(collection(db, "Bitacora_personas"), where("accion", "==", "baja"));
    const documentSnapshot = await getDocs(consulta_bitacora);

    if (documentSnapshot.docs.length > 0) {
        let ds = documentSnapshot.docs;
        await Promise.all(documentSnapshot.docs.map(async (dato) => {
            let persona = await getJugador(dato._document.data.value.mapValue.fields.persona.stringValue);
            if (persona != null)
                jugadores.push(persona);
        }));


        // await asyncForEach(documentSnapshot.docs, async(docPersonas) =>{
        //     await waitFor(50);
        //     let persona = await getJugador(docPersonas._document.data.value.mapValue.fields.persona.stringValue);
        //     if(persona != null)
        //         jugadores.push(persona);
        // });

    }
    return jugadores;
}

const ListaEquipos = async (temporada, categoria) => {
    const consulta = query(collection(db, "Equipos"),
        where("Temporada", "==", temporada),
        where("Categoria", "==", categoria),
        orderBy("Nombre_completo", "asc")
    );
    const documentSnapshot = await getDocs(consulta);

    if (documentSnapshot.docs.length > 0) {
        return documentSnapshot;
    } else {
        return null;
    }
}

const NumeroJugador = async (jugador) => {
    const consulta = doc(db, "Personas", jugador);
    const documentSnapshot = await getDoc(consulta);

    if (documentSnapshot.exists()) {
        return documentSnapshot.data().Jugador_numero_camisa;
    } else
        return null;
}

const getTemporada = async (id) => {
    const consulta = doc(db, "Temporadas", id);
    const docSnap = await getDoc(consulta);

    if (docSnap.exists())
        return docSnap;
    else return null;
}

const getCategoria = async (id) => {
    const consulta = doc(db, "Categorias", id);
    const docSnap = await getDoc(consulta);

    if (docSnap.exists())
        return docSnap;
    else
        return null;
}

const getJugador = async (id) => {
    const consulta = doc(db, "Personas", id);
    const docSnap = await getDoc(consulta);

    if (docSnap.exists()) {
        let persona = {
            id: docSnap.id,
            nombre: docSnap.data().Nombre_completo
        };
        return persona;
    } else {
        return null;
    }
}

const getDataJugador = async (id) => {
    const consulta = doc(db, "Personas", id);
    const docSnap = await getDoc(consulta);

    if (docSnap.exists()) {
        let persona = {
            nombre: docSnap.data().Nombre_completo,
            equipo_actual: docSnap.data().Equipo_actual
        };
        return persona;
    } else {
        return "";
    }
}

const getMultiplicadorCategoria = async (id) => {
    const consulta = doc(db, "Categorias", id);

    const docSnap = await getDoc(consulta);

    if (docSnap.exists()) {
        return docSnap.data().Multiplicador;
    } else
        return null;

}

const getEquipo = async (id) => {
    const consulta = doc(db, "Equipos", id);
    const docSnap = await getDoc(consulta);

    if (docSnap.exists())
        return docSnap;
    else
        return null;
}

const updateProgramacion = async (id, idCompilacion, idCategoria, idPartida) => {
    const docRef = doc(db, "ProgramacionJuegos", id);

    try {
        const matches = await getDoc(docRef);
        if (!matches.exists()) return "0";
        const docData = matches.data();
        let programaciones = docData.programacion;
        let indiceProgramacion = programaciones.findIndex(x => x.categoria == idCategoria);

        let partidas = programaciones.find(x => x.categoria == idCategoria).partidas;
        let indicePartida = partidas.findIndex(x => x.id == idPartida);

        docData.programacion[indiceProgramacion].partidas[indicePartida].compilacion = idCompilacion;

        await updateDoc(docRef, {
            ...docData
        });


        return "1";
    } catch (e) {
        return e;
    }
}

const eliminarStatPersona = async (id) => {
    try {
        await deleteDoc(doc(db, 'stat_personas', id));
        return "1";
    } catch (e) {
        return e;
    }
}

const eliminarClientStatPersona = async (idPersona, idTemporada, idCategoria, rol) => {
    const consulta = query(collection(db, "Client_Stat_Personas"),
        where("persona", "==", idPersona),
        where("temporada", "==", idTemporada),
        where("categoria", "==", idCategoria),
        where("rol", "==", rol)
    );

    const snap = await getDocs(consulta);

    if (snap.docs.length > 0) {
        await Promise.all(snap.docs.map(async (documento) => {
            await deleteDoc(doc(db, 'Client_Stat_Personas', documento.id));
        }));
    }
}

const limpiarStatCompilacion = async (idCompilacion) => {
    const consulta = query(collection(db, "Stat_Personas"),
        where("compilacion", "==", idCompilacion)
    );

    const snapshot = await getDocs(consulta);

    if (snapshot.docs.length > 0) {

        
        await Promise.all(snapshot.docs.map(async (documento) => {
            //  Elimina persona de Stat_Personas
            await deleteDoc(doc(db, 'Stat_Personas', documento.id));
        }));
        
        await Promise.all(snapshot.docs.map(async (documento) => {


            // Query para obtener Persona de Client_Stat_Personas
            let consulta_client = query(collection(db, "Client_Stat_Personas"),
                where("temporada", "==", documento.data().temporada),
                where("categoria", "==", documento.data().categoria),
                where("equipo_actual", "==", documento.data().equipo_actual),
                where("persona", "==", documento.data().persona),
                where("rol", "==", documento.data().rol)
            );

            let snapshot_client = await getDocs(consulta_client);

            // Eliminar la persona de Client_Stat_Personas
            if (snapshot_client.docs.length > 0) {

                await Promise.all(snapshot_client.docs.map(async (documento_cliente) => {
                    try {
                        await deleteDoc(doc(db, 'Client_Stat_Personas', documento_cliente.id));
                    } catch (e) {
                        console.error(`Error al eliminar Stat Persona '${documento.data().nombre}': ${e}`);
                    }
                }));
            }

        }));
    }

}



const limpiarClientStatEquipos = async (idTemporada, idCategoria, idEquipo) => {
    const consulta = query(collection(db, "Client_Stat_Equipos"),
        where("temporada", "==", idTemporada),
        where("categoria", "==", idCategoria),
        where("equipo", "==", idEquipo)
    );

    const snap = await getDocs(consulta);

    if (snap.docs.length > 0) {
        await Promise.all(snap.docs.map(async (documento) => {
            await deleteDoc(doc(db, 'Client_Stat_Equipos', documento.id));
        }));
    }
}

const limpiarEquipoStatCompilacion = async (idCompilacion) => {
    const consulta = query(collection(db, "Stat_Equipos"),
        where("compilacion", "==", idCompilacion)
    );

    const snapshot = await getDocs(consulta);

    if (snapshot.docs.length > 0) {
        await Promise.all(snapshot.docs.map(async (documento) => {
            await deleteDoc(doc(db, 'Stat_Equipos', documento.id));
        }));
    }
}

const recalculcarClientStatEquipo = async (idTemporada, idCategoria, idEquipo) => {
    const consulta = query(collection(db, "Stat_Equipos"),
        where("temporada", "==", idTemporada),
        where("categoria", "==", idCategoria),
        where("equipo", "==", idEquipo),
        where("rol", "==", "bateo")
    );

    let jj = 0,
        tt = 0,
        tl = 0,
        ht = 0,
        h1 = 0,
        h2 = 0,
        h3 = 0,
        h4 = 0,
        hr = 0,
        runs = 0,
        bo = 0,
        g = 0,
        s = 0,
        bb = 0,
        k = 0,
        avg = 0.0;

    let dataEquipo = await getEquipo(idEquipo);
    let nombreEquipo = "";

    if (dataEquipo != null) {
        nombreEquipo = dataEquipo.data().Nombre_completo;
    }

    const snap = await getDocs(consulta);

    if (snap.docs.length > 0) {

        snap.forEach(doc => {
            jj = jj + parseFloat(doc.data().jj);
            tt = tt + parseFloat(doc.data().tt);
            tl = tl + parseFloat(doc.data().tl);
            ht = ht + parseFloat(doc.data().ht);
            h1 = h1 + parseFloat(doc.data().h1);
            h2 = h2 + parseFloat(doc.data().h2);
            h3 = h3 + parseFloat(doc.data().h3);
            h4 = h4 + parseFloat(doc.data().h4);
            hr = hr + parseFloat(doc.data().hr);
            runs = runs + parseFloat(doc.data().runs);
            bo = bo + parseFloat(doc.data().bo);
            g = g + parseFloat(doc.data().g);
            s = s + parseFloat(doc.data().s);
            bb = bb + parseFloat(doc.data().bb);
            k = k + parseFloat(doc.data().k);
            avg = avg + parseFloat(doc.data().avg);
        });

        avg = avg / snap.docs.length;

        const docRef = await addDoc(collection(db, "Client_Stat_Equipos"), {
            nombre: nombreEquipo,
            temporada: idTemporada,
            categoria: idCategoria,
            equipo: idEquipo,
            jj: jj,
            tt: tt,
            tl: tl,
            ht: ht,
            h1: h1,
            h2: h2,
            h3: h3,
            h4: h4,
            hr: hr,
            runs: runs,
            bo: bo,
            g: g,
            s: s,
            bb: bb,
            k: k,
            avg: avg
        });
    }

}

const recalcularStatPersonaBateo = async (idTemporada, idCategoria, idPersona) => {
    const consulta = query(collection(db, "Stat_Personas"),
        where("temporada", "==", idTemporada),
        where("categoria", "==", idCategoria),
        where("persona", "==", idPersona),
        where("rol", "==", "bateo"),
    );

    let jj = 0,
        tt = 0,
        tl = 0,
        ht = 0,
        h1 = 0,
        h2 = 0,
        h3 = 0,
        h4 = 0,
        hr = 0,
        runs = 0,
        bo = 0,
        g = 0,
        s = 0,
        bb = 0,
        k = 0,
        avg = 0.0;
    let nombrePersona = "";
    let dataPersona = await getDataJugador(idPersona);
    let nombreEquipo = "";


    if (dataPersona.equipo_actual != "") {
        let dataEquipo = await getEquipo(dataPersona.equipo_actual);
        nombreEquipo = dataEquipo.data().Nombre_completo;
    }


    const snap = await getDocs(consulta);

    if (snap.docs.length > 0) {

        await Promise.all(snap.docs.map(async (documento) => {

            nombrePersona = documento.data().nombre;
            jj = jj + parseFloat(documento.data().jj);
            tt = tt + parseFloat(documento.data().tt);
            tl = tl + parseFloat(documento.data().tl);
            ht = ht + parseFloat(documento.data().ht);
            h1 = h1 + parseFloat(documento.data().h1);
            h2 = h2 + parseFloat(documento.data().h2);
            h3 = h3 + parseFloat(documento.data().h3);
            h4 = h4 + parseFloat(documento.data().h4);
            hr = hr + parseFloat(documento.data().hr);
            runs = runs + parseFloat(documento.data().runs);
            bo = bo + parseFloat(documento.data().bo);
            g = g + parseFloat(documento.data().g);
            s = s + parseFloat(documento.data().s);
            bb = bb + parseFloat(documento.data().bb);
            k = k + parseFloat(documento.data().k);
            avg = avg + parseFloat(documento.data().avg);

        }));

        // snap.forEach(doc => {
        //     nombrePersona = doc.data().nombre;
        //     jj = jj + parseFloat(doc.data().jj);
        //     tt = tt + parseFloat(doc.data().tt);
        //     tl = tl + parseFloat(doc.data().tl);
        //     ht = ht + parseFloat(doc.data().ht);
        //     h1 = h1 + parseFloat(doc.data().h1);
        //     h2 = h2 + parseFloat(doc.data().h2);
        //     h3 = h3 + parseFloat(doc.data().h3);
        //     h4 = h4 + parseFloat(doc.data().h4);
        //     hr = hr + parseFloat(doc.data().hr);
        //     runs = runs + parseFloat(doc.data().runs);
        //     bo = bo + parseFloat(doc.data().bo);
        //     g = g + parseFloat(doc.data().g);
        //     s = s + parseFloat(doc.data().s);
        //     bb = bb + parseFloat(doc.data().bb);
        //     k = k + parseFloat(doc.data().k);
        //     avg = avg + parseFloat(doc.data().avg);
        // });

        // Para calcular AVG es la suma HT / TL
        avg = ht / tl;
        // avg = avg / snap.docs.length;

        const docRef = await addDoc(collection(db, "Client_Stat_Personas"), {
            nombre: nombrePersona,
            temporada: idTemporada,
            categoria: idCategoria,
            persona: idPersona,
            rol: "bateo",
            equipo_actual: dataPersona.equipo_actual,
            nombre_equipo: nombreEquipo,
            jj: jj,
            tt: tt,
            tl: tl,
            ht: ht,
            h1: h1,
            h2: h2,
            h3: h3,
            h4: h4,
            hr: hr,
            runs: runs,
            bo: bo,
            g: g,
            s: s,
            bb: bb,
            k: k,
            avg: avg
        });

    }
}

const recalcularStatPersonaPitcheo = async (idTemporada, idCategoria, idPersona, valorCategoria) => {
    try {
        const consulta = query(collection(db, "Stat_Personas"),
            where("temporada", "==", idTemporada),
            where("categoria", "==", idCategoria),
            where("persona", "==", idPersona),
            where("rol", "==", "pitcheo"),
        );

        let jj = 0,
            w = 0,
            l = 0,
            ip = 0,
            bt = 0,
            ht = 0,
            hr = 0,
            bb = 0,
            k = 0,
            g = 0,
            cp = 0,
            cl = 0,
            era = 0;
        let nombrePersona = "";
        let dataPersona = await getDataJugador(idPersona);

        let nombreEquipo = "";


        if (dataPersona.equipo_actual != "") {
            let dataEquipo = await getEquipo(dataPersona.equipo_actual);
            nombreEquipo = dataEquipo.data().Nombre_completo;
        }


        const snap = await getDocs(consulta);

        if (snap.docs.length > 0) {

            await Promise.all(snap.docs.map(async (documento) => {

                nombrePersona = documento.data().nombre;
                jj = jj + parseFloat(documento.data().jj);
                w = w + parseFloat(documento.data().w);
                l = l + parseFloat(documento.data().l);
                ip = ip + parseFloat(documento.data().ip);
                bt = bt + parseFloat(documento.data().bt);
                ht = ht + parseFloat(documento.data().ht);
                hr = hr + parseFloat(documento.data().hr);
                bb = bb + parseFloat(documento.data().bb);
                k = k + parseFloat(documento.data().k);
                g = g + parseFloat(documento.data().g);
                cp = cp + parseFloat(documento.data().cp);
                cl = cl + parseFloat(documento.data().cl);
                era = era + parseFloat(documento.data().era);

            }));

            // snap.forEach(doc => {
            //     nombrePersona = doc.data().nombre;
            //     jj = jj + parseFloat(doc.data().jj);
            //     w = w + parseFloat(doc.data().w);
            //     l = l + parseFloat(doc.data().l);
            //     ip = ip + parseFloat(doc.data().ip);
            //     bt = bt + parseFloat(doc.data().bt);
            //     ht = ht + parseFloat(doc.data().ht);
            //     hr = hr + parseFloat(doc.data().hr);
            //     bb = bb + parseFloat(doc.data().bb);
            //     k = k + parseFloat(doc.data().k);
            //     g = g + parseFloat(doc.data().g);
            //     cp = cp + parseFloat(doc.data().cp);
            //     cl = cl + parseFloat(doc.data().cl);
            //     era = era + parseFloat(doc.data().era);
            // });

            // Calcular ERA es la suma de ( CL * valorCategoria ) / IP
            era = (cl * valorCategoria) / ip;
            if (isNaN(era) || !isFinite(era))
                era = 0;
            // era = era / snap.docs.length;

            const docRef = await addDoc(collection(db, "Client_Stat_Personas"), {
                nombre: nombrePersona,
                temporada: idTemporada,
                categoria: idCategoria,
                persona: idPersona,
                rol: "pitcheo",
                equipo_actual: dataPersona.equipo_actual,
                nombre_equipo: nombreEquipo,
                jj: jj,
                w: w,
                l: l,
                ip: ip,
                bt: bt,
                ht: ht,
                hr: hr,
                bb: bb,
                k: k,
                g: g,
                cp: cp,
                cl: cl,
                era: era
            });

        }

    } catch (e) {
        console.error(e);
    }
}

const addStatEquipo = async (datos) => {
    try {
        if (datos.rol == "bateo") {
            const docRef = await addDoc(collection(db, "Stat_Equipos"), {
                compilacion: datos.compilacion,
                temporada: datos.temporada,
                categoria: datos.categoria,
                rol: datos.rol,
                equipo: datos.equipo,
                jj: datos.jj,
                tt: datos.tt,
                tl: datos.tl,
                ht: datos.ht,
                h1: datos.h1,
                h2: datos.h2,
                h3: datos.h3,
                h4: datos.h4,
                hr: datos.hr,
                runs: datos.runs,
                bo: datos.bo,
                g: datos.g,
                s: datos.s,
                bb: datos.bb,
                k: datos.k,
                avg: datos.avg
            });

        } else if (datos.rol == "pitcheo") {
            const docRef = await addDoc(collection(db, "Stat_Equipos"), {
                compilacion: datos.compilacion,
                temporada: datos.temporada,
                categoria: datos.categoria,
                rol: datos.rol,
                equipo: datos.equipo,
                jj: datos.jj,
                w: datos.w,
                l: datos.l,
                ip: datos.ip,
                bt: datos.bt,
                ht: datos.ht,
                hr: datos.hr,
                bb: datos.bb,
                k: datos.k,
                g: datos.g,
                cp: datos.cp,
                cl: datos.cl,
                era: datos.era
            });
        }
    } catch (e) {

    }
}


const addStatPersona = async (datos) => {
    try {

        if (datos.rol == "bateo") {
            const docRef = await addDoc(collection(db, "Stat_Personas"), {
                compilacion: datos.compilacion,
                nombre: datos.nombre,
                temporada: datos.temporada,
                categoria: datos.categoria,
                persona: datos.persona,
                rol: datos.rol,
                equipo_compilado: datos.equipo_compilado,
                equipo_actual: datos.equipo_actual,
                jj: datos.jj,
                tt: datos.tt,
                tl: datos.tl,
                ht: datos.ht,
                h1: datos.h1,
                h2: datos.h2,
                h3: datos.h3,
                h4: datos.h4,
                hr: datos.hr,
                runs: datos.runs,
                bo: datos.bo,
                g: datos.g,
                s: datos.s,
                bb: datos.bb,
                k: datos.k,
                avg: datos.avg
            });
        } else if (datos.rol == "pitcheo") {
            const docRef = await addDoc(collection(db, "Stat_Personas"), {
                compilacion: datos.compilacion,
                nombre: datos.nombre,
                temporada: datos.temporada,
                categoria: datos.categoria,
                persona: datos.persona,
                rol: datos.rol,
                equipo_compilado: datos.equipo_compilado,
                equipo_actual: datos.equipo_actual,
                jj: datos.jj,
                w: datos.w,
                l: datos.l,
                ip: datos.ip,
                bt: datos.bt,
                ht: datos.ht,
                hr: datos.hr,
                bb: datos.bb,
                k: datos.k,
                g: datos.g,
                cp: datos.cp,
                cl: datos.cl,
                era: datos.era
            });
        }

        return "1";
    } catch (e) {
        console.log(e);
        return e;

    }
}

// SECCION STANDING
const verificarEquipoStanding = async (idCompilacion, idEquipo) => {
    const consulta = query(collection(db, "Standing"),
        where("compilacion", "==", idCompilacion),
        where("equipo", "==", idEquipo)
    );

    const documentSnapshot = await getDocs(consulta);

    if (documentSnapshot.docs.length > 0) {
        return documentSnapshot;
    } else {
        return null;
    }
}

const verificarEquipoClientStanding = async (idEquipo, idTemporada, idCategoria) => {
    const consulta = query(collection(db, "Client_Standing"),
        where("temporada", "==", idTemporada),
        where("categoria", "==", idCategoria),
        where("equipo", "==", idEquipo)
    );

    const resultado = await getDocs(consulta);

    if (resultado.docs.length > 0) {
        return resultado;
    } else {
        return null;
    }
}

const actualizarEquipoStanding = async (idStanding, resultado, tca_, tcr_) => {
    const docRef = doc(db, "Standing", idStanding);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        try {
            await updateDoc(docRef, {
                resultado: resultado,
                tca: tca_,
                tcr: tcr_
            });
            return { response: "1", result: "Standing Actualizado" };
        } catch (e) {
            return { response: "0", result: e };
        }


    } else {
        return { response: "0", result: "No se encontró registro standing" };
    }
}

const registroEquipoStanding = async (datos) => {
    try {
        const docRef = await addDoc(collection(db, "Standing"), {
            compilacion: datos.compilacion,
            equipo: datos.equipo,
            temporada: datos.temporada,
            categoria: datos.categoria,
            grupo: datos.grupo,
            resultado: datos.resultado,
            tca: datos.tca,
            tcr: datos.tcr,
            fecha_registro: Timestamp.now()
        });
        return { response: "1", result: "Standing Registrado" };
    } catch (e) {
        return { response: "0", result: e };
    }
}

const leerEquipoStanding = async (idEquipo, idGrupo, idTemporada, idCategoria) => {

    try {
        let jj = 0;
        let t = 0;
        let d = 0;
        let empate = 0;
        let pct = 0;
        let tca = 0;
        let tcr = 0;
        let dif = 0;

        const docRef = query(collection(db, "Standing"),
            where("equipo", "==", idEquipo)
        );
        const snap = await getDocs(docRef);

        if (snap.docs.length > 0) {
            jj = snap.docs.length;
            await Promise.all(snap.docs.map(async (documento) => {
                switch (documento.data().resultado) {
                    case "triunfo":
                        t++;
                        break;

                    case "derrota":
                        d++;
                        break;

                    case "empate":
                        empate++;
                        break;
                }

                if (documento.data().tca != undefined) {
                    tca = tca + parseInt(documento.data().tca, 10);
                }

                if (documento.data().tcr != undefined) {
                    tcr = tcr + parseInt(documento.data().tcr, 10);
                }
            }));


            // pct = parseFloat(t / jj).toFixed(3);
            pct = parseFloat(t / (t + d)).toFixed(3);
            dif = tca - tcr;

            // Validar si el equipo existe en Client_Standing
            let validacionClientStanding = await verificarEquipoClientStanding(idEquipo, idTemporada, idCategoria);
            if (validacionClientStanding != null) {
                // Equipo existe en la tabla.
                // Se actualizara el registro.
                const docRef = doc(db, "Client_Standing", validacionClientStanding.docs[0].id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    try {
                        await updateDoc(docRef, {
                            jj: jj,
                            t: t,
                            d: d,
                            e: empate,
                            pct: pct,
                            tca: parseInt(tca, 10),
                            tcr: parseInt(tcr, 10),
                            dif: dif
                        });
                        return { response: "1", result: "Clients Standing Actualizado" };
                    } catch (e) {
                        return { response: "0", result: e };
                    }


                } else {
                    return { response: "0", result: "No se encontró id en el Client Standing" };
                }

            } else {
                // Equipo no existe en la tabla.
                // Se hara nuevo registro en client standing
                try {
                    const docRef = await addDoc(collection(db, "Client_Standing"), {
                        equipo: idEquipo,
                        temporada: idTemporada,
                        categoria: idCategoria,
                        grupo: idGrupo,
                        jj: jj,
                        t: t,
                        d: d,
                        e: empate,
                        pct: pct,
                        tca: parseInt(tca, 10),
                        tcr: parseInt(tcr, 10),
                        dif: dif
                    });
                    return { response: "1", result: "Client Standing Registrado" };
                } catch (e) {
                    return { response: "0", result: e };
                }
            }

        } else {
            return { response: "0", result: "No se encontró ningun equipo en Standing" };
        }

    } catch (e) {
        return { response: "0", result: e };
    }

}

const leerGrupoEquipo = async (idEquipo) => {
    const consulta = query(collection(db, "Grupos"),
        where("Equipos", "array-contains", idEquipo)
    );
    const documentSnapshot = await getDocs(consulta);

    if (documentSnapshot.docs.length > 0) {
        return documentSnapshot.docs[0].id;
    } else {
        return null;
    }
}

const VerificarPartidaDominio = async (equipoA, equipoB) => {
    let consulta = query(collection(db, "Compilacion"),
        where("equipo_local", "==", equipoA),
        where("equipo_visita", "==", equipoB)
    );

    let consulta_alt = query(collection(db, "Compilacion"),
        where("equipo_local", "==", equipoB),
        where("equipo_visita", "==", equipoA)
    );

    let response = await getDocs(consulta);
    let response_alt = await getDocs(consulta_alt);
    let PartidaCompilacion;

    await Promise.all([response, response_alt]).then((values) => {

        if (values[0].docs.length > 0) {
            PartidaCompilacion = values[0];
        } else if (values[1].docs.length > 0) {
            PartidaCompilacion = values[1];
        } else
            PartidaCompilacion = null;

    });

    return PartidaCompilacion;

    // if (response.docs.length > 0) {
    //     console.log("si");
    //     return response;
    // }




    // if (response.docs.length > 0) {
    //     return response;
    // }

    // console.log("No hay nada");
    // return null;
}

const Ordenar_Por_Dominio = (Compilacion = null) => {

    if (Compilacion != null) {
        let equipos = [];

        if (Compilacion.data().carreras_equipo_local > Compilacion.data().carreras_equipo_visita) {
            equipos.push(Compilacion.data().equipo_local);
            equipos.push(Compilacion.data().equipo_visita);
        } else {
            equipos.push(Compilacion.data().equipo_visita);
            equipos.push(Compilacion.data().equipo_local);
        }
        return equipos
    }
}

const Obtener_Posicion_Por_Diferencia_Carrera = async (Equipos) => {

    await Promise.all(Equipos.map(async (equipo) => {
        console.log(equipo.idEquipo);
    }));

}

const Ordenar_Diferencia_Carrera = (Equipos) => {
    return Equipos.sort((p1, p2) => (p1.dif < p2.dif) ? 1 : (p1.dif > p2.dif) ? -1 : 0);
}

export {
    crear,
    actualizar,
    leer,
    eliminar,
    obtener,
    obtenerProgramacion,
    updateProgramacion,
    paginaSiguiente,
    paginaAnterior,
    ListaProgramacion,
    ListaDetalleProgramacion,
    ListaTemporadas,
    ListaCategorias,
    ListaEquipos,
    ListaJugadores,
    ListaJugadoresBaja,
    ListaJugadoresBajaGeneral,
    NumeroJugador,
    getTemporada,
    getCategoria,
    getMultiplicadorCategoria,
    getEquipo,
    addStatPersona,
    addStatEquipo,
    eliminarStatPersona,
    limpiarStatCompilacion,
    limpiarEquipoStatCompilacion,
    eliminarClientStatPersona,
    getDataJugador,
    recalcularStatPersonaBateo,
    recalcularStatPersonaPitcheo,
    recalculcarClientStatEquipo,
    limpiarClientStatEquipos,
    verificarEquipoStanding,
    actualizarEquipoStanding,
    registroEquipoStanding,
    leerGrupoEquipo,
    leerEquipoStanding,
    auth,
    onAuthStateChanged,
    VerificarPartidaDominio,
    Obtener_Posicion_Por_Diferencia_Carrera,
    Ordenar_Diferencia_Carrera,
    Ordenar_Por_Dominio
};