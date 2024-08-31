import { auth, onAuthStateChanged, db, collection, query, where, doc, getDoc, getDocs, limit, startAfter, endBefore, orderBy, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc, storage, ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "../firebaseCore.js";

// Dar de alta a persona nueva //
const Registrar = async(datos) => {
    try {

        const docRef = await addDoc(collection(db, "Personas"), {
            Nombre_completo: datos.nombreCompleto,
            Nombre_corto: datos.nombreCorto,
            Temporada_actual: datos.temporadaActual,
            Categoria_actual: datos.categoriaActual,
            Equipo_actual: datos.equipoActual,
            Fecha_nacimiento: datos.fechaNacimiento,
            Curp: datos.curp,
            Tipo_persona: datos.tipoPersona,
            Nombre_calle: datos.calle,
            Numero_casa: datos.noCasa,
            Categoria_jugador: datos.categoriajugador,
            Telefono_jugador: datos.telefonojugador,
            Edad_liga: datos.edadliga,
            Registro_asociacion: datos.registroasociacion,
            Equipo_origen: datos.equipoorigen,
            Observacion_jugador: datos.observacionjugador,
            Colonia: datos.colonia,
            Ciudad: datos.ciudad,
            Estado: datos.estado,
            Pais: datos.pais,
            Contacto_telefono: datos.telefono,
            Contacto_email: datos.email,
            Contacto_acceso_dashboard: datos.acceso,
            Contacto_contrasena: datos.password,
            Contacto_nombre_padre: datos.nombrePadre,
            Contacto_telefono_padre: datos.telefonoPadre,
            Contacto_email_padre: datos.emailPadre,
            Contacto_nombre_madre: datos.nombreMadre,
            Contacto_telefono_madre: datos.telefonoMadre,
            Contacto_email_madre: datos.emailMadre,
            Jugador_numero_camisa: datos.numeroCamisa,
            Notas: datos.notas,
            Autor: datos.autor,
            Fecha_registro: Timestamp.now()
        });

        return docRef;
    } catch (e) {
        console.error(`Error al registrar persona: ${e}`);
        return null;
    }
}

// Actualizar datos de la persona //
const Actualizar = async(id, datos) => {
    try {

        const docRef = doc(db, "Personas", id);

        await updateDoc(docRef, {
            Nombre_completo: datos.nombreCompleto,
            Nombre_corto: datos.nombreCorto,
            Temporada_actual: datos.temporadaActual,
            Categoria_actual: datos.categoriaActual,
            Telefono_jugador: datos.telefonojugador,
            Edad_liga: datos.edadliga,
            Registro_asociacion: datos.registroasociacion,
            Equipo_origen: datos.equipoorigen,
            Observacion_jugador: datos.observacionjugador,
            Equipo_actual: datos.equipoActual,
            Fecha_nacimiento: datos.fechaNacimiento,
            Curp: datos.curp,
            Tipo_persona: datos.tipoPersona,
            Nombre_calle: datos.calle,
            Numero_casa: datos.noCasa,
            Colonia: datos.colonia,
            Ciudad: datos.ciudad,
            Estado: datos.estado,
            Pais: datos.pais,
            Contacto_telefono: datos.telefono,
            Contacto_email: datos.email,
            Contacto_acceso_dashboard: datos.acceso,
            Contacto_contrasena: datos.password,
            Contacto_nombre_padre: datos.nombrePadre,
            Contacto_telefono_padre: datos.telefonoPadre,
            Contacto_email_padre: datos.emailPadre,
            Contacto_nombre_madre: datos.nombreMadre,
            Contacto_telefono_madre: datos.telefonoMadre,
            Contacto_email_madre: datos.emailMadre,
            Jugador_numero_camisa: datos.numeroCamisa,
            Categoria_jugador: datos.categoriajugador,
            Notas: datos.notas
        });

    } catch (e) {
        console.error(`Error al actualizar persona: ${e}`);
    }
}

// Leer datos de la persona //
const Obtener = async(id) => {
    const docRef = doc(db, "Personas", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap;
    } else {
        console.error(`Error al obtener datos de la persona Message ID: ${id}`);
        return null;
    }
}

// Eliminar registro de la persona //
const Eliminar = async(id) => {
    try {
        await deleteDoc(doc(db, "Personas", id));
    } catch (e) {
        console.error(`Error al eliminar persona: ${e}`);
    }
}

// Cambiar el nombre en las estadísticas //
const Cambiar_Nombre_Estadisticas = async(idPersona = null, nombrePersona = "") => {
    if (idPersona != null) {
        // Stat_Persona //
        const consulta_stat_persona = query(collection(db, "Stat_Personas"),
            where("persona", "==", idPersona)
        );

        const snap_stat_persona =
            await getDocs(consulta_stat_persona);

        const consulta_client_stat_persona =
            query(collection(db, "Client_Stat_Personas"),
                where("persona", "==", idPersona)
            );

        const snap_client_stat_persona =
            await getDocs(consulta_client_stat_persona);

        // Aplicar cambios en Stat_Personas //
        await Promise.all(snap_stat_persona.docs.map(async(documento) => {
            try {

                let referencia = doc(db, "Stat_Personas", documento.id);

                await updateDoc(referencia, {
                    nombre: nombrePersona
                });

            } catch (e) {
                console.error(`Error al actualizar en Stat Persona la persona ${documento.data().nombre}. Message: ${e}`);
            }
        }));

        // Aplicar cambios en Client_Stat_Personas
        await Promise.all(snap_client_stat_persona.docs.map(async(documento) => {
            try {
                let referencia = doc(db, "Client_Stat_Personas", documento.id);

                await updateDoc(referencia, {
                    nombre: nombrePersona
                });

            } catch (e) {
                console.error(`Error al actualizar en Client Stat la persona ${documento.data().nombre}. Message: ${e}`);
            }
        }));

    }

}

// Dar de baja Jugador //
const Baja_Jugador = async(idJugador) => {
    const query = doc(db, "Personas", idJugador);

    try {

        const response = await updateDoc(query, {
            Temporada_actual: "",
            Categoria_actual: "",
            Equipo_actual: ""
        });

        return response;

    } catch (e) {
        console.error(`Error al dar de baja al jugador en bitacora: ${e}`);
        return null;
    }
}

// Dar de alta Jugador //
const Alta_Jugador = async(idJugador, idTemporada, idCategoria, idEquipo) => {
    const query = doc(db, "Personas", idJugador);

    try {

        let response = await updateDoc(query, {
            Temporada_actual: idTemporada,
            Categoria_actual: idCategoria,
            Equipo_actual: idEquipo
        });

        return response;

    } catch (e) {
        console.error(`Error al dar de alta jugador ${e}`);
        return null;
    }
}

export {
    Registrar,
    Actualizar,
    Obtener,
    Eliminar,
    Cambiar_Nombre_Estadisticas,
    Baja_Jugador,
    Alta_Jugador
}