import {
    crear,
    actualizar,
    eliminar,
    obtener,
    obtenerProgramacion,
    ListaProgramacion,
    ListaDetalleProgramacion,
    ListaTemporadas,
    ListaCategorias,
    ListaEquipos,
    ListaJugadores,
    ListaJugadoresBaja,
    ListaJugadoresBajaGeneral,
    updateProgramacion,
    NumeroJugador,
    getTemporada,
    getCategoria,
    getMultiplicadorCategoria,
    getEquipo,
    auth,
    onAuthStateChanged,
    leer,
    addStatPersona,
    addStatEquipo,
    limpiarStatCompilacion,
    limpiarEquipoStatCompilacion,
    eliminarClientStatPersona,
    recalcularStatPersonaBateo,
    recalcularStatPersonaPitcheo,
    limpiarClientStatEquipos,
    recalculcarClientStatEquipo,
    verificarEquipoStanding,
    actualizarEquipoStanding,
    registroEquipoStanding,
    leerGrupoEquipo,
    leerEquipoStanding,
    getDataJugador
} from "./corecompilacion.js";

const campoTitulo = document.getElementById("input_titulo");
const selectProgramacion = document.getElementById("selectProgramacion");
const selectCategoria = document.getElementById("selectCategoria");
const selectJuego = document.getElementById("selectJuego");
const wrapperSeleccionEquipo = document.getElementById("wrapperSeleccionEquipo");
const formulario = document.getElementById("ld_formulario");
const btnSalirScorebook = document.getElementById("btn_salirScorebook");
const labelTemporada = document.getElementById("label_temporada");
const labelCategoria = document.getElementById("label_categoria");
const labelJuego = document.getElementById("label_juego");


let selectEquipo = document.getElementById("selectEquipos");
let btnAgregarJugador = document.getElementById("btnAgregarJugador");
let tbodyBateo = document.getElementById("tbody-bateo");
let trTotalBateo = document.getElementById("totalBateo");
let rowcontrolAgregarJugadorBateo = document.getElementById("rowControlAgregarJugadorBateo");
// let contenedorToast = document.getElementById("toastPlacement");

let tbodyPitcheo = document.getElementById("tbody-pitcheo");
let btnAgregarJugadorPitcheo = document.getElementById("btnAgregarJugadorPitcheo");
let rowAgregarJugadorPitcheo = document.getElementById("rowControlAgregarJugadorPitcheo");
let btnGuardarScorebook = document.getElementById("btn_scorebookGuardar")
let btnRegresarScorebook = document.getElementById("btn_scorebookRegresar")
let btnGuardarCompilacion = document.getElementById("btn_submitScorebook");

let totalBateoJJ = document.getElementById("totalBateoJJ");
let totalBateoTT = document.getElementById("totalBateoTT");
let totalBateoTL = document.getElementById("totalBateoTL");
let totalBateoHT = document.getElementById("totalBateoHT");
let totalBateoH1 = document.getElementById("totalBateoH1");
let totalBateoH2 = document.getElementById("totalBateoH2");
let totalBateoH3 = document.getElementById("totalBateoH3");
let totalBateoH4 = document.getElementById("totalBateoH4");
let totalBateoHR = document.getElementById("totalBateoHR");
let totalBateoRuns = document.getElementById("totalBateoRuns");
let totalBateoBO = document.getElementById("totalBateoBO");
let totalBateoG = document.getElementById("totalBateoG");
let totalBateoS = document.getElementById("totalBateoS");
let totalBateoBB = document.getElementById("totalBateoBB");
let totalBateoK = document.getElementById("totalBateoK");
let totalBateoAVG = document.getElementById("totalBateoAVG");

let totalPitcheoJJ = document.getElementById("totalPitcheoJJ");
let totalPitcheoW = document.getElementById("totalPitcheoW");
let totalPitcheoL = document.getElementById("totalPitcheoL");
let totalPitcheoIP = document.getElementById("totalPitcheoIP");
let totalPitcheoBT = document.getElementById("totalPitcheoBT");
let totalPitcheoHT = document.getElementById("totalPitcheoHT");
let totalPitcheoHR = document.getElementById("totalPitcheoHR");
let totalPitcheoBB = document.getElementById("totalPitcheoBB");
let totalPitcheoK = document.getElementById("totalPitcheoK");
let totalPitcheoG = document.getElementById("totalPitcheoG");
let totalPitcheoCP = document.getElementById("totalPitcheoCP");
let totalPitcheoCL = document.getElementById("totalPitcheoCL");
let totalPitcheoERA = document.getElementById("totalPitcheoERA");

let temporadaSeleccionado = null;
let categoriaSeleccionada = null;
let scoreBookLocal = null;
let carrerasLocal = null;
let nombreEquipoLocal = "";
let idEquipoLocal = "";
let nombreEquipoVisita = "";
let scoreBookVisitante = null;
let carrerasVisita = null;
let idEquipoVisita = "";
let logo_equipo_local = null;
let logo_equipo_visita = null;
let jugadores = null;
let jugadores_baja = null;
let jugadores_baja_general = null;
let modo = "";
let id = "";
let id_programacion = "";
let edit_temporada = "";
let edit_categoria = "";
let edit_juego = "";
let edit_compilacion = "";
let programacionSel;
let fecha_juegoProgramacion = null;
let userId = null;
let multiplicadorModalidad = null;
let infraccion_local = null;
let infraccion_visita = null;

let stats_jugadores_porEliminar = [];

document.addEventListener("DOMContentLoaded", async () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // await ObtenerProgramaciones();
            await cargaInicialScorebook(new URLSearchParams(location.search));
            userId = user.uid;

            // ObtenTemporadas();
        } else {
            window.location.replace('/Login.html');
        }
    });

});

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnGuardarCompilacion.disabled = true;
    btnGuardarCompilacion.innerHTML = "Guardando...";
    let response;
    let infraccionLocal = document.getElementById("switch_infraccionLocal").checked;
    let infraccionVisita = document.getElementById("switch_infraccionVisita").checked;
    let carreras_local = 0;
    let carreras_visita = 0;

    const dataFormulario = {
        nombre: "",
        programacion: id_programacion,
        temporada: edit_temporada,
        categoria: edit_categoria,
        partida: edit_juego,
        fecha_partida: fecha_juegoProgramacion,
        scorebook_local: scoreBookLocal,
        carreras_local: carrerasLocal,
        nombreLocal: nombreEquipoLocal,
        idLocal: idEquipoLocal,
        logo_local: logo_equipo_local,
        scorebook_visita: scoreBookVisitante,
        carreras_visita: carrerasVisita,
        logo_visita: logo_equipo_visita,
        nombreVisita: nombreEquipoVisita,
        idVisita: idEquipoVisita,
        usuario: userId,
        infraccion_local: infraccionLocal,
        infraccion_visita: infraccionVisita
    };

    if (scoreBookLocal != null) {
        carreras_local = scoreBookLocal.bateo.resultados[0].runs;
    }

    if (scoreBookVisitante != null) {
        carreras_visita = scoreBookVisitante.bateo.resultados[0].runs;
    }

    let dataStanding = calcularDatosStanding(parseInt(carreras_local), parseInt(carreras_visita), infraccionLocal, infraccionVisita);

    
    if (id == "") {
        // Registro nuevo de compilacion
        response = await crear(dataFormulario);

        if (response.response == "1") {
            let response_update = await updateProgramacion(id_programacion, response.result, edit_categoria, edit_juego);

            if (response_update == "1") {

                // Registro de Standing //
                await registroStanding(dataStanding, response.result, carreras_local, carreras_visita);
                // Agregar stats de personas //
                await agregarStats(response.result);


                window.location.replace('../ProgramacionJuegos.html');
            } else {
                alert(`Error al asignar compilacion en la programacion: ${response_update}`);
                return;
            }
        } else {
            alert(`Error al crear compilación: ${response.result}`);
            return;
        }

    } else {
        // Edición de compilación
        // notificarToast("Actualizando");
        response = await actualizar(dataFormulario, id);

        if (response.response == "1") {

            // Registro de Standing //
            await registroStanding(dataStanding, id, carreras_local, carreras_visita);

            await agregarStats(id);

            
            window.location.replace('../ProgramacionJuegos.html');
        } else {
            alert(`Error al actualizar compilacion: ${response.result}`);
        }
    }

    btnGuardarCompilacion.disabled = false;
    btnGuardarCompilacion.innerHTML = "Guardar";

});

const calcularDatosStanding = (runsLocal, runsVisita, infraccionLocal, infraccionVisita) => {
    let resultados = null;

    if (infraccionLocal == false && infraccionVisita == false) {
        // No hay infracciones
        // Se hace validacion por carreras.
        if (runsLocal > runsVisita) {
            // Equipo Local obtiene un triunfo
            // Equipo Visita obtiene una derrota
            resultados = [{
                equipo: idEquipoLocal,
                nombre_equipo: nombreEquipoLocal,
                resultado: "triunfo"
            },
            {
                equipo: idEquipoVisita,
                nombre_equipo: nombreEquipoVisita,
                resultado: "derrota"
            }
            ];
        } else if (runsLocal < runsVisita) {
            // Equipo Local obtiene un derrota
            // Equipo Visita obtiene una triunfo
            resultados = [{
                equipo: idEquipoLocal,
                nombre_equipo: nombreEquipoLocal,
                resultado: "derrota"
            },
            {
                equipo: idEquipoVisita,
                nombre_equipo: nombreEquipoVisita,
                resultado: "triunfo"
            }
            ];
        } else if (runsLocal == runsVisita) {
            // Ambos equipos obtienen un empate
            resultados = [{
                equipo: idEquipoLocal,
                nombre_equipo: nombreEquipoLocal,
                resultado: "empate"
            },
            {
                equipo: idEquipoVisita,
                nombre_equipo: nombreEquipoVisita,
                resultado: "empate"
            }
            ];
        }


    } else if (infraccionLocal == true && infraccionVisita == false) {
        // Triunfo para equipo visita por infracción equipo local
        resultados = [{
            equipo: idEquipoLocal,
            nombre_equipo: nombreEquipoLocal,
            resultado: "derrota"
        },
        {
            equipo: idEquipoVisita,
            nombre_equipo: nombreEquipoVisita,
            resultado: "triunfo"
        }
        ];
    } else if (infraccionLocal == false && infraccionVisita == true) {
        // Triunfo para equipo local por infracción equipo visita
        resultados = [{
            equipo: idEquipoLocal,
            nombre_equipo: nombreEquipoLocal,
            resultado: "triunfo"
        },
        {
            equipo: idEquipoVisita,
            nombre_equipo: nombreEquipoVisita,
            resultado: "derrota"
        }
        ];
    } else if (infraccionLocal == true && infraccionVisita == true) {
        // Empate por Infraccion en ambos equipos
        resultados = [{
            equipo: idEquipoLocal,
            nombre_equipo: nombreEquipoLocal,
            resultado: "derrota"
        },
        {
            equipo: idEquipoVisita,
            nombre_equipo: nombreEquipoVisita,
            resultado: "derrota"
        }
        ];
    }
    return resultados;


}

const registroStanding = async (equipos, idCompilacion, scoreLocal, scoreVisita) => {
    await Promise.all(equipos.map(async (Equipo) => {

        let equipoStanding = await verificarEquipoStanding(idCompilacion, Equipo.equipo);

        if (equipoStanding == null) {
            // Registro de nuevo standing //
            let dataStanding = null;
            let queryGrupo = await leerGrupoEquipo(Equipo.equipo);
            let idGrupo = queryGrupo == null ? "" : queryGrupo;

            if (Equipo.equipo == idEquipoLocal) {
                dataStanding = {
                    compilacion: idCompilacion,
                    equipo: Equipo.equipo,
                    temporada: edit_temporada,
                    categoria: edit_categoria,
                    grupo: idGrupo,
                    resultado: Equipo.resultado,
                    tca: scoreLocal,
                    tcr: scoreVisita
                };
            } else if (Equipo.equipo == idEquipoVisita) {
                dataStanding = {
                    compilacion: idCompilacion,
                    equipo: Equipo.equipo,
                    temporada: edit_temporada,
                    categoria: edit_categoria,
                    grupo: idGrupo,
                    resultado: Equipo.resultado,
                    tca: scoreVisita,
                    tcr: scoreLocal
                };
            }

            let registro = await registroEquipoStanding(dataStanding);

            if (registro.response == "1") {

                let responseClientStanding = await leerEquipoStanding(Equipo.equipo, idGrupo, edit_temporada, edit_categoria);
                if (responseClientStanding.response == "1") {
                    console.log(responseClientStanding.result);
                } else {
                    alert(responseClientStanding.result);
                }

            } else {
                console.error(registro.result);
            }


        } else {
            // Ya existe un registro de este equipo en standing
            // Se modificara su resultado
            let actualizar = null;

            if (Equipo.equipo == idEquipoLocal) {
                actualizar = await actualizarEquipoStanding(equipoStanding.docs[0].id, Equipo.resultado, scoreLocal, scoreVisita);
            } else if (Equipo.equipo == idEquipoVisita) {
                actualizar = await actualizarEquipoStanding(equipoStanding.docs[0].id, Equipo.resultado, scoreVisita, scoreLocal);
            }


            if (actualizar.response == "1") {

                let responseClientStanding = await leerEquipoStanding(Equipo.equipo, equipoStanding.docs[0].data().grupo, equipoStanding.docs[0].data().temporada, equipoStanding.docs[0].data().categoria);
                if (responseClientStanding.response == "1") {
                    console.log(responseClientStanding.result);
                } else {
                    alert(responseClientStanding.result);
                }

            } else {
                alert(actualizar.result);
                console.error(actualizar.result);
            }


        }


    }));
}

const agregarStats = async (idCompilacion) => {
    // let perf0 = performance.now();
    // Limpiar Stats //
    // let t0 = performance.now();
    // console.log("Eliminando estádisticas individuales de los jugadores...");
    await limpiarStatCompilacion(idCompilacion); // Eliminar estádisticas de la persona
    // let t1 = performance.now();
    // console.log(`Proceso de eliminación individual finalizado! (${t1 - t0})`);

    // console.log("Eliminando estádisticas del equipo...");
    // t0 = performance.now();
    await limpiarEquipoStatCompilacion(idCompilacion); // Elimina estadísticas del equipo
    // t1 = performance.now();
    // console.log(`Proceso de eliminación de estádisticas de equipo finalizado! (${t1 - t0})`);

    // EQUIPO LOCAL
    btnGuardarCompilacion.innerHTML = "Guardando... (Registrando Equipo Local)";
    if (scoreBookLocal != null) {
        // Bateo //
        // console.log("Inicia bucle general de registro de estádisticas (bateo)");
        // let tg0 = performance.now();

        // let t0 = performance.now();
        // console.log("Inicio de Registro Bateadores LOCAL...");
        await Promise.all(scoreBookLocal.bateo.jugadores.map(async (jugadorBateador) => {

            if (jugadorBateador.jugador != "") {

                let nombreJugador = await getDataJugador(jugadorBateador.jugador);

                const data = {
                    compilacion: idCompilacion,
                    nombre: nombreJugador.nombre,
                    temporada: edit_temporada,
                    categoria: edit_categoria,
                    persona: jugadorBateador.jugador,
                    rol: "bateo",
                    equipo_compilado: idEquipoLocal,
                    equipo_actual: nombreJugador.equipo_actual,
                    jj: jugadorBateador.jj,
                    tt: jugadorBateador.tt,
                    tl: jugadorBateador.tl,
                    ht: jugadorBateador.ht,
                    h1: jugadorBateador.h1,
                    h2: jugadorBateador.h2,
                    h3: jugadorBateador.h3,
                    h4: jugadorBateador.h4,
                    hr: jugadorBateador.hr,
                    runs: jugadorBateador.runs,
                    bo: jugadorBateador.bo,
                    g: jugadorBateador.g,
                    s: jugadorBateador.s,
                    bb: jugadorBateador.bb,
                    k: jugadorBateador.k,
                    avg: jugadorBateador.avg
                };

                await addStatPersona(data);

                // Recalcular total stats del jugador //
                await eliminarClientStatPersona(jugadorBateador.jugador, edit_temporada, edit_categoria, "bateo");

                await recalcularStatPersonaBateo(edit_temporada, edit_categoria, jugadorBateador.jugador);

            }

        }));
        // let t1 = performance.now();
        // console.log(`Proceso de registro de bateadores LOCAL finalizado... Resultado: ${ t1 - t0 }`);


        // for (let i = 0; i < scoreBookLocal.bateo.jugadores.length; i++) {

        //     if (scoreBookLocal.bateo.jugadores[i].jugador != "") {

        //         let nombreJugador = await getDataJugador(scoreBookLocal.bateo.jugadores[i].jugador);

        //         const data = {
        //             compilacion: idCompilacion,
        //             nombre: nombreJugador.nombre,
        //             temporada: edit_temporada,
        //             categoria: edit_categoria,
        //             persona: scoreBookLocal.bateo.jugadores[i].jugador,
        //             rol: "bateo",
        //             equipo_compilado: idEquipoLocal,
        //             equipo_actual: nombreJugador.equipo_actual,
        //             jj: scoreBookLocal.bateo.jugadores[i].jj,
        //             tt: scoreBookLocal.bateo.jugadores[i].tt,
        //             tl: scoreBookLocal.bateo.jugadores[i].tl,
        //             ht: scoreBookLocal.bateo.jugadores[i].ht,
        //             h1: scoreBookLocal.bateo.jugadores[i].h1,
        //             h2: scoreBookLocal.bateo.jugadores[i].h2,
        //             h3: scoreBookLocal.bateo.jugadores[i].h3,
        //             h4: scoreBookLocal.bateo.jugadores[i].h4,
        //             hr: scoreBookLocal.bateo.jugadores[i].hr,
        //             runs: scoreBookLocal.bateo.jugadores[i].runs,
        //             bo: scoreBookLocal.bateo.jugadores[i].bo,
        //             g: scoreBookLocal.bateo.jugadores[i].g,
        //             s: scoreBookLocal.bateo.jugadores[i].s,
        //             bb: scoreBookLocal.bateo.jugadores[i].bb,
        //             k: scoreBookLocal.bateo.jugadores[i].k,
        //             avg: scoreBookLocal.bateo.jugadores[i].avg
        //         };

        //         await addStatPersona(data);

        //         // Recalcular total stats del jugador //
        //         await eliminarClientStatPersona(scoreBookLocal.bateo.jugadores[i].jugador, edit_temporada, edit_categoria, "bateo");

        //         await recalcularStatPersonaBateo(edit_temporada, edit_categoria, scoreBookLocal.bateo.jugadores[i].jugador);

        //     }



        // }
        // let tg1 = performance.now();
        // console.log(`termina bucle general de registro de estadísticas (bateo) (${tg1 - tg0})`);

        // Pitcheo //
        // tg0 = performance.now();
        // console.log("Inicia bucle general de registro de estádisticas (pitcheo)");

        // t0 = performance.now();
        // console.log("Inicio de Registro Pitchers LOCAL...");
        await Promise.all(scoreBookLocal.pitcheo.jugadores.map(async (jugadorPitcher) => {

            if (jugadorPitcher.jugador != "") {
                let nombreJugador = await getDataJugador(jugadorPitcher.jugador);

                const data = {
                    compilacion: idCompilacion,
                    nombre: nombreJugador.nombre,
                    temporada: edit_temporada,
                    categoria: edit_categoria,
                    persona: jugadorPitcher.jugador,
                    rol: "pitcheo",
                    equipo_compilado: idEquipoLocal,
                    equipo_actual: nombreJugador.equipo_actual,
                    jj: jugadorPitcher.jj,
                    w: jugadorPitcher.w,
                    l: jugadorPitcher.l,
                    ip: jugadorPitcher.ip,
                    bt: jugadorPitcher.bt,
                    ht: jugadorPitcher.ht,
                    hr: jugadorPitcher.hr,
                    bb: jugadorPitcher.bb,
                    k: jugadorPitcher.k,
                    g: jugadorPitcher.g,
                    cp: jugadorPitcher.cp,
                    cl: jugadorPitcher.cl,
                    era: jugadorPitcher.era
                };

                await addStatPersona(data);

                // Recalcular total stats del jugador //
                await eliminarClientStatPersona(jugadorPitcher.jugador, edit_temporada, edit_categoria, "pitcheo");

                await recalcularStatPersonaPitcheo(edit_temporada, edit_categoria, jugadorPitcher.jugador, multiplicadorModalidad);
            }

        }));
        // t1 = performance.now();
        // console.log(`Proceso de registro de Pitchers LOCAL finalizado... Resultado: ${ t1 - t0 }`);
        // for (let i = 0; i < scoreBookLocal.pitcheo.jugadores.length; i++) {

        //     if (scoreBookLocal.pitcheo.jugadores[i].jugador != "") {

        //         let nombreJugador = await getDataJugador(scoreBookLocal.pitcheo.jugadores[i].jugador);
        //         const data = {
        //             compilacion: idCompilacion,
        //             nombre: nombreJugador.nombre,
        //             temporada: edit_temporada,
        //             categoria: edit_categoria,
        //             persona: scoreBookLocal.pitcheo.jugadores[i].jugador,
        //             rol: "pitcheo",
        //             equipo_compilado: idEquipoLocal,
        //             equipo_actual: nombreJugador.equipo_actual,
        //             jj: scoreBookLocal.pitcheo.jugadores[i].jj,
        //             w: scoreBookLocal.pitcheo.jugadores[i].w,
        //             l: scoreBookLocal.pitcheo.jugadores[i].l,
        //             ip: scoreBookLocal.pitcheo.jugadores[i].ip,
        //             bt: scoreBookLocal.pitcheo.jugadores[i].bt,
        //             ht: scoreBookLocal.pitcheo.jugadores[i].ht,
        //             hr: scoreBookLocal.pitcheo.jugadores[i].hr,
        //             bb: scoreBookLocal.pitcheo.jugadores[i].bb,
        //             k: scoreBookLocal.pitcheo.jugadores[i].k,
        //             g: scoreBookLocal.pitcheo.jugadores[i].g,
        //             cp: scoreBookLocal.pitcheo.jugadores[i].cp,
        //             cl: scoreBookLocal.pitcheo.jugadores[i].cl,
        //             era: scoreBookLocal.pitcheo.jugadores[i].era
        //         };

        //         await addStatPersona(data);

        //         // Recalcular total stats del jugador //
        //         await eliminarClientStatPersona(scoreBookLocal.pitcheo.jugadores[i].jugador, edit_temporada, edit_categoria, "pitcheo");

        //         await recalcularStatPersonaPitcheo(edit_temporada, edit_categoria, scoreBookLocal.pitcheo.jugadores[i].jugador, multiplicadorModalidad);

        //     }

        // }
        // tg1 = performance.now();
        // console.log(`termina bucle general de registro de estadísticas (pitcheo) (${tg1 - tg0})`);

        // Stats del equipo (bateo) //
        if (scoreBookLocal.bateo.resultados.length > 0) {
            const datatotalBateo = {
                compilacion: idCompilacion,
                temporada: edit_temporada,
                categoria: edit_categoria,
                rol: "bateo",
                equipo: idEquipoLocal,
                jj: scoreBookLocal.bateo.resultados[0].jj,
                tt: scoreBookLocal.bateo.resultados[0].tt,
                tl: scoreBookLocal.bateo.resultados[0].tl,
                ht: scoreBookLocal.bateo.resultados[0].ht,
                h1: scoreBookLocal.bateo.resultados[0].h1,
                h2: scoreBookLocal.bateo.resultados[0].h2,
                h3: scoreBookLocal.bateo.resultados[0].h3,
                h4: scoreBookLocal.bateo.resultados[0].h4,
                hr: scoreBookLocal.bateo.resultados[0].hr,
                runs: scoreBookLocal.bateo.resultados[0].runs,
                bo: scoreBookLocal.bateo.resultados[0].bo,
                g: scoreBookLocal.bateo.resultados[0].g,
                s: scoreBookLocal.bateo.resultados[0].s,
                bb: scoreBookLocal.bateo.resultados[0].bb,
                k: scoreBookLocal.bateo.resultados[0].k,
                avg: scoreBookLocal.bateo.resultados[0].avg
            }

            await addStatEquipo(datatotalBateo);

            // Recalcular Total Stats del Equipo //
            await limpiarClientStatEquipos(edit_temporada, edit_categoria, idEquipoLocal);
            await recalculcarClientStatEquipo(edit_temporada, edit_categoria, idEquipoLocal);

        }

        if (scoreBookLocal.pitcheo.resultados.length > 0) {
            // Stats del equipo (pitcheo) //
            const datatotalPitcheo = {
                compilacion: idCompilacion,
                temporada: edit_temporada,
                categoria: edit_categoria,
                rol: "pitcheo",
                equipo: idEquipoLocal,
                jj: scoreBookLocal.pitcheo.resultados[0].jj,
                w: scoreBookLocal.pitcheo.resultados[0].w,
                l: scoreBookLocal.pitcheo.resultados[0].l,
                ip: scoreBookLocal.pitcheo.resultados[0].ip,
                bt: scoreBookLocal.pitcheo.resultados[0].bt,
                ht: scoreBookLocal.pitcheo.resultados[0].ht,
                hr: scoreBookLocal.pitcheo.resultados[0].hr,
                bb: scoreBookLocal.pitcheo.resultados[0].bb,
                k: scoreBookLocal.pitcheo.resultados[0].k,
                g: scoreBookLocal.pitcheo.resultados[0].g,
                cp: scoreBookLocal.pitcheo.resultados[0].cp,
                cl: scoreBookLocal.pitcheo.resultados[0].cl,
                era: scoreBookLocal.pitcheo.resultados[0].era,
            }

            await addStatEquipo(datatotalPitcheo);
        }
    }

    
    btnGuardarCompilacion.innerHTML = "Guardando... (Registrando Equipo Visita)";
    if (scoreBookVisitante != null) {

        // Bateo //
        // let t0 = performance.now();
        // console.log("Inicio de Registro Bateadores VISITANTE...");
        await Promise.all(scoreBookVisitante.bateo.jugadores.map(async(jugadorBateador) =>{

            if(jugadorBateador.jugador != ""){

                let nombreJugador = await getDataJugador(jugadorBateador.jugador);

                const data = {
                    compilacion: idCompilacion,
                    nombre: nombreJugador.nombre,
                    temporada: edit_temporada,
                    categoria: edit_categoria,
                    persona: jugadorBateador.jugador,
                    rol: "bateo",
                    equipo_compilado: idEquipoVisita,
                    equipo_actual: nombreJugador.equipo_actual,
                    jj: jugadorBateador.jj,
                    tt: jugadorBateador.tt,
                    tl: jugadorBateador.tl,
                    ht: jugadorBateador.ht,
                    h1: jugadorBateador.h1,
                    h2: jugadorBateador.h2,
                    h3: jugadorBateador.h3,
                    h4: jugadorBateador.h4,
                    hr: jugadorBateador.hr,
                    runs: jugadorBateador.runs,
                    bo: jugadorBateador.bo,
                    g: jugadorBateador.g,
                    s: jugadorBateador.s,
                    bb: jugadorBateador.bb,
                    k: jugadorBateador.k,
                    avg: jugadorBateador.avg
                };

                await addStatPersona(data);

                // Recalcular total stats del jugador //
                await eliminarClientStatPersona(jugadorBateador.jugador, edit_temporada, edit_categoria, "bateo");

                await recalcularStatPersonaBateo(edit_temporada, edit_categoria, jugadorBateador.jugador);
                
            }

        }));
        // let t1 = performance.now();
        // console.log(`Proceso de registro de bateadores VISITANTE finalizado... Resultado: ${ t1 - t0 }`);

        // for (let i = 0; i < scoreBookVisitante.bateo.jugadores.length; i++) {

        //     if (scoreBookVisitante.bateo.jugadores[i].jugador != "") {

        //         let nombreJugador = await getDataJugador(scoreBookVisitante.bateo.jugadores[i].jugador);

        //         const data = {
        //             compilacion: idCompilacion,
        //             nombre: nombreJugador.nombre,
        //             temporada: edit_temporada,
        //             categoria: edit_categoria,
        //             persona: scoreBookVisitante.bateo.jugadores[i].jugador,
        //             rol: "bateo",
        //             equipo_compilado: idEquipoVisita,
        //             equipo_actual: nombreJugador.equipo_actual,
        //             jj: scoreBookVisitante.bateo.jugadores[i].jj,
        //             tt: scoreBookVisitante.bateo.jugadores[i].tt,
        //             tl: scoreBookVisitante.bateo.jugadores[i].tl,
        //             ht: scoreBookVisitante.bateo.jugadores[i].ht,
        //             h1: scoreBookVisitante.bateo.jugadores[i].h1,
        //             h2: scoreBookVisitante.bateo.jugadores[i].h2,
        //             h3: scoreBookVisitante.bateo.jugadores[i].h3,
        //             h4: scoreBookVisitante.bateo.jugadores[i].h4,
        //             hr: scoreBookVisitante.bateo.jugadores[i].hr,
        //             runs: scoreBookVisitante.bateo.jugadores[i].runs,
        //             bo: scoreBookVisitante.bateo.jugadores[i].bo,
        //             g: scoreBookVisitante.bateo.jugadores[i].g,
        //             s: scoreBookVisitante.bateo.jugadores[i].s,
        //             bb: scoreBookVisitante.bateo.jugadores[i].bb,
        //             k: scoreBookVisitante.bateo.jugadores[i].k,
        //             avg: scoreBookVisitante.bateo.jugadores[i].avg
        //         };

        //         await addStatPersona(data);

        //         // Recalcular total stats del jugador //
        //         await eliminarClientStatPersona(scoreBookVisitante.bateo.jugadores[i].jugador, edit_temporada, edit_categoria, "bateo");

        //         await recalcularStatPersonaBateo(edit_temporada, edit_categoria, scoreBookVisitante.bateo.jugadores[i].jugador);


        //     }

        // }

        // Pitcheo //
        // t0 = performance.now();
        // console.log("Inicio de Registro Pitchers VISITANTE...");
        await Promise.all(scoreBookVisitante.pitcheo.jugadores.map(async(jugadorPitcher) =>{
            if(jugadorPitcher.jugador != ""){
                let nombreJugador = await getDataJugador(jugadorPitcher.jugador);
                const data = {
                    compilacion: idCompilacion,
                    nombre: nombreJugador.nombre,
                    temporada: edit_temporada,
                    categoria: edit_categoria,
                    persona: jugadorPitcher.jugador,
                    rol: "pitcheo",
                    equipo_compilado: idEquipoVisita,
                    equipo_actual: nombreJugador.equipo_actual,
                    jj: jugadorPitcher.jj,
                    w: jugadorPitcher.w,
                    l: jugadorPitcher.l,
                    ip: jugadorPitcher.ip,
                    bt: jugadorPitcher.bt,
                    ht: jugadorPitcher.ht,
                    hr: jugadorPitcher.hr,
                    bb: jugadorPitcher.bb,
                    k: jugadorPitcher.k,
                    g: jugadorPitcher.g,
                    cp: jugadorPitcher.cp,
                    cl: jugadorPitcher.cl,
                    era: jugadorPitcher.era
                };

                await addStatPersona(data);

                // Recalcular total stats del jugador //
                await eliminarClientStatPersona(jugadorPitcher.jugador, edit_temporada, edit_categoria, "pitcheo");

                await recalcularStatPersonaPitcheo(edit_temporada, edit_categoria, jugadorPitcher.jugador, multiplicadorModalidad);
            }
        }));
        // t1 = performance.now();
        // console.log(`Proceso de registro de Pitchers VISITANTE finalizado... Resultado: ${ t1 - t0 }`);
        // for (let i = 0; i < scoreBookVisitante.pitcheo.jugadores.length; i++) {

        //     if (scoreBookVisitante.pitcheo.jugadores[i].jugador != "") {
        //         let nombreJugador = await getDataJugador(scoreBookVisitante.pitcheo.jugadores[i].jugador);
        //         const data = {
        //             compilacion: idCompilacion,
        //             nombre: nombreJugador.nombre,
        //             temporada: edit_temporada,
        //             categoria: edit_categoria,
        //             persona: scoreBookVisitante.pitcheo.jugadores[i].jugador,
        //             rol: "pitcheo",
        //             equipo_compilado: idEquipoVisita,
        //             equipo_actual: nombreJugador.equipo_actual,
        //             jj: scoreBookVisitante.pitcheo.jugadores[i].jj,
        //             w: scoreBookVisitante.pitcheo.jugadores[i].w,
        //             l: scoreBookVisitante.pitcheo.jugadores[i].l,
        //             ip: scoreBookVisitante.pitcheo.jugadores[i].ip,
        //             bt: scoreBookVisitante.pitcheo.jugadores[i].bt,
        //             ht: scoreBookVisitante.pitcheo.jugadores[i].ht,
        //             hr: scoreBookVisitante.pitcheo.jugadores[i].hr,
        //             bb: scoreBookVisitante.pitcheo.jugadores[i].bb,
        //             k: scoreBookVisitante.pitcheo.jugadores[i].k,
        //             g: scoreBookVisitante.pitcheo.jugadores[i].g,
        //             cp: scoreBookVisitante.pitcheo.jugadores[i].cp,
        //             cl: scoreBookVisitante.pitcheo.jugadores[i].cl,
        //             era: scoreBookVisitante.pitcheo.jugadores[i].era
        //         };

        //         await addStatPersona(data);

        //         // Recalcular total stats del jugador //
        //         await eliminarClientStatPersona(scoreBookVisitante.pitcheo.jugadores[i].jugador, edit_temporada, edit_categoria, "pitcheo");

        //         await recalcularStatPersonaPitcheo(edit_temporada, edit_categoria, scoreBookVisitante.pitcheo.jugadores[i].jugador, multiplicadorModalidad);
        //     }



        // }


        // Stats del equipo (bateo) //
        if (scoreBookVisitante.bateo.resultados.length > 0) {
            const datatotalBateo = {
                compilacion: idCompilacion,
                temporada: edit_temporada,
                categoria: edit_categoria,
                rol: "bateo",
                equipo: idEquipoVisita,
                jj: scoreBookVisitante.bateo.resultados[0].jj,
                tt: scoreBookVisitante.bateo.resultados[0].tt,
                tl: scoreBookVisitante.bateo.resultados[0].tl,
                ht: scoreBookVisitante.bateo.resultados[0].ht,
                h1: scoreBookVisitante.bateo.resultados[0].h1,
                h2: scoreBookVisitante.bateo.resultados[0].h2,
                h3: scoreBookVisitante.bateo.resultados[0].h3,
                h4: scoreBookVisitante.bateo.resultados[0].h4,
                hr: scoreBookVisitante.bateo.resultados[0].hr,
                runs: scoreBookVisitante.bateo.resultados[0].runs,
                bo: scoreBookVisitante.bateo.resultados[0].bo,
                g: scoreBookVisitante.bateo.resultados[0].g,
                s: scoreBookVisitante.bateo.resultados[0].s,
                bb: scoreBookVisitante.bateo.resultados[0].bb,
                k: scoreBookVisitante.bateo.resultados[0].k,
                avg: scoreBookVisitante.bateo.resultados[0].avg
            }

            await addStatEquipo(datatotalBateo);

            // Recalcular Total Stats del Equipo //
            await limpiarClientStatEquipos(edit_temporada, edit_categoria, idEquipoVisita);
            await recalculcarClientStatEquipo(edit_temporada, edit_categoria, idEquipoVisita);
        }

        if (scoreBookVisitante.pitcheo.resultados.length > 0) {
            // Stats del equipo (pitcheo) //
            const datatotalPitcheo = {
                compilacion: idCompilacion,
                temporada: edit_temporada,
                categoria: edit_categoria,
                rol: "pitcheo",
                equipo: idEquipoVisita,
                jj: scoreBookVisitante.pitcheo.resultados[0].jj,
                w: scoreBookVisitante.pitcheo.resultados[0].w,
                l: scoreBookVisitante.pitcheo.resultados[0].l,
                ip: scoreBookVisitante.pitcheo.resultados[0].ip,
                bt: scoreBookVisitante.pitcheo.resultados[0].bt,
                ht: scoreBookVisitante.pitcheo.resultados[0].ht,
                hr: scoreBookVisitante.pitcheo.resultados[0].hr,
                bb: scoreBookVisitante.pitcheo.resultados[0].bb,
                k: scoreBookVisitante.pitcheo.resultados[0].k,
                g: scoreBookVisitante.pitcheo.resultados[0].g,
                cp: scoreBookVisitante.pitcheo.resultados[0].cp,
                cl: scoreBookVisitante.pitcheo.resultados[0].cl,
                era: scoreBookVisitante.pitcheo.resultados[0].era,
            }

            await addStatEquipo(datatotalPitcheo);
        }
    }
    btnGuardarCompilacion.innerHTML = "Compilación Registrado! Regresando...";
    // let perf1 = performance.now();
    // console.log(`PROCESO COMPLETO DE REGISTRO DE STATS... ${ perf1 - perf0 }`);

}

const notificarToast = (mensaje) => {
    let divToast = document.createElement("div");
    divToast.setAttribute("class", "toast");
    divToast.setAttribute("role", "alert");
    divToast.setAttribute("aria-live", "assertive");
    divToast.setAttribute("aria-atomic", "true");
    divToast.setAttribute("data-bs-autohide", "true");

    let divToastHeader = document.createElement("div");
    divToastHeader.classList.add("toast-header");

    let divStrong = document.createElement("strong");
    divStrong.classList.add("me-auto");
    divStrong.innerHTML = "Notificacion";
    divToastHeader.appendChild(divStrong);

    let divsmall = document.createElement("small");
    divsmall.classList.add("text-muted");
    divsmall.innerHTML = "Justo Ahora";
    divStrong.appendChild(divsmall);

    let divButton = document.createElement("button");
    divButton.setAttribute("type", "button");
    divButton.classList.add("btn-close");
    divButton.setAttribute("data-bs-dismiss", "toast");
    divButton.setAttribute("aria-label", "Cerrar");
    divToastHeader.appendChild(divButton);

    divToast.appendChild(divToastHeader);

    let toastBody = document.createElement("div");
    toastBody.classList.add("toast-body");
    toastBody.innerHTML = mensaje;

    divToast.appendChild(toastBody);
    divToast.setAttribute("style", "display:block;");

    contenedorToast.appendChild(divToast);
}

// selectTemporada.addEventListener('change', async() => {
//     let categorias = await ListaCategorias(selectTemporada.value);
//     jugadores = null;
//     selectCategoria.innerHTML = `<option value="" disabled selected>Seleccionar Categoría...</option>`;
//     selectEquipo.innerHTML = `<option value="" disabled selected>Seleccionar Equipo...</option>`;

//     if (selectTemporada.value != "" && selectCategoria.value != "") {
//         selectEquipo.innerHTML = `<option value="" disabled selected>Seleccionar Equipo...</option>`;
//         ObtenerEquipos(selectTemporada.value, selectCategoria.value);
//     }

//     if (categorias != null) {
//         categorias.forEach(doc => {
//             let opcion = document.createElement("option");
//             opcion.value = doc.id;
//             opcion.innerHTML = doc.data().Descripcion;
//             selectCategoria.appendChild(opcion);
//         });
//     }


// });

// selectCategoria.addEventListener('change', () => {
//     jugadores = null;

//     if (selectTemporada.value != "" && selectCategoria.value != "") {
//         selectEquipo.innerHTML = `<option value="" disabled selected>Seleccionar Equipo...</option>`;
//         ObtenerEquipos(selectTemporada.value, selectCategoria.value);
//     }

// });

// selectEquipo.addEventListener('change', async() => {
//     jugadores = await ListaJugadores(selectTemporada.value, selectCategoria.value, selectEquipo.value);
//     poblarJugadores();

// });

btnSalirScorebook.addEventListener('click', () => {
    window.location.replace('../ProgramacionJuegos.html');
});

btnRegresarScorebook.addEventListener('click', () => {
    wrapperSeleccionEquipo.classList.remove('oculto');
    wrapperscorebook.classList.add('oculto');
    wrapperControlFormulario.classList.remove('oculto');
});

btnGuardarScorebook.addEventListener('click', () => {
    let equipo = btnGuardarScorebook.getAttribute("data-equipo");
    let trTotalBateo = document.getElementById("totalBateo");
    let trTotalPitcheo = document.getElementById("totalPitcheo");
    let jugadoresBateo = [];
    let resultadosBateo = [];
    let jugadoresPitcheo = [];
    let resultadosPitcheo = [];



    // Datos Bateadores //
    for (let i = 0; i < tbodyBateo.children.length; i++) {
        if (tbodyBateo.children[i].id == "") {
            let jugador = {
                numeroCamisa: tbodyBateo.children[i].children[0].children[0].innerHTML,
                jugador: tbodyBateo.children[i].children[1].children[0].value,
                jj: tbodyBateo.children[i].children[2].children[0].value,
                tt: tbodyBateo.children[i].children[3].children[0].value,
                tl: tbodyBateo.children[i].children[4].children[0].value,
                ht: tbodyBateo.children[i].children[5].children[0].innerHTML,
                h1: tbodyBateo.children[i].children[6].children[0].value,
                h2: tbodyBateo.children[i].children[7].children[0].value,
                h3: tbodyBateo.children[i].children[8].children[0].value,
                h4: tbodyBateo.children[i].children[9].children[0].value,
                hr: tbodyBateo.children[i].children[10].children[0].value,
                runs: tbodyBateo.children[i].children[11].children[0].value,
                bo: tbodyBateo.children[i].children[12].children[0].value,
                g: tbodyBateo.children[i].children[13].children[0].value,
                s: tbodyBateo.children[i].children[14].children[0].value,
                bb: tbodyBateo.children[i].children[15].children[0].value,
                k: tbodyBateo.children[i].children[16].children[0].value,
                avg: tbodyBateo.children[i].children[17].children[0].innerHTML
            };
            jugadoresBateo.push(jugador);
        }
    }

    resultadosBateo.push({
        jj: trTotalBateo.children[1].children[0].innerHTML,
        tt: trTotalBateo.children[2].children[0].innerHTML,
        tl: trTotalBateo.children[3].children[0].innerHTML,
        ht: trTotalBateo.children[4].children[0].innerHTML,
        h1: trTotalBateo.children[5].children[0].innerHTML,
        h2: trTotalBateo.children[6].children[0].innerHTML,
        h3: trTotalBateo.children[7].children[0].innerHTML,
        h4: trTotalBateo.children[8].children[0].innerHTML,
        hr: trTotalBateo.children[9].children[0].innerHTML,
        runs: trTotalBateo.children[10].children[0].innerHTML,
        bo: trTotalBateo.children[11].children[0].innerHTML,
        g: trTotalBateo.children[12].children[0].innerHTML,
        s: trTotalBateo.children[13].children[0].innerHTML,
        bb: trTotalBateo.children[14].children[0].innerHTML,
        k: trTotalBateo.children[15].children[0].innerHTML,
        avg: trTotalBateo.children[16].children[0].innerHTML
    });



    // Datos Pitcheo
    for (let i = 0; i < tbodyPitcheo.children.length; i++) {
        if (tbodyPitcheo.children[i].id == "") {
            let jugador = {
                numeroCamisa: tbodyPitcheo.children[i].children[0].children[0].innerHTML,
                jugador: tbodyPitcheo.children[i].children[1].children[0].value,
                jj: tbodyPitcheo.children[i].children[2].children[0].value,
                w: tbodyPitcheo.children[i].children[3].children[0].value,
                l: tbodyPitcheo.children[i].children[4].children[0].value,
                ip: tbodyPitcheo.children[i].children[5].children[0].value,
                bt: tbodyPitcheo.children[i].children[6].children[0].value,
                ht: tbodyPitcheo.children[i].children[7].children[0].value,
                hr: tbodyPitcheo.children[i].children[8].children[0].value,
                bb: tbodyPitcheo.children[i].children[9].children[0].value,
                k: tbodyPitcheo.children[i].children[10].children[0].value,
                g: tbodyPitcheo.children[i].children[11].children[0].value,
                cp: tbodyPitcheo.children[i].children[12].children[0].value,
                cl: tbodyPitcheo.children[i].children[13].children[0].value,
                era: tbodyPitcheo.children[i].children[14].children[0].innerHTML
            };
            jugadoresPitcheo.push(jugador);
        }
    }

    resultadosPitcheo.push({
        jj: trTotalPitcheo.children[1].children[0].innerHTML,
        w: trTotalPitcheo.children[2].children[0].innerHTML,
        l: trTotalPitcheo.children[3].children[0].innerHTML,
        ip: trTotalPitcheo.children[4].children[0].innerHTML,
        bt: trTotalPitcheo.children[5].children[0].innerHTML,
        ht: trTotalPitcheo.children[6].children[0].innerHTML,
        hr: trTotalPitcheo.children[7].children[0].innerHTML,
        bb: trTotalPitcheo.children[8].children[0].innerHTML,
        k: trTotalPitcheo.children[9].children[0].innerHTML,
        g: trTotalPitcheo.children[10].children[0].innerHTML,
        cp: trTotalPitcheo.children[11].children[0].innerHTML,
        cl: trTotalPitcheo.children[12].children[0].innerHTML,
        era: trTotalPitcheo.children[13].children[0].innerHTML,
    });

    let dataJson = {
        bateo: {
            jugadores: jugadoresBateo,
            resultados: resultadosBateo
        },
        pitcheo: {
            jugadores: jugadoresPitcheo,
            resultados: resultadosPitcheo
        }
    };

    if (equipo == "local") {
        scoreBookLocal = dataJson;
        carrerasLocal = trTotalBateo.children[10].children[0].innerHTML;
        let cardLocal = document.getElementById("pCardLocal");
        cardLocal.innerHTML = `Total carreras: ${trTotalBateo.children[10].children[0].innerHTML}`;

    } else if (equipo == "visita") {
        scoreBookVisitante = dataJson;
        carrerasVisita = trTotalBateo.children[10].children[0].innerHTML;
        let cardVisita = document.getElementById("pCardVisita");
        cardVisita.innerHTML = `Total carreras: ${trTotalBateo.children[10].children[0].innerHTML}`;
    }

    wrapperSeleccionEquipo.classList.remove('oculto');
    wrapperscorebook.classList.add('oculto');
    wrapperControlFormulario.classList.remove('oculto');

});

// selectProgramacion.addEventListener('change', async() => {
//     scoreBookLocal = null;
//     scoreBookVisitante = null;
//     wrapperSeleccionEquipo.innerHTML = "";
//     wrapperSeleccionEquipo.classList.remove('oculto');
//     wrapperscorebook.classList.add('oculto');
//     wrapperControlFormulario.classList.remove('oculto');
//     let docProgramacion = await ObtenerProgramacionDetalle(selectProgramacion.value);
//     programacionSel = docProgramacion.data().programacion;

//     temporadaSeleccionado = docProgramacion.data().temporada;

//     // Limpiar Select //
//     LimpiarCampoSelect(selectCategoria, "Seleccionar categoría...");
//     LimpiarCampoSelect(selectJuego, "Seleccionar juego...");

//     for (let i = 0; i < programacionSel.length; i++) {

//         // Carga categoria de la programación seleccionada //
//         let docCategoria = await getCategoria(programacionSel[i].categoria);
//         if (docCategoria != null) {
//             let opcion = document.createElement("option");
//             opcion.value = docCategoria.id;
//             opcion.innerHTML = docCategoria.data().Descripcion;
//             selectCategoria.appendChild(opcion);
//         }

//     }
// });

// selectCategoria.addEventListener('change', async() => {
//     if (programacionSel != "") {
//         multiplicadorModalidad = await getMultiplicadorCategoria(selectCategoria.value);

//         scoreBookLocal = null;
//         scoreBookVisitante = null;
//         wrapperSeleccionEquipo.innerHTML = "";
//         wrapperSeleccionEquipo.classList.remove('oculto');
//         wrapperscorebook.classList.add('oculto');
//         wrapperControlFormulario.classList.remove('oculto');
//         categoriaSeleccionada = selectCategoria.value;
//         LimpiarCampoSelect(selectJuego, "Seleccionar juego...");
//         let categoria = programacionSel.find(x => x.categoria == selectCategoria.value);

//         for (let i = 0; i < categoria.partidas.length; i++) {
//             let equipoLocal = await getEquipo(categoria.partidas[i].local);
//             let equipoVisita = await getEquipo(categoria.partidas[i].visitante);

//             let opcion = document.createElement("option");
//             opcion.value = categoria.partidas[i].id;
//             opcion.innerHTML = `${equipoLocal.data().Nombre_completo} VS ${equipoVisita.data().Nombre_completo} - ${categoria.partidas[i].fecha.toDate().toLocaleDateString("es-MX")}`;
//             selectJuego.appendChild(opcion);
//         }

//     }
// });

// selectJuego.addEventListener('change', async() => {
//     if (programacionSel != "") {
//         scoreBookLocal = null;
//         scoreBookVisitante = null;
//         carrerasLocal = null;
//         carrerasVisita = null;
//         fecha_juegoProgramacion = programacionSel.find(x => x.categoria == selectCategoria.value).partidas.find(x => x.id == selectJuego.value).fecha.toDate();
//         console.log(fecha_juegoProgramacion);
//         await cargaTarjetaEquipos();

//     }
// });

document.querySelector('body').addEventListener('change', async (event) => {


    if (event.target.parentElement.tagName.toLowerCase() == "td") {

        // Bateo
        if (event.target.parentElement.parentElement.parentElement.id == "tbody-bateo") {

            let parentTableRow = event.target.parentElement.parentElement;
            let spanHT = parentTableRow.children[5].firstChild;
            let spanAVG = parentTableRow.children[17].firstChild;
            spanHT.innerHTML = calcularHitsTotales(parentTableRow);
            spanAVG.innerHTML = calcularPorcentajeBateo(parentTableRow);

            if (event.target.nodeName.toLowerCase() == "select") {
                // Carga número de jugador //
                let spanNumeroJugador = parentTableRow.children[0].firstChild;
                spanNumeroJugador.innerHTML = await ObtenerNumeroJugador(event.target.value);
            }


            calcularTotalesBateo();

        } else if (event.target.parentElement.parentElement.parentElement.id == "tbody-pitcheo") {

            let parentTableRow = event.target.parentElement.parentElement;
            let spanERA = parentTableRow.children[14].firstChild;
            spanERA.innerHTML = calcularEfectividad(parentTableRow);

            if (event.target.nodeName.toLowerCase() == "select") {
                // Carga número de jugador //
                let spanNumeroJugador = parentTableRow.children[0].firstChild;
                spanNumeroJugador.innerHTML = await ObtenerNumeroJugador(event.target.value);
            }

            calcularTotalesPitcheo();

        }



    }

});

const cargaTarjetaEquipos = async () => {
    wrapperSeleccionEquipo.innerHTML = "";
    wrapperSeleccionEquipo.classList.remove('oculto');
    wrapperscorebook.classList.add('oculto');
    wrapperControlFormulario.classList.remove('oculto');
    let categoria = programacionSel.find(x => x.categoria == edit_categoria);
    let partida = categoria.partidas.find(x => x.id == edit_juego);

    let equipoLocal = await getEquipo(partida.local);
    logo_equipo_local = equipoLocal.data().Logotipo;
    nombreEquipoLocal = equipoLocal.data().Nombre_corto;
    idEquipoLocal = equipoLocal.id;
    let equipoVisita = await getEquipo(partida.visitante);
    logo_equipo_visita = equipoVisita.data().Logotipo;
    nombreEquipoVisita = equipoVisita.data().Nombre_corto;
    idEquipoVisita = equipoVisita.id;

    // Armar tarjeta compilacion local //
    let divCard = document.createElement("div");
    divCard.classList.add("card");

    let divWrapperHeader = document.createElement("div");
    divWrapperHeader.setAttribute("class", "card-header headerCard");

    let cardHeader = document.createElement("h5");
    cardHeader.innerHTML = "Equipo local";
    divWrapperHeader.appendChild(cardHeader);

    let divFormSwitch = document.createElement("div")
    divFormSwitch.setAttribute("class", "form-check form-switch");

    let inputSwitch = document.createElement("input");
    inputSwitch.setAttribute("class", "form-check-input");
    inputSwitch.setAttribute("type", "checkbox");
    inputSwitch.setAttribute("role", "switch");
    inputSwitch.setAttribute("id", "switch_infraccionLocal");
    inputSwitch.checked = infraccion_local;
    divFormSwitch.appendChild(inputSwitch);

    let labelSwitch = document.createElement("label");
    labelSwitch.setAttribute("class", "form-check-label");
    labelSwitch.setAttribute("for", "switch_infraccionLocal");
    labelSwitch.innerHTML = "Infracción";
    labelSwitch.setAttribute("style", "font-weight:500;");
    divFormSwitch.appendChild(labelSwitch);

    divWrapperHeader.appendChild(divFormSwitch);
    divCard.appendChild(divWrapperHeader);

    let divCardBody = document.createElement("div");
    divCardBody.id = "card-local";
    divCardBody.classList.add("card-body");

    let h5CardTitle = document.createElement("h5");
    h5CardTitle.classList.add("card-title");
    h5CardTitle.innerHTML = equipoLocal.data().Nombre_completo;
    divCardBody.appendChild(h5CardTitle);

    let pCardText = document.createElement("p");
    pCardText.id = "pCardLocal";
    pCardText.classList.add("card-text");
    if (scoreBookLocal == null)
        pCardText.innerHTML = "Total carreras: 0";
    else {
        pCardText.innerHTML = `Total carreras: ${carrerasLocal}`;
    }
    divCardBody.appendChild(pCardText);

    let buttonRegistrarCompilacion = document.createElement("button");
    buttonRegistrarCompilacion.setAttribute("type", "button");
    buttonRegistrarCompilacion.setAttribute("class", "btn btnDashboard btnDashboard-primary");
    buttonRegistrarCompilacion.innerHTML = "Registrar compilación";
    buttonRegistrarCompilacion.addEventListener('click', () => {
        btnGuardarScorebook.setAttribute("data-equipo", "local");
        cargarScorebook(temporadaSeleccionado, edit_categoria, equipoLocal.id, scoreBookLocal);
    });

    divCardBody.appendChild(buttonRegistrarCompilacion);

    divCard.appendChild(divCardBody);
    wrapperSeleccionEquipo.appendChild(divCard);

    // Armar tarjeta compilacion visitante //
    let divCardVisitante = document.createElement("div");
    divCardVisitante.classList.add("card");

    let divWrapperHeaderVisita = document.createElement("div");
    divWrapperHeaderVisita.setAttribute("class", "card-header headerCard");

    let cardHeaderVisitante = document.createElement("h5");
    // cardHeaderVisitante.classList.add("card-header");
    cardHeaderVisitante.innerHTML = "Equipo visitante";
    divWrapperHeaderVisita.appendChild(cardHeaderVisitante);
    // divCardVisitante.appendChild(cardHeaderVisitante);


    let divFormSwitchVisita = document.createElement("div")
    divFormSwitchVisita.setAttribute("class", "form-check form-switch");

    let inputSwitchVisita = document.createElement("input");
    inputSwitchVisita.setAttribute("class", "form-check-input");
    inputSwitchVisita.setAttribute("type", "checkbox");
    inputSwitchVisita.setAttribute("role", "switch");
    inputSwitchVisita.checked = infraccion_visita;
    inputSwitchVisita.setAttribute("id", "switch_infraccionVisita");
    divFormSwitchVisita.appendChild(inputSwitchVisita);

    let labelSwitchVisita = document.createElement("label");
    labelSwitchVisita.setAttribute("class", "form-check-label");
    labelSwitchVisita.setAttribute("for", "switch_infraccionVisita");
    labelSwitchVisita.innerHTML = "Infracción";
    labelSwitchVisita.setAttribute("style", "font-weight:500;");
    divFormSwitchVisita.appendChild(labelSwitchVisita);

    divWrapperHeaderVisita.appendChild(divFormSwitchVisita);

    divCardVisitante.appendChild(divWrapperHeaderVisita);


    let divCardBodyVisitante = document.createElement("div");
    divCardBodyVisitante.id = "card-local";
    divCardBodyVisitante.classList.add("card-body");

    let h5CardTitleVisitante = document.createElement("h5");
    h5CardTitleVisitante.classList.add("card-title");
    h5CardTitleVisitante.innerHTML = equipoVisita.data().Nombre_completo;
    divCardBodyVisitante.appendChild(h5CardTitleVisitante);

    let pCardTextVisitante = document.createElement("p");
    pCardTextVisitante.id = "pCardVisita";
    pCardTextVisitante.classList.add("card-text");

    if (carrerasVisita == null)
        pCardTextVisitante.innerHTML = "Total carreras: 0";
    else {
        pCardTextVisitante.innerHTML = `Total carreras: ${carrerasVisita}`;
    }

    divCardBodyVisitante.appendChild(pCardTextVisitante);

    let buttonRegistrarCompilacionVisitante = document.createElement("button");
    buttonRegistrarCompilacionVisitante.setAttribute("type", "button");
    buttonRegistrarCompilacionVisitante.setAttribute("class", "btn btnDashboard btnDashboard-primary");
    buttonRegistrarCompilacionVisitante.innerHTML = "Registrar compilación";
    buttonRegistrarCompilacionVisitante.addEventListener('click', () => {
        btnGuardarScorebook.setAttribute("data-equipo", "visita");
        cargarScorebook(temporadaSeleccionado, edit_categoria, equipoVisita.id, scoreBookVisitante);
    });
    divCardBodyVisitante.appendChild(buttonRegistrarCompilacionVisitante);

    divCardVisitante.appendChild(divCardBodyVisitante);
    wrapperSeleccionEquipo.appendChild(divCardVisitante);
}

const cargaInicialScorebook = async (urlParams) => {


    for (const [key, value] of urlParams) {
        // if (key == "modo")
        //     modo = value;

        if (key == "p")
            id_programacion = value;

        if (key == "t")
            edit_temporada = value;

        if (key == "c")
            edit_categoria = value;

        if (key == "j")
            edit_juego = value;

    }

    if (id_programacion == "") {
        // nuevo scorebook //
        // console.log("nuevo");
    } else {
        // carga de scorebook //
        // console.log("edicion");

        let programacionJuego = await obtenerProgramacion(id_programacion);
        
        let listaProgramacion = programacionJuego.data().programacion;
        let programacionCategoria = listaProgramacion.find(x => x.categoria == edit_categoria).partidas;
        let programacionPartida = programacionCategoria.find(x => x.id == edit_juego);
        

        let snapTemporada = await getTemporada(edit_temporada);
        let snapCategoria = await getCategoria(edit_categoria);
        let snapequipoLocal = await getEquipo(programacionPartida.local);
        let snapequipoVisita = await getEquipo(programacionPartida.visitante);

        labelTemporada.innerHTML = snapTemporada.data().Descripcion;
        labelCategoria.innerHTML = snapCategoria.data().Descripcion;
        labelJuego.innerHTML = `${snapequipoLocal.data().Nombre_completo} VS ${snapequipoVisita.data().Nombre_completo} - ${programacionPartida.fecha.toDate().toLocaleDateString("es-MX")}`;

        fecha_juegoProgramacion = programacionPartida.fecha.toDate();
        programacionSel = listaProgramacion;
        temporadaSeleccionado = edit_temporada;

        // console.log(programacionPartida.fecha.toDate());

        let programacion_compilacion = programacionPartida.compilacion;
        console.log(programacion_compilacion);
        if (programacion_compilacion != "") {
            id = programacion_compilacion;
            let compilacion = await obtener(programacion_compilacion);

            infraccion_local = compilacion.data().infraccion_local == null ? false : compilacion.data().infraccion_local;
            infraccion_visita = compilacion.data().infraccion_visita == null ? false : compilacion.data().infraccion_visita;

            scoreBookLocal = compilacion.data().scorebook_equipo_local;
            scoreBookVisitante = compilacion.data().scorebook_equipo_visita;

            carrerasLocal = compilacion.data().carreras_equipo_local;
            carrerasVisita = compilacion.data().carreras_equipo_visita;

            // Obtener multiplicador de la categoria seleccionada //
            multiplicadorModalidad = await getMultiplicadorCategoria(compilacion.data().categoria);

            // Mostrar Tabla de equipos
            await cargaTarjetaEquipos();

        } else {
            // Nuevo registro de compilación
            multiplicadorModalidad = await getMultiplicadorCategoria(edit_categoria);

            infraccion_local = false;
            infraccion_visita = false;

            scoreBookLocal = null;
            scoreBookVisitante = null;

            carrerasLocal = null;
            carrerasVisita = null;

            await cargaTarjetaEquipos();
        }
    }

}

const cargarScorebook = async (temporada, categoria, equipo, scorebook) => {
    jugadores = await ListaJugadores(temporada, categoria, equipo);
    jugadores_baja = await ListaJugadoresBaja(equipo);
    jugadores_baja_general = await ListaJugadoresBajaGeneral();

    limpiarScorebook();

    if (scorebook != null)
        await poblarScorebook(scorebook);

    // Validar carga de scorebook //
    // if (id == "") {
    //     limpiarScorebook();
    //     if (scorebook != null) {
    //         // Cargar scorebook //
    //         await poblarScorebook(scorebook);
    //     }

    // } else {
    //     // Validar carga del scorebook del equipo (En caso de que cambie de partida) //

    // }

    wrapperSeleccionEquipo.classList.add('oculto');
    wrapperscorebook.classList.remove('oculto');
    wrapperControlFormulario.classList.add('oculto');
}

const limpiarScorebook = async () => {
    // Limpiar bateo //
    tbodyBateo.innerHTML = "";
    tbodyPitcheo.innerHTML = "";

    let trControl = document.createElement("tr");
    trControl.id = "rowControlAgregarJugadorBateo";

    let tdControl = document.createElement("td");
    tdControl.setAttribute("colspan", "2");

    let btnControl = document.createElement("button");
    btnControl.id = "btnAgregarJugador";
    btnControl.innerHTML = "Añadir jugador";
    btnControl.setAttribute("type", "button");
    btnControl.setAttribute("style", "width:100%;");
    btnControl.setAttribute("class", "btn btnDashboard btnDashboard-primary");
    btnControl.addEventListener("click", () => {
        nuevoJugadorBateo();
    });

    tdControl.appendChild(btnControl);
    trControl.appendChild(tdControl);
    tbodyBateo.appendChild(trControl);

    let trTotalBateo = document.createElement("tr");
    trTotalBateo.id = "totalBateo";

    let tdTotalBateoTotales = document.createElement("td");
    tdTotalBateoTotales.setAttribute("colspan", "2");
    tdTotalBateoTotales.setAttribute("style", "width: 100px; font-weight: bold; text-align: center;");
    let tdTotalBateoTotalesSpan = document.createElement("span");
    tdTotalBateoTotalesSpan.innerHTML = "TOTALES";
    tdTotalBateoTotales.appendChild(tdTotalBateoTotalesSpan);

    let tdTotalBateoJJ = document.createElement("td");
    tdTotalBateoJJ.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoJJSpan = document.createElement("span");
    tdTotalBateoJJSpan.id = "totalBateoJJ";
    tdTotalBateoJJSpan.innerHTML = "0";
    tdTotalBateoJJ.appendChild(tdTotalBateoJJSpan);

    let tdTotalBateoTT = document.createElement("td");
    tdTotalBateoTT.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoTTSpan = document.createElement("span");
    tdTotalBateoTTSpan.id = "totalBateoTT";
    tdTotalBateoTTSpan.innerHTML = "0";
    tdTotalBateoTT.appendChild(tdTotalBateoTTSpan);

    let tdTotalBateoTL = document.createElement("td");
    tdTotalBateoTL.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoTLSpan = document.createElement("span");
    tdTotalBateoTLSpan.id = "totalBateoTL";
    tdTotalBateoTLSpan.innerHTML = "0";
    tdTotalBateoTL.appendChild(tdTotalBateoTLSpan);

    let tdTotalBateoHT = document.createElement("td");
    tdTotalBateoHT.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoHTSpan = document.createElement("span");
    tdTotalBateoHTSpan.id = "totalBateoHT";
    tdTotalBateoHTSpan.innerHTML = "0";
    tdTotalBateoHT.appendChild(tdTotalBateoHTSpan);

    let tdTotalBateoH1 = document.createElement("td");
    tdTotalBateoH1.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoH1Span = document.createElement("span");
    tdTotalBateoH1Span.id = "totalBateoH1";
    tdTotalBateoH1Span.innerHTML = "0";
    tdTotalBateoH1.appendChild(tdTotalBateoH1Span);

    let tdTotalBateoH2 = document.createElement("td");
    tdTotalBateoH2.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoH2Span = document.createElement("span");
    tdTotalBateoH2Span.id = "totalBateoH2";
    tdTotalBateoH2Span.innerHTML = "0";
    tdTotalBateoH2.appendChild(tdTotalBateoH2Span);

    let tdTotalBateoH3 = document.createElement("td");
    tdTotalBateoH3.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoH3Span = document.createElement("span");
    tdTotalBateoH3Span.id = "totalBateoH3";
    tdTotalBateoH3Span.innerHTML = "0";
    tdTotalBateoH3.appendChild(tdTotalBateoH3Span);

    let tdTotalBateoH4 = document.createElement("td");
    tdTotalBateoH4.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoH4Span = document.createElement("span");
    tdTotalBateoH4Span.id = "totalBateoH4";
    tdTotalBateoH4Span.innerHTML = "0";
    tdTotalBateoH4.appendChild(tdTotalBateoH4Span);

    let tdTotalBateoHR = document.createElement("td");
    tdTotalBateoHR.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoHRSpan = document.createElement("span");
    tdTotalBateoHRSpan.id = "totalBateoHR";
    tdTotalBateoHRSpan.innerHTML = "0";
    tdTotalBateoHR.appendChild(tdTotalBateoHRSpan);

    let tdTotalBateoRuns = document.createElement("td");
    tdTotalBateoRuns.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoRunsSpan = document.createElement("span");
    tdTotalBateoRunsSpan.id = "totalBateoRuns";
    tdTotalBateoRunsSpan.innerHTML = "0";
    tdTotalBateoRuns.appendChild(tdTotalBateoRunsSpan);

    let tdTotalBateoBO = document.createElement("td");
    tdTotalBateoBO.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoBOSpan = document.createElement("span");
    tdTotalBateoBOSpan.id = "totalBateoBO";
    tdTotalBateoBOSpan.innerHTML = "0";
    tdTotalBateoBO.appendChild(tdTotalBateoBOSpan);

    let tdTotalBateoG = document.createElement("td");
    tdTotalBateoG.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoGSpan = document.createElement("span");
    tdTotalBateoGSpan.id = "totalBateoG";
    tdTotalBateoGSpan.innerHTML = "0";
    tdTotalBateoG.appendChild(tdTotalBateoGSpan);

    let tdTotalBateoS = document.createElement("td");
    tdTotalBateoS.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoSSpan = document.createElement("span");
    tdTotalBateoSSpan.id = "totalBateoS";
    tdTotalBateoSSpan.innerHTML = "0";
    tdTotalBateoS.appendChild(tdTotalBateoSSpan);

    let tdTotalBateoBB = document.createElement("td");
    tdTotalBateoBB.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoBBSpan = document.createElement("span");
    tdTotalBateoBBSpan.id = "totalBateoBB";
    tdTotalBateoBBSpan.innerHTML = "0";
    tdTotalBateoBB.appendChild(tdTotalBateoBBSpan);

    let tdTotalBateoK = document.createElement("td");
    tdTotalBateoK.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoKSpan = document.createElement("span");
    tdTotalBateoKSpan.id = "totalBateoK";
    tdTotalBateoKSpan.innerHTML = "0";
    tdTotalBateoK.appendChild(tdTotalBateoKSpan);

    let tdTotalBateoAVG = document.createElement("td");
    tdTotalBateoAVG.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalBateoAVGSpan = document.createElement("span");
    tdTotalBateoAVGSpan.id = "totalBateoAVG";
    tdTotalBateoAVGSpan.innerHTML = "0";
    tdTotalBateoAVG.appendChild(tdTotalBateoAVGSpan);

    let tdTotalBateoBlanco = document.createElement("td");
    tdTotalBateoBlanco.setAttribute("style", "width: 100px; font-weight: bold;");

    trTotalBateo.appendChild(tdTotalBateoTotales);
    trTotalBateo.appendChild(tdTotalBateoJJ);
    trTotalBateo.appendChild(tdTotalBateoTT);
    trTotalBateo.appendChild(tdTotalBateoTL);
    trTotalBateo.appendChild(tdTotalBateoHT);
    trTotalBateo.appendChild(tdTotalBateoH1);
    trTotalBateo.appendChild(tdTotalBateoH2);
    trTotalBateo.appendChild(tdTotalBateoH3);
    trTotalBateo.appendChild(tdTotalBateoH4);
    trTotalBateo.appendChild(tdTotalBateoHR);
    trTotalBateo.appendChild(tdTotalBateoRuns);
    trTotalBateo.appendChild(tdTotalBateoBO);
    trTotalBateo.appendChild(tdTotalBateoG);
    trTotalBateo.appendChild(tdTotalBateoS);
    trTotalBateo.appendChild(tdTotalBateoBB);
    trTotalBateo.appendChild(tdTotalBateoK);
    trTotalBateo.appendChild(tdTotalBateoAVG);
    trTotalBateo.appendChild(tdTotalBateoBlanco);
    tbodyBateo.appendChild(trTotalBateo);


    // Limpiar Pitcheo

    let trControlPitcheo = document.createElement("tr");
    trControlPitcheo.id = "rowControlAgregarJugadorPitcheo";

    let tdControlPitcheo = document.createElement("td");
    tdControlPitcheo.setAttribute("colspan", "2");
    tdControlPitcheo.setAttribute("style", "width: 100px;");

    let btnControlPitcheo = document.createElement("button");
    btnControlPitcheo.id = "btnAgregarJugadorPitcheo";
    btnControlPitcheo.innerHTML = "Añadir jugador";
    btnControlPitcheo.setAttribute("type", "button");
    btnControlPitcheo.setAttribute("style", "width:100%;");
    btnControlPitcheo.setAttribute("class", "btn btnDashboard btnDashboard-primary");
    btnControlPitcheo.addEventListener("click", () => {
        nuevoJugadorPitcheo();
    });

    tdControlPitcheo.appendChild(btnControlPitcheo);
    trControlPitcheo.appendChild(tdControlPitcheo);
    tbodyPitcheo.appendChild(trControlPitcheo);

    let trTotalPitcheo = document.createElement("tr");
    trTotalPitcheo.id = "totalPitcheo";

    let tdTotalPitcheoTotales = document.createElement("td");
    tdTotalPitcheoTotales.setAttribute("colspan", "2");
    tdTotalPitcheoTotales.setAttribute("style", "width: 100px; font-weight: bold; text-align: center;");
    let tdTotalPitcheoTotalesSpan = document.createElement("span");
    tdTotalPitcheoTotalesSpan.innerHTML = "TOTALES";
    tdTotalPitcheoTotales.appendChild(tdTotalPitcheoTotalesSpan);

    let tdTotalPitcheoJJ = document.createElement("td");
    tdTotalPitcheoJJ.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoJJSpan = document.createElement("span");
    tdTotalPitcheoJJSpan.id = "totalPitcheoJJ";
    tdTotalPitcheoJJSpan.innerHTML = "0";
    tdTotalPitcheoJJ.appendChild(tdTotalPitcheoJJSpan);

    let tdTotalPitcheoW = document.createElement("td");
    tdTotalPitcheoW.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoWSpan = document.createElement("span");
    tdTotalPitcheoWSpan.id = "totalPitcheoW";
    tdTotalPitcheoWSpan.innerHTML = "0";
    tdTotalPitcheoW.appendChild(tdTotalPitcheoWSpan);

    let tdTotalPitcheoL = document.createElement("td");
    tdTotalPitcheoL.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoLSpan = document.createElement("span");
    tdTotalPitcheoLSpan.id = "totalPitcheoL";
    tdTotalPitcheoLSpan.innerHTML = "0";
    tdTotalPitcheoL.appendChild(tdTotalPitcheoLSpan);

    let tdTotalPitcheoIP = document.createElement("td");
    tdTotalPitcheoIP.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoIPSpan = document.createElement("span");
    tdTotalPitcheoIPSpan.id = "totalPitcheoIP";
    tdTotalPitcheoIPSpan.innerHTML = "0";
    tdTotalPitcheoIP.appendChild(tdTotalPitcheoIPSpan);

    let tdTotalPitcheoBT = document.createElement("td");
    tdTotalPitcheoBT.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoBTSpan = document.createElement("span");
    tdTotalPitcheoBTSpan.id = "totalPitcheoBT";
    tdTotalPitcheoBTSpan.innerHTML = "0";
    tdTotalPitcheoBT.appendChild(tdTotalPitcheoBTSpan);

    let tdTotalPitcheoHT = document.createElement("td");
    tdTotalPitcheoHT.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoHTSpan = document.createElement("span");
    tdTotalPitcheoHTSpan.id = "totalPitcheoHT";
    tdTotalPitcheoHTSpan.innerHTML = "0";
    tdTotalPitcheoHT.appendChild(tdTotalPitcheoHTSpan);

    let tdTotalPitcheoHR = document.createElement("td");
    tdTotalPitcheoHR.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoHRSpan = document.createElement("span");
    tdTotalPitcheoHRSpan.id = "totalPitcheoHR";
    tdTotalPitcheoHRSpan.innerHTML = "0";
    tdTotalPitcheoHR.appendChild(tdTotalPitcheoHRSpan);

    let tdTotalPitcheoBB = document.createElement("td");
    tdTotalPitcheoBB.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoBBSpan = document.createElement("span");
    tdTotalPitcheoBBSpan.id = "totalPitcheoBB";
    tdTotalPitcheoBBSpan.innerHTML = "0";
    tdTotalPitcheoBB.appendChild(tdTotalPitcheoBBSpan);

    let tdTotalPitcheoK = document.createElement("td");
    tdTotalPitcheoK.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoKSpan = document.createElement("span");
    tdTotalPitcheoKSpan.id = "totalPitcheoK";
    tdTotalPitcheoKSpan.innerHTML = "0";
    tdTotalPitcheoK.appendChild(tdTotalPitcheoKSpan);

    let tdTotalPitcheoG = document.createElement("td");
    tdTotalPitcheoG.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoGSpan = document.createElement("span");
    tdTotalPitcheoGSpan.id = "totalPitcheoG";
    tdTotalPitcheoGSpan.innerHTML = "0";
    tdTotalPitcheoG.appendChild(tdTotalPitcheoGSpan);

    let tdTotalPitcheoCP = document.createElement("td");
    tdTotalPitcheoCP.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoCPSpan = document.createElement("span");
    tdTotalPitcheoCPSpan.id = "totalPitcheoCP";
    tdTotalPitcheoCPSpan.innerHTML = "0";
    tdTotalPitcheoCP.appendChild(tdTotalPitcheoCPSpan);

    let tdTotalPitcheoCL = document.createElement("td");
    tdTotalPitcheoCL.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoCLSpan = document.createElement("span");
    tdTotalPitcheoCLSpan.id = "totalPitcheoCL";
    tdTotalPitcheoCLSpan.innerHTML = "0";
    tdTotalPitcheoCL.appendChild(tdTotalPitcheoCLSpan);

    let tdTotalPitcheoERA = document.createElement("td");
    tdTotalPitcheoERA.setAttribute("style", "width: 100px; font-weight: bold;");
    let tdTotalPitcheoERASpan = document.createElement("span");
    tdTotalPitcheoERASpan.id = "totalPitcheoERA";
    tdTotalPitcheoERASpan.innerHTML = "0";
    tdTotalPitcheoERA.appendChild(tdTotalPitcheoERASpan);

    let tdTotalPitcheoBlanco = document.createElement("td");
    tdTotalPitcheoBlanco.setAttribute("style", "width: 100px; font-weight: bold;");

    trTotalPitcheo.appendChild(tdTotalPitcheoTotales);
    trTotalPitcheo.appendChild(tdTotalPitcheoJJ);
    trTotalPitcheo.appendChild(tdTotalPitcheoW);
    trTotalPitcheo.appendChild(tdTotalPitcheoL);
    trTotalPitcheo.appendChild(tdTotalPitcheoIP);
    trTotalPitcheo.appendChild(tdTotalPitcheoBT);
    trTotalPitcheo.appendChild(tdTotalPitcheoHT);
    trTotalPitcheo.appendChild(tdTotalPitcheoHR);
    trTotalPitcheo.appendChild(tdTotalPitcheoBB);
    trTotalPitcheo.appendChild(tdTotalPitcheoK);
    trTotalPitcheo.appendChild(tdTotalPitcheoG);
    trTotalPitcheo.appendChild(tdTotalPitcheoCP);
    trTotalPitcheo.appendChild(tdTotalPitcheoCL);
    trTotalPitcheo.appendChild(tdTotalPitcheoERA);
    trTotalPitcheo.appendChild(tdTotalPitcheoBlanco);
    tbodyPitcheo.appendChild(trTotalPitcheo);

}

const poblarScorebook = async (scorebook) => {
    // Carga de bateo //
    let trTotalBateo = document.getElementById("totalBateo");
    for (let i = 0; i < scorebook.bateo.jugadores.length; i++) {
        await nuevoJugadorBateo();

        tbodyBateo.children[i].children[0].children[0].innerHTML = scorebook.bateo.jugadores[i].numeroCamisa;
        tbodyBateo.children[i].children[1].children[0].value = scorebook.bateo.jugadores[i].jugador;
        tbodyBateo.children[i].children[2].children[0].value = scorebook.bateo.jugadores[i].jj;
        tbodyBateo.children[i].children[3].children[0].value = scorebook.bateo.jugadores[i].tt;
        tbodyBateo.children[i].children[4].children[0].value = scorebook.bateo.jugadores[i].tl;
        tbodyBateo.children[i].children[5].children[0].innerHTML = scorebook.bateo.jugadores[i].ht;
        tbodyBateo.children[i].children[6].children[0].value = scorebook.bateo.jugadores[i].h1;
        tbodyBateo.children[i].children[7].children[0].value = scorebook.bateo.jugadores[i].h2;
        tbodyBateo.children[i].children[8].children[0].value = scorebook.bateo.jugadores[i].h3;
        tbodyBateo.children[i].children[9].children[0].value = scorebook.bateo.jugadores[i].h4;
        tbodyBateo.children[i].children[10].children[0].value = scorebook.bateo.jugadores[i].hr;
        tbodyBateo.children[i].children[11].children[0].value = scorebook.bateo.jugadores[i].runs;
        tbodyBateo.children[i].children[12].children[0].value = scorebook.bateo.jugadores[i].bo;
        tbodyBateo.children[i].children[13].children[0].value = scorebook.bateo.jugadores[i].g;
        tbodyBateo.children[i].children[14].children[0].value = scorebook.bateo.jugadores[i].s;
        tbodyBateo.children[i].children[15].children[0].value = scorebook.bateo.jugadores[i].bb;
        tbodyBateo.children[i].children[16].children[0].value = scorebook.bateo.jugadores[i].k;
        tbodyBateo.children[i].children[17].children[0].innerHTML = scorebook.bateo.jugadores[i].avg;
    }


    trTotalBateo.children[1].children[0].innerHTML = scorebook.bateo.resultados[0].jj;
    trTotalBateo.children[2].children[0].innerHTML = scorebook.bateo.resultados[0].tt;
    trTotalBateo.children[3].children[0].innerHTML = scorebook.bateo.resultados[0].tl;
    trTotalBateo.children[4].children[0].innerHTML = scorebook.bateo.resultados[0].ht;
    trTotalBateo.children[5].children[0].innerHTML = scorebook.bateo.resultados[0].h1;
    trTotalBateo.children[6].children[0].innerHTML = scorebook.bateo.resultados[0].h2;
    trTotalBateo.children[7].children[0].innerHTML = scorebook.bateo.resultados[0].h3;
    trTotalBateo.children[8].children[0].innerHTML = scorebook.bateo.resultados[0].h4;
    trTotalBateo.children[9].children[0].innerHTML = scorebook.bateo.resultados[0].hr;
    trTotalBateo.children[10].children[0].innerHTML = scorebook.bateo.resultados[0].runs;
    trTotalBateo.children[11].children[0].innerHTML = scorebook.bateo.resultados[0].bo;
    trTotalBateo.children[12].children[0].innerHTML = scorebook.bateo.resultados[0].g;
    trTotalBateo.children[13].children[0].innerHTML = scorebook.bateo.resultados[0].s;
    trTotalBateo.children[14].children[0].innerHTML = scorebook.bateo.resultados[0].bb;
    trTotalBateo.children[15].children[0].innerHTML = scorebook.bateo.resultados[0].k;
    trTotalBateo.children[16].children[0].innerHTML = scorebook.bateo.resultados[0].avg;

    // Carga Pitcheo
    let trTotalPitcheo = document.getElementById("totalPitcheo");
    for (let i = 0; i < scorebook.pitcheo.jugadores.length; i++) {
        await nuevoJugadorPitcheo();

        tbodyPitcheo.children[i].children[0].children[0].innerHTML = scorebook.pitcheo.jugadores[i].numeroCamisa;
        tbodyPitcheo.children[i].children[1].children[0].value = scorebook.pitcheo.jugadores[i].jugador;
        tbodyPitcheo.children[i].children[2].children[0].value = scorebook.pitcheo.jugadores[i].jj;
        tbodyPitcheo.children[i].children[3].children[0].value = scorebook.pitcheo.jugadores[i].w;
        tbodyPitcheo.children[i].children[4].children[0].value = scorebook.pitcheo.jugadores[i].l;
        tbodyPitcheo.children[i].children[5].children[0].value = scorebook.pitcheo.jugadores[i].ip;
        tbodyPitcheo.children[i].children[6].children[0].value = scorebook.pitcheo.jugadores[i].bt;
        tbodyPitcheo.children[i].children[7].children[0].value = scorebook.pitcheo.jugadores[i].ht;
        tbodyPitcheo.children[i].children[8].children[0].value = scorebook.pitcheo.jugadores[i].hr;
        tbodyPitcheo.children[i].children[9].children[0].value = scorebook.pitcheo.jugadores[i].bb;
        tbodyPitcheo.children[i].children[10].children[0].value = scorebook.pitcheo.jugadores[i].k;
        tbodyPitcheo.children[i].children[11].children[0].value = scorebook.pitcheo.jugadores[i].g;
        tbodyPitcheo.children[i].children[12].children[0].value = scorebook.pitcheo.jugadores[i].cp;
        tbodyPitcheo.children[i].children[13].children[0].value = scorebook.pitcheo.jugadores[i].cl;
        tbodyPitcheo.children[i].children[14].children[0].innerHTML = scorebook.pitcheo.jugadores[i].era;
    }

    trTotalPitcheo.children[1].children[0].innerHTML = scorebook.pitcheo.resultados[0].jj;
    trTotalPitcheo.children[2].children[0].innerHTML = scorebook.pitcheo.resultados[0].w;
    trTotalPitcheo.children[3].children[0].innerHTML = scorebook.pitcheo.resultados[0].l;
    trTotalPitcheo.children[4].children[0].innerHTML = scorebook.pitcheo.resultados[0].ip;
    trTotalPitcheo.children[5].children[0].innerHTML = scorebook.pitcheo.resultados[0].bt;
    trTotalPitcheo.children[6].children[0].innerHTML = scorebook.pitcheo.resultados[0].ht;
    trTotalPitcheo.children[7].children[0].innerHTML = scorebook.pitcheo.resultados[0].hr;
    trTotalPitcheo.children[8].children[0].innerHTML = scorebook.pitcheo.resultados[0].bb;
    trTotalPitcheo.children[9].children[0].innerHTML = scorebook.pitcheo.resultados[0].k;
    trTotalPitcheo.children[10].children[0].innerHTML = scorebook.pitcheo.resultados[0].g;
    trTotalPitcheo.children[11].children[0].innerHTML = scorebook.pitcheo.resultados[0].cp;
    trTotalPitcheo.children[12].children[0].innerHTML = scorebook.pitcheo.resultados[0].cl;
    trTotalPitcheo.children[13].children[0].innerHTML = scorebook.pitcheo.resultados[0].era;
}

const ObtenerProgramaciones = async () => {
    let programaciones = await ListaProgramacion();

    if (programaciones != null) {
        programaciones.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().nombre;
            selectProgramacion.appendChild(opcion);
        });
    }
}

const ObtenerProgramacionDetalle = async (id) => {
    return await ListaDetalleProgramacion(id);
}

const ObtenTemporadas = async () => {
    let temporadas = await ListaTemporadas();

    if (temporadas != null) {
        temporadas.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Titulo;
            selectTemporada.appendChild(opcion);
        });
    }

}

const ObtenerEquipos = async (temporada, categoria) => {

    let listaEquipos = await ListaEquipos(temporada, categoria);

    if (listaEquipos != null) {
        listaEquipos.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Nombre_completo;
            selectEquipo.appendChild(opcion);
        });
    }
}



const nuevoJugadorBateo = async () => {
    let tr = document.createElement("tr");

    // Numero jugador //
    let tdNumeroJugador = document.createElement("td");
    let spanNumeroJugador = document.createElement("span");
    spanNumeroJugador.innerHTML = 0;
    tdNumeroJugador.appendChild(spanNumeroJugador);
    tr.appendChild(tdNumeroJugador);

    // Select Nombre Jugador //
    let tdSelectJugador = document.createElement("td");
    let selectNombreJugador = document.createElement("select");
    selectNombreJugador.classList.add("form-select");
    let opcionDefaultJugador = document.createElement("option");
    opcionDefaultJugador.value = "";
    opcionDefaultJugador.innerHTML = "Seleccionar jugador...";
    opcionDefaultJugador.disabled = true;
    opcionDefaultJugador.selected = true;
    selectNombreJugador.appendChild(opcionDefaultJugador);
    await ObtenerJugadores(selectNombreJugador);
    tdSelectJugador.appendChild(selectNombreJugador);
    tr.appendChild(tdSelectJugador);

    // Campo JJ //
    let tdJJ = document.createElement("td");
    let inputJJ = document.createElement("input");
    inputJJ.setAttribute("type", "text");
    inputJJ.setAttribute("class", "form-control form-size");
    inputJJ.setAttribute("value", "0");

    inputJJ.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputJJ, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdJJ.appendChild(inputJJ);
    tr.appendChild(tdJJ);



    // Campo TT //
    let tdTT = document.createElement("td");
    let inputTT = document.createElement("input");
    inputTT.setAttribute("type", "text");
    inputTT.setAttribute("class", "form-control form-size");
    inputTT.setAttribute("value", "0");

    inputTT.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputTT, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdTT.appendChild(inputTT);
    tr.appendChild(tdTT);

    // Campo TL //
    let tdTL = document.createElement("td");
    let inputTL = document.createElement("input");
    inputTL.setAttribute("type", "text");
    inputTL.setAttribute("class", "form-control form-size");
    inputTL.setAttribute("value", "0");

    inputTL.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputTL, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdTL.appendChild(inputTL);
    tr.appendChild(tdTL);

    // Campo HT //
    let tdHT = document.createElement("td");
    tdHT.setAttribute("class", "styleHT");
    let spanHT = document.createElement("span");
    spanHT.innerHTML = 0;
    tdHT.appendChild(spanHT);
    tr.appendChild(tdHT);

    // Campo H1 //
    let tdH1 = document.createElement("td");
    let inputH1 = document.createElement("input");
    inputH1.setAttribute("type", "text");
    inputH1.setAttribute("class", "form-control form-size");
    inputH1.setAttribute("value", "0");

    inputH1.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputH1, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdH1.appendChild(inputH1);
    tr.appendChild(tdH1);

    // Campo H2 //
    let tdH2 = document.createElement("td");
    let inputH2 = document.createElement("input");
    inputH2.setAttribute("type", "text");
    inputH2.setAttribute("class", "form-control form-size");
    inputH2.setAttribute("value", "0");

    inputH2.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputH2, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdH2.appendChild(inputH2);
    tr.appendChild(tdH2);

    // Campo H3 //
    let tdH3 = document.createElement("td");
    let inputH3 = document.createElement("input");
    inputH3.setAttribute("type", "text");
    inputH3.setAttribute("class", "form-control form-size");
    inputH3.setAttribute("value", "0");

    inputH3.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputH3, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdH3.appendChild(inputH3);
    tr.appendChild(tdH3);

    // Campo H4 //
    let tdH4 = document.createElement("td");
    let inputH4 = document.createElement("input");
    inputH4.setAttribute("type", "text");
    inputH4.setAttribute("class", "form-control form-size");
    inputH4.setAttribute("value", "0");

    inputH4.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputH4, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdH4.appendChild(inputH4);
    tr.appendChild(tdH4);

    // Campo HR //
    let tdHR = document.createElement("td");
    let inputHR = document.createElement("input");
    inputHR.setAttribute("type", "text");
    inputHR.setAttribute("class", "form-control form-size");
    inputHR.setAttribute("value", "0");

    inputHR.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputHR, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdHR.appendChild(inputHR);
    tr.appendChild(tdHR);

    // Campo RUNS //
    let tdRuns = document.createElement("td");
    let inputRuns = document.createElement("input");
    inputRuns.setAttribute("type", "text");
    inputRuns.setAttribute("class", "form-control form-size");
    inputRuns.setAttribute("value", "0");

    inputRuns.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputRuns, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdRuns.appendChild(inputRuns);
    tr.appendChild(tdRuns);

    // Campo B.O. //
    let tdBO = document.createElement("td");
    let inputBO = document.createElement("input");
    inputBO.setAttribute("type", "text");
    inputBO.setAttribute("class", "form-control form-size");
    inputBO.setAttribute("value", "0");

    inputBO.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputBO, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdBO.appendChild(inputBO);
    tr.appendChild(tdBO);

    // Campo G //
    let tdG = document.createElement("td");
    let inputG = document.createElement("input");
    inputG.setAttribute("type", "text");
    inputG.setAttribute("class", "form-control form-size");
    inputG.setAttribute("value", "0");

    inputG.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputG, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdG.appendChild(inputG);
    tr.appendChild(tdG);

    // Campo S //
    let tdS = document.createElement("td");
    let inputS = document.createElement("input");
    inputS.setAttribute("type", "text");
    inputS.setAttribute("class", "form-control form-size");
    inputS.setAttribute("value", "0");

    inputS.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputS, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdS.appendChild(inputS);
    tr.appendChild(tdS);

    // Campo B.B. //
    let tdBB = document.createElement("td");
    let inputBB = document.createElement("input");
    inputBB.setAttribute("type", "text");
    inputBB.setAttribute("class", "form-control form-size");
    inputBB.setAttribute("value", "0");

    inputBB.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputBB, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdBB.appendChild(inputBB);
    tr.appendChild(tdBB);

    // Campo K //
    let tdK = document.createElement("td");
    let inputK = document.createElement("input");
    inputK.setAttribute("type", "text");
    inputK.setAttribute("class", "form-control form-size");
    inputK.setAttribute("value", "0");

    inputK.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputK, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdK.appendChild(inputK);
    tr.appendChild(tdK);

    // Campo AVG //
    let tdAVG = document.createElement("td");
    tdAVG.setAttribute("class", "styleHT");
    let spanAVG = document.createElement("span");
    spanAVG.innerHTML = 0;
    tdAVG.appendChild(spanAVG);
    tr.appendChild(tdAVG);

    // Campo Acciones //
    let tdAcciones = document.createElement("td");
    tdAcciones.setAttribute("class", "styleHT");
    let buttonAcciones = document.createElement("button");
    buttonAcciones.setAttribute("type", "button");
    buttonAcciones.setAttribute("style", "width:100%");
    buttonAcciones.setAttribute("class", "btn btnDashboard btn-danger");
    buttonAcciones.addEventListener("click", (evento) => {
        let row = evento.target.parentElement.parentElement;
        row.remove();
        calcularTotalesBateo();
    });
    buttonAcciones.innerHTML = "Eliminar";
    tdAcciones.appendChild(buttonAcciones);
    tr.appendChild(tdAcciones);

    let rowControl = document.getElementById("rowControlAgregarJugadorBateo");

    tbodyBateo.insertBefore(tr, rowControl);
    // tbodyBateo.insertBefore(tr, rowcontrolAgregarJugadorBateo);


}

const nuevoJugadorPitcheo = async () => {
    let tr = document.createElement("tr");

    // Numero jugador //
    let tdNumeroJugador = document.createElement("td");
    let spanNumeroJugador = document.createElement("span");
    spanNumeroJugador.innerHTML = 0;
    tdNumeroJugador.appendChild(spanNumeroJugador);
    tr.appendChild(tdNumeroJugador);

    // Select Nombre Jugador //
    let tdSelectJugador = document.createElement("td");
    let selectNombreJugador = document.createElement("select");
    selectNombreJugador.classList.add("form-select");
    let opcionDefaultJugador = document.createElement("option");
    opcionDefaultJugador.value = "";
    opcionDefaultJugador.innerHTML = "Seleccionar jugador...";
    opcionDefaultJugador.disabled = true;
    opcionDefaultJugador.selected = true;
    selectNombreJugador.appendChild(opcionDefaultJugador);
    await ObtenerJugadores(selectNombreJugador);
    tdSelectJugador.appendChild(selectNombreJugador);
    tr.appendChild(tdSelectJugador);

    // Campo JJ //
    let tdJJ = document.createElement("td");
    let inputJJ = document.createElement("input");
    inputJJ.setAttribute("type", "text");
    inputJJ.setAttribute("class", "form-control form-size");
    inputJJ.setAttribute("value", "0");

    inputJJ.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputJJ, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdJJ.appendChild(inputJJ);
    tr.appendChild(tdJJ);

    // Campo W //
    let tdW = document.createElement("td");
    let inputW = document.createElement("input");
    inputW.setAttribute("type", "text");
    inputW.setAttribute("class", "form-control form-size");
    inputW.setAttribute("value", "0");

    inputW.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputW, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdW.appendChild(inputW);
    tr.appendChild(tdW);

    // Campo L //
    let tdL = document.createElement("td");
    let inputL = document.createElement("input");
    inputL.setAttribute("type", "text");
    inputL.setAttribute("class", "form-control form-size");
    inputL.setAttribute("value", "0");

    inputL.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputL, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdL.appendChild(inputL);
    tr.appendChild(tdL);

    // Campo IP //
    let tdIP = document.createElement("td");
    let inputIP = document.createElement("input");
    inputIP.setAttribute("type", "text");
    inputIP.setAttribute("class", "form-control form-size");
    inputIP.setAttribute("value", "0");

    inputIP.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputIP, function (value) {
        return /^-?\d*[.,]?\d*$/.test(value);
    }, "Este campo solo acepta números decimales");

    tdIP.appendChild(inputIP);
    tr.appendChild(tdIP);

    // Campo BT //
    let tdBT = document.createElement("td");
    let inputBT = document.createElement("input");
    inputBT.setAttribute("type", "text");
    inputBT.setAttribute("class", "form-control form-size");
    inputBT.setAttribute("value", "0");

    inputBT.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputBT, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdBT.appendChild(inputBT);
    tr.appendChild(tdBT);

    // Campo HT //
    let tdHT = document.createElement("td");
    let inputHT = document.createElement("input");
    inputHT.setAttribute("type", "text");
    inputHT.setAttribute("class", "form-control form-size");
    inputHT.setAttribute("value", "0");

    inputHT.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputHT, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdHT.appendChild(inputHT);
    tr.appendChild(tdHT);

    // Campo HR //
    let tdHR = document.createElement("td");
    let inputHR = document.createElement("input");
    inputHR.setAttribute("type", "text");
    inputHR.setAttribute("class", "form-control form-size");
    inputHR.setAttribute("value", "0");

    inputHR.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputHR, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdHR.appendChild(inputHR);
    tr.appendChild(tdHR);

    // Campo BB //
    let tdBB = document.createElement("td");
    let inputBB = document.createElement("input");
    inputBB.setAttribute("type", "text");
    inputBB.setAttribute("class", "form-control form-size");
    inputBB.setAttribute("value", "0");

    inputBB.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputBB, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdBB.appendChild(inputBB);
    tr.appendChild(tdBB);

    // Campo K //
    let tdK = document.createElement("td");
    let inputK = document.createElement("input");
    inputK.setAttribute("type", "text");
    inputK.setAttribute("class", "form-control form-size");
    inputK.setAttribute("value", "0");

    inputK.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputK, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdK.appendChild(inputK);
    tr.appendChild(tdK);

    // Campo G //
    let tdG = document.createElement("td");
    let inputG = document.createElement("input");
    inputG.setAttribute("type", "text");
    inputG.setAttribute("class", "form-control form-size");
    inputG.setAttribute("value", "0");

    inputG.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputG, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdG.appendChild(inputG);
    tr.appendChild(tdG);

    // Campo CP //
    let tdCP = document.createElement("td");
    let inputCP = document.createElement("input");
    inputCP.setAttribute("type", "text");
    inputCP.setAttribute("class", "form-control form-size");
    inputCP.setAttribute("value", "0");

    inputCP.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputCP, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdCP.appendChild(inputCP);
    tr.appendChild(tdCP);

    // Campo CL //
    let tdCL = document.createElement("td");
    let inputCL = document.createElement("input");
    inputCL.setAttribute("type", "text");
    inputCL.setAttribute("class", "form-control form-size");
    inputCL.setAttribute("value", "0");

    inputCL.addEventListener("change", (e) => {
        if (e.target.value == "")
            e.target.value = "0";
    });

    setInputFilter(inputCL, function (value) {
        return /^\d*$/.test(value);
    }, "Este campo solo acepta números enteros");

    tdCL.appendChild(inputCL);
    tr.appendChild(tdCL);

    // Campo ERA //
    let tdERA = document.createElement("td");
    tdERA.setAttribute("class", "styleHT");
    let spanERA = document.createElement("span");
    spanERA.innerHTML = 0;
    tdERA.appendChild(spanERA);
    tr.appendChild(tdERA);

    // Campo Acciones //
    let tdAcciones = document.createElement("td");
    tdAcciones.setAttribute("class", "styleHT");
    let buttonAcciones = document.createElement("button");
    buttonAcciones.setAttribute("type", "button");
    buttonAcciones.setAttribute("style", "width:100%");
    buttonAcciones.setAttribute("class", "btn btnDashboard btn-danger");
    buttonAcciones.addEventListener("click", (evento) => {
        let row = evento.target.parentElement.parentElement;
        row.remove();
        calcularTotalesPitcheo();
    });
    buttonAcciones.innerHTML = "Eliminar";
    tdAcciones.appendChild(buttonAcciones);
    tr.appendChild(tdAcciones);


    let rowAgregarJugadorPitcheo = document.getElementById("rowControlAgregarJugadorPitcheo");
    tbodyPitcheo.insertBefore(tr, rowAgregarJugadorPitcheo);
}

// Validar campos de texto Inputs
function setInputFilter(textbox, inputFilter, errMsg) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
        textbox.addEventListener(event, function (e) {
            if (inputFilter(this.value)) {
                // Accepted value
                if (["keydown", "mousedown", "focusout"].indexOf(e.type) >= 0) {
                    this.classList.remove("input-error");
                    this.setCustomValidity("");
                }
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                // Rejected value - restore the previous one
                this.classList.add("input-error");
                this.setCustomValidity(errMsg);
                this.reportValidity();
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                // Rejected value - nothing to restore
                this.value = "";
            }
        });
    });
}

const calcularHitsTotales = (tableRow) => {
    let h1 = parseInt(tableRow.children[6].children[0].value);
    let h2 = parseInt(tableRow.children[7].children[0].value);
    let h3 = parseInt(tableRow.children[8].children[0].value);
    let h4 = parseInt(tableRow.children[9].children[0].value);
    let hr = parseInt(tableRow.children[10].children[0].value);
    let suma = h1 + h2 + h3 + h4 + hr;
    return suma;
}

const calcularPorcentajeBateo = (tableRow) => {
    let ht = parseInt(tableRow.children[5].children[0].innerHTML);
    let tl = parseInt(tableRow.children[4].children[0].value);
    let avg = ht / tl;

    if (avg == Infinity || isNaN(avg))
        return 0;
    else
        return avg.toFixed(3);

}

const calcularEfectividad = (tableRow) => {
    let cl = parseFloat(tableRow.children[13].children[0].value);
    let ip = parseFloat(tableRow.children[5].children[0].value);
    let era = (cl * multiplicadorModalidad) / ip;

    if (era == Infinity || isNaN(era))
        return 0;
    else
        return Math.round((era + Number.EPSILON) * 100) / 100;
}

const ObtenerJugadores = async (elemento) => {
    // Agregar jugadores del equipo //
    if (jugadores != null) {
        jugadores.forEach(doc => {
            let opcion = document.createElement("option");
            opcion.value = doc.id;
            opcion.innerHTML = doc.data().Nombre_completo;
            elemento.appendChild(opcion);
        });
    }

    // Agregar jugadores que tengan baja en su bitácora
    if (jugadores_baja.length > 0) {

        let separadorBaja = document.createElement("option");
        separadorBaja.value = "";
        separadorBaja.innerHTML = "== JUGADORES BAJA EQUIPO ==";
        separadorBaja.disabled = true;
        elemento.appendChild(separadorBaja);

        for (let i = 0; i < jugadores_baja.length; i++) {
            let opciones = elemento.querySelectorAll("option");
            if (!Array.from(opciones).filter(o => o.value === jugadores_baja[i].id).length) {
                let opcionBaja = document.createElement("option");
                opcionBaja.value = jugadores_baja[i].id;
                opcionBaja.innerHTML = jugadores_baja[i].nombre;
                elemento.appendChild(opcionBaja);
            }
        }
    }

    // Agregar jugadores baja general
    if (jugadores_baja_general.length > 0) {

        let separadorBaja = document.createElement("option");
        separadorBaja.value = "";
        separadorBaja.innerHTML = "== BAJA GENERAL ==";
        separadorBaja.disabled = true;
        elemento.appendChild(separadorBaja);



        for (let i = 0; i < jugadores_baja_general.length; i++) {
            let opciones = elemento.querySelectorAll("option");
            if (!Array.from(opciones).filter(o => o.value === jugadores_baja_general[i].id).length) {
                let opcionBaja = document.createElement("option");
                opcionBaja.value = jugadores_baja_general[i].id;
                opcionBaja.innerHTML = jugadores_baja_general[i].nombre;
                elemento.appendChild(opcionBaja);
            }
        }
    }

}

const poblarJugadores = async () => {

    for (let i = 0; i < tbodyBateo.children.length; i++) {
        if (tbodyBateo.children[i].id == "") {
            let selectJugador = tbodyBateo.children[i].children[1].children[0];
            if (jugadores != null) {
                jugadores.forEach(doc => {
                    let opcion = document.createElement("option");
                    opcion.value = doc.id;
                    opcion.innerHTML = doc.data().Nombre_completo;
                    selectJugador.appendChild(opcion);
                });
            }
        }

        if (tbodyPitcheo.children[i].id == "") {
            let selectJugador = tbodyPitcheo.children[i].children[1].children[0];
            if (jugadores != null) {
                jugadores.forEach(doc => {
                    let opcion = document.createElement("option");
                    opcion.value = doc.id;
                    opcion.innerHTML = doc.data().Nombre_completo;
                    selectJugador.appendChild(opcion);
                });
            }
        }
    }
}

const calcularTotalesBateo = () => {

    let totalBateoJJ = document.getElementById("totalBateoJJ");
    let totalBateoTT = document.getElementById("totalBateoTT");
    let totalBateoTL = document.getElementById("totalBateoTL");
    let totalBateoHT = document.getElementById("totalBateoHT");
    let totalBateoH1 = document.getElementById("totalBateoH1");
    let totalBateoH2 = document.getElementById("totalBateoH2");
    let totalBateoH3 = document.getElementById("totalBateoH3");
    let totalBateoH4 = document.getElementById("totalBateoH4");
    let totalBateoHR = document.getElementById("totalBateoHR");
    let totalBateoRuns = document.getElementById("totalBateoRuns");
    let totalBateoBO = document.getElementById("totalBateoBO");
    let totalBateoG = document.getElementById("totalBateoG");
    let totalBateoS = document.getElementById("totalBateoS");
    let totalBateoBB = document.getElementById("totalBateoBB");
    let totalBateoK = document.getElementById("totalBateoK");
    let totalBateoAVG = document.getElementById("totalBateoAVG");

    let totalJJ = 0;
    let totalTT = 0;
    let totalTL = 0;
    let totalHT = 0;
    let totalH1 = 0;
    let totalH2 = 0;
    let totalH3 = 0;
    let totalH4 = 0;
    let totalHR = 0;
    let totalRuns = 0;
    let totalBO = 0;
    let totalG = 0;
    let totalS = 0;
    let totalBB = 0;
    let totalK = 0;
    let totalAVG = 0;

    for (let i = 0; i < tbodyBateo.children.length; i++) {

        if (tbodyBateo.children[i].id == "") {
            totalJJ = totalJJ + parseInt(tbodyBateo.children[i].children[2].firstChild.value);
            totalTT = totalTT + parseInt(tbodyBateo.children[i].children[3].firstChild.value);
            totalTL = totalTL + parseInt(tbodyBateo.children[i].children[4].firstChild.value);

            totalHT = totalHT + parseInt(tbodyBateo.children[i].children[5].firstChild.innerHTML);
            totalH1 = totalH1 + parseInt(tbodyBateo.children[i].children[6].firstChild.value);
            totalH2 = totalH2 + parseInt(tbodyBateo.children[i].children[7].firstChild.value);
            totalH3 = totalH3 + parseInt(tbodyBateo.children[i].children[8].firstChild.value);
            totalH4 = totalH4 + parseInt(tbodyBateo.children[i].children[9].firstChild.value);
            totalHR = totalHR + parseInt(tbodyBateo.children[i].children[10].firstChild.value);

            totalRuns = totalRuns + parseInt(tbodyBateo.children[i].children[11].firstChild.value);
            totalBO = totalBO + parseInt(tbodyBateo.children[i].children[12].firstChild.value);
            totalG = totalG + parseInt(tbodyBateo.children[i].children[13].firstChild.value);
            totalS = totalS + parseInt(tbodyBateo.children[i].children[14].firstChild.value);
            totalBB = totalBB + parseInt(tbodyBateo.children[i].children[15].firstChild.value);
            totalK = totalK + parseInt(tbodyBateo.children[i].children[16].firstChild.value);
        }

    }

    totalBateoJJ.innerHTML = totalJJ;
    totalBateoTT.innerHTML = totalTT;
    totalBateoTL.innerHTML = totalTL;

    totalBateoHT.innerHTML = totalHT;
    totalBateoH1.innerHTML = totalH1;
    totalBateoH2.innerHTML = totalH2;
    totalBateoH3.innerHTML = totalH3;
    totalBateoH4.innerHTML = totalH4;
    totalBateoHR.innerHTML = totalHR;

    totalBateoRuns.innerHTML = totalRuns;
    totalBateoBO.innerHTML = totalBO;
    totalBateoG.innerHTML = totalG;
    totalBateoS.innerHTML = totalS;
    totalBateoBB.innerHTML = totalBB;
    totalBateoK.innerHTML = totalK;

    totalAVG = totalHT / totalTL;
    if (totalAVG == Infinity || isNaN(totalAVG))
        totalBateoAVG.innerHTML = 0;
    else
        totalBateoAVG.innerHTML = totalAVG.toFixed(3);


}

const calcularTotalesPitcheo = () => {

    let totalPitcheoJJ = document.getElementById("totalPitcheoJJ");
    let totalPitcheoW = document.getElementById("totalPitcheoW");
    let totalPitcheoL = document.getElementById("totalPitcheoL");
    let totalPitcheoIP = document.getElementById("totalPitcheoIP");
    let totalPitcheoBT = document.getElementById("totalPitcheoBT");
    let totalPitcheoHT = document.getElementById("totalPitcheoHT");
    let totalPitcheoHR = document.getElementById("totalPitcheoHR");
    let totalPitcheoBB = document.getElementById("totalPitcheoBB");
    let totalPitcheoK = document.getElementById("totalPitcheoK");
    let totalPitcheoG = document.getElementById("totalPitcheoG");
    let totalPitcheoCP = document.getElementById("totalPitcheoCP");
    let totalPitcheoCL = document.getElementById("totalPitcheoCL");
    let totalPitcheoERA = document.getElementById("totalPitcheoERA");

    let totalJJ = 0;
    let totalW = 0;
    let totalL = 0;
    let totalIP = 0;
    let totalBT = 0;
    let totalHT = 0;
    let totalHR = 0;
    let totalBB = 0;
    let totalK = 0;
    let totalG = 0;
    let totalCP = 0;
    let totalCL = 0;
    let totalERA = 0;

    for (let i = 0; i < tbodyPitcheo.children.length; i++) {

        if (tbodyPitcheo.children[i].id == "") {
            totalJJ = totalJJ + parseInt(tbodyPitcheo.children[i].children[2].firstChild.value);
            totalW = totalW + parseInt(tbodyPitcheo.children[i].children[3].firstChild.value);
            totalL = totalL + parseInt(tbodyPitcheo.children[i].children[4].firstChild.value);

            totalIP = totalIP + parseFloat(tbodyPitcheo.children[i].children[5].firstChild.value);
            totalBT = totalBT + parseInt(tbodyPitcheo.children[i].children[6].firstChild.value);
            totalHT = totalHT + parseInt(tbodyPitcheo.children[i].children[7].firstChild.value);
            totalHR = totalHR + parseInt(tbodyPitcheo.children[i].children[8].firstChild.value);
            totalBB = totalBB + parseInt(tbodyPitcheo.children[i].children[9].firstChild.value);
            totalK = totalK + parseInt(tbodyPitcheo.children[i].children[10].firstChild.value);

            totalG = totalG + parseInt(tbodyPitcheo.children[i].children[11].firstChild.value);
            totalCP = totalCP + parseInt(tbodyPitcheo.children[i].children[12].firstChild.value);
            totalCL = totalCL + parseInt(tbodyPitcheo.children[i].children[13].firstChild.value);
        }

    }

    totalPitcheoJJ.innerHTML = totalJJ;
    totalPitcheoW.innerHTML = totalW;
    totalPitcheoL.innerHTML = totalL;
    totalPitcheoIP.innerHTML = totalIP;
    totalPitcheoBT.innerHTML = totalBT;
    totalPitcheoHT.innerHTML = totalHT;
    totalPitcheoHR.innerHTML = totalHR;
    totalPitcheoBB.innerHTML = totalBB;
    totalPitcheoK.innerHTML = totalK;
    totalPitcheoG.innerHTML = totalG;
    totalPitcheoCP.innerHTML = totalCP;
    totalPitcheoCL.innerHTML = totalCL;

    totalERA = (totalCL * multiplicadorModalidad) / totalIP;
    if (totalERA == Infinity || isNaN(totalERA))
        totalPitcheoERA.innerHTML = 0;
    else
        totalPitcheoERA.innerHTML = Math.round((totalERA + Number.EPSILON) * 100) / 100;;

}

const ObtenerNumeroJugador = async (idJugador) => {
    let jugador = await NumeroJugador(idJugador);
    return jugador;
}

const LimpiarCampoSelect = (e, placeholder) => {
    e.innerHTML = "";
    let opcion = document.createElement("option");
    opcion.value = "";
    opcion.innerHTML = placeholder;
    opcion.disabled = true;
    opcion.selected = true;
    e.appendChild(opcion);
}