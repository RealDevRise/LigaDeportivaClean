import * as standing from "./core/standings.js";
import {
    VerificarPartidaDominio,
    Obtener_Posicion_Por_Diferencia_Carrera,
    Ordenar_Diferencia_Carrera,
    Ordenar_Por_Dominio
} from "./corecompilacion.js";

const selectorModalidad = document.getElementById("grupoModalidad");
const selectorGrupos = document.getElementById("selectGrupo");
const contenedorStandings = document.getElementById("contenedor-standing");
const btnMostrarTodo = document.getElementById("btnMostrarTodo");
const contenedorCarga = document.getElementById("contendor-carga");
const contenedorSinDatos = document.getElementById("contenedor-sindatos");


document.addEventListener('DOMContentLoaded', async function() {
    // Lectura Inicial de Categorias y Standings

    contenedorCarga.classList.remove("oculto");
    contenedorStandings.classList.add("oculto");
    await cargarCategorias();
    contenedorCarga.classList.add("oculto");
    contenedorStandings.classList.remove("oculto");

    // await cargarGrupos();
});

const cargarCategorias = async() => {
    // Carga de Categorias Disponibles //
    let categorias = await standing.leerCategoriasDisponibles();
    if (categorias != null) {
        // Lectura de las categorias que obtuvo en el query //
        await Promise.all(categorias.docs.map(async(documento) => {
            // Añade la modalidad en el selector de modalidades
            let anchorModalidad = document.createElement("a");
            anchorModalidad.setAttribute("href", "javascript:void(0)");
            anchorModalidad.setAttribute("class", "btn boton-primary");
            anchorModalidad.innerHTML = documento.data().Descripcion;
            anchorModalidad.addEventListener('click', async() => {
                // Evento al presionar un boton del selector para
                // cambiar la vista de modalidad
                contenedorSinDatos.classList.add("oculto");
                contenedorCarga.classList.remove("oculto");
                contenedorStandings.classList.add("oculto");
                await cambiarModalidad(anchorModalidad, documento.id);
                contenedorCarga.classList.add("oculto");
                contenedorStandings.classList.remove("oculto");
            });
            selectorModalidad.appendChild(anchorModalidad);

            // Lectura de los standings filtradas por categoria
            let standings = await standing.leerStanding(documento.id);
            let gruposCategoria = [];

            if (standings != null) {
                // Aqui hace el armado de la tabla de los equipos dentro
                // de la modalidad. Hace algunas lecturas adicionales
                // donde obtiene información del equipo
                let divContenedorTablas = document.createElement("div");

                standings.forEach(docu => {
                    let grupo = docu.data().grupo;
                    if (!gruposCategoria.includes(grupo)) {
                        gruposCategoria.push(grupo);
                    }
                });

                await Promise.all(gruposCategoria.map(async(docuGrupo) => {
                    if (docuGrupo == "") {

                        let contenedorTabla = document.createElement("div");
                        contenedorTabla.id = `contenedor-${documento.data().Descripcion.split(' ').join('')}`;
                        contenedorTabla.classList.add("contenedorTabla");

                        let tabla = document.createElement("table");
                        tabla.setAttribute("class", "table table-striped-columns table-striped table-dark table-responsive");
                        tabla.innerHTML = `
                     <thead class="cabezalModalidad">
                        <tr>
                          <th scope="col" class="tituloHeadModalidad" colspan="12">${documento.data().Descripcion}</th>
                        </tr>
                      </thead>
                      <thead>
                        <tr>
                          <th scope="col">POS</th>
                          <th scope="col"></th>
                          <th scope="col">EQUIPO</th>
                          <th scope="col">JJ</th>
                          <th scope="col">T</th>
                          <th scope="col">D</th>
                          <th scope="col">E</th>
                          <th scope="col">PCT</th>
                          <th scope="col">TCA</th>
                          <th scope="col">TCR</th>
                          <th scope="col">DIF</th>
                        </tr>
                      </thead>
                     `;

                        let tbody = document.createElement("tbody");
                        tbody.id = `tbody-${documento.data().Descripcion.split(' ').join('')}`

                        tabla.appendChild(tbody);

                        contenedorTabla.appendChild(tabla);
                        divContenedorTablas.appendChild(contenedorTabla);
                        contenedorStandings.appendChild(divContenedorTablas);

                    } else {
                        let nombreGrupo = await standing.leerGrupo(docuGrupo);

                        let contenedorTabla = document.createElement("div");
                        contenedorTabla.id = `contenedor-${documento.data().Descripcion.split(' ').join('')}${nombreGrupo.data().Nombre.split(' ').join('')}`;
                        contenedorTabla.classList.add("contenedorTabla");

                        let tabla = document.createElement("table");
                        tabla.setAttribute("class", "table table-striped-columns table-striped table-dark table-responsive");
                        tabla.innerHTML = `
                            <thead class="cabezalModalidad">
                               <tr>
                                 <th scope="col" class="tituloHeadModalidad" colspan="12">${documento.data().Descripcion} <small> - ${nombreGrupo.data().Nombre}</small></th>
                               </tr>
                             </thead>
                             <thead>
                               <tr>
                                <th scope="col">POS</th>
                                <th scope="col"></th>
                                <th scope="col">EQUIPOS</th>
                                <th scope="col">JJ</th>
                                <th scope="col">T</th>
                                <th scope="col">D</th>
                                <th scope="col">E</th>
                                <th scope="col">PCT</th>
                                <th scope="col">TCA</th>
                                <th scope="col">TCR</th>
                                <th scope="col">DIF</th>
                               </tr>
                             </thead>
                            `;

                        let tbody = document.createElement("tbody");
                        tbody.id = `tbody-${documento.data().Descripcion.split(' ').join('')}${nombreGrupo.data().Nombre.split(' ').join('')}`;

                        tabla.appendChild(tbody);
                        contenedorTabla.appendChild(tabla);
                        divContenedorTablas.appendChild(contenedorTabla);
                        contenedorStandings.appendChild(divContenedorTablas);
                    }
                }));


                // Se insertan los datos a la tabla //
                let numero = 1;
                let lastGrupo = "";
                let dataPCT = [];
                await Promise.all(standings.docs.map(async(s) => {

                    // Verificar si el equipo pertenece a un grupo //
                    if (s.data().grupo != "") {
                        // Pertenece a un grupo
                        // Se añadirá información adicional del grupo

                        let equipo = await standing.leerEquipo(s.data().equipo);

                        if (equipo != null) {
                            let nombreGrupo = await standing.leerGrupo(s.data().grupo);


                            dataPCT.push({
                                logotipo: equipo.data().Logotipo,
                                nombre: equipo.data().Nombre_completo,
                                idEquipo: equipo.id,
                                grupo: nombreGrupo.data().Nombre,
                                jj: s.data().jj,
                                t: s.data().t,
                                d: s.data().d,
                                e: s.data().e,
                                pct: s.data().pct,
                                tca: s.data().tca,
                                tcr: s.data().tcr,
                                dif: s.data().dif
                            });

                            // let tbody = document.getElementById(`tbody-${documento.data().Descripcion.split(' ').join('')}${nombreGrupo.data().Nombre.split(' ').join('')}`);
                            // tbody.innerHTML += `
                            // <tr>
                            //     <th scope="row">${numero++}</th>
                            //     <td><img src="${equipo.data().Logotipo}" class="logotipo_Equipo"></td>
                            //     <td>${equipo.data().Nombre_completo}</td>
                            //     <td>${s.data().jj}</td>
                            //     <td>${s.data().t}</td>
                            //     <td>${s.data().d}</td>
                            //     <td>${s.data().e}</td>
                            //     <td>${s.data().pct}</td>
                            // </tr>
                            // `;
                        }

                    } else {
                        // No pertenece a ningún grupo
                        let equipo = await standing.leerEquipo(s.data().equipo);

                        if (equipo != null) {
                            dataPCT.push({
                                logotipo: equipo.data().Logotipo,
                                nombre: equipo.data().Nombre_completo,
                                idEquipo: equipo.id,
                                grupo: "",
                                jj: s.data().jj,
                                t: s.data().t,
                                d: s.data().d,
                                e: s.data().e,
                                pct: s.data().pct,
                                tca: s.data().tca,
                                tcr: s.data().tcr,
                                dif: s.data().dif
                            });

                            // let tbody = document.getElementById(`tbody-${documento.data().Descripcion.split(' ').join('')}`);
                            // tbody.innerHTML += `
                            // <tr>
                            //     <th scope="row">${numero++}</th>
                            //     <td><img src="${equipo.data().Logotipo}" class="logotipo_Equipo"></td>
                            //     <td>${equipo.data().Nombre_completo}</td>
                            //     <td>${s.data().jj}</td>
                            //     <td>${s.data().t}</td>
                            //     <td>${s.data().d}</td>
                            //     <td>${s.data().e}</td>
                            //     <td>${s.data().pct}</td>
                            // </tr>
                            // `;

                        }

                    }
                }));

                const resultados = groupBy(dataPCT, equipo => equipo.pct);


                for await (const resultado of resultados) {


                    if (resultado[1].length == 1) {
                        // Es un solo equipos //
                        if (resultado[1][0].grupo == "")
                            ArmarRowEquipo(resultado[1][0], documento);
                        else
                            ArmarRowEquipoGrupo(resultado[1][0], documento)

                    } else if (resultado[1].length == 2) {
                        // Son dos equipos empatados //
                        // Revisará si los equipos ya jugaron para desempatar por el dominio //
                        let Compilacion_Dominio = await VerificarPartidaDominio(resultado[1][0].idEquipo, resultado[1][1].idEquipo);

                        if (Compilacion_Dominio == null) {
                            // No han jugado los dos equipos //
                            // Procederá a ordenar por la diferencia de carreras //

                            let ArrayEquipos = [resultado[1][0], resultado[1][1]];
                            let Diferencia_Ordenada = Ordenar_Diferencia_Carrera(ArrayEquipos);

                            for (const equipo of Diferencia_Ordenada) {
                                if (equipo.grupo == "")
                                    ArmarRowEquipo(equipo, documento);
                                else
                                    ArmarRowEquipoGrupo(equipo, documento);
                            }

                        } else {
                            // Se revisará quien ganó para desempatar //
                            let ArrayEquipos = [resultado[1][0], resultado[1][1]];
                            let Diferencia_Dominio = Ordenar_Por_Dominio(Compilacion_Dominio.docs[0]);
                            for (const equipo of Diferencia_Dominio) {
                                // Armar row //
                                if (equipo.grupo == "")
                                    ArmarRowEquipo(resultado[1].find((e) => e.idEquipo == equipo), documento);
                                else
                                    ArmarRowEquipoGrupo(resultado[1].find((e) => e.idEquipo == equipo), documento);
                            }
                        }

                    } else if (resultado[1].length > 2) {
                        // Mas de dos equipos empatados //
                        // Procedera a ordenar por la diferencia de carreras //
                        let ArrayEquipos = Ordenar_Diferencia_Carrera(resultado[1]);
                        for (const equipo of ArrayEquipos) {
                            if (equipo.grupo == "")
                                ArmarRowEquipo(equipo, documento);
                            else
                                ArmarRowEquipoGrupo(equipo, documento);
                        }
                    }


                }

            }

        }));
    } else {
        contenedorSinDatos.classList.remove("oculto");
    }
}

const ArmarRowEquipo = (StandingTeam = null, CategoriaTeam) => {
    if (StandingTeam != null) {

        let tbody = document.getElementById(`tbody-${CategoriaTeam.data().Descripcion.split(' ').join('')}`);
        let posicion = tbody.childElementCount + 1;

        tbody.innerHTML += `
            <tr>
                <th scope="row">${posicion}</th>
                <td><img src="${StandingTeam.logotipo}" alt="${StandingTeam.nombre}" class="logotipo_Equipo"></td>
                <td>${StandingTeam.nombre}</td>
                <td>${StandingTeam.jj}</td>
                <td>${StandingTeam.t}</td>
                <td>${StandingTeam.d}</td>
                <td>${StandingTeam.e}</td>
                <td>${StandingTeam.pct}</td>
                <td>${StandingTeam.tca == undefined ? "N/A" : StandingTeam.tca}</td>
                <td>${StandingTeam.tcr == undefined ? "N/A" : StandingTeam.tcr}</td>
                <td>${StandingTeam.dif == undefined ? "N/A" : StandingTeam.dif}</td>
            </tr>
        `;

    }
}

const ArmarRowEquipoGrupo = (StandingTeam = null, CategoriaTeam) => {
    let tbody = document.getElementById(`tbody-${CategoriaTeam.data().Descripcion.split(' ').join('')}${StandingTeam.grupo.split(' ').join('')}`);
    let posicion = tbody.childElementCount + 1;

    tbody.innerHTML += `
        <tr>
            <th scope="row">${posicion}</th>
            <td><img src="${StandingTeam.logotipo}" alt="${StandingTeam.nombre}" class="logotipo_Equipo"></td>
            <td>${StandingTeam.nombre}</td>
            <td>${StandingTeam.jj}</td>
            <td>${StandingTeam.t}</td>
            <td>${StandingTeam.d}</td>
            <td>${StandingTeam.e}</td>
            <td>${StandingTeam.pct}</td>
            <td>${StandingTeam.tca == undefined ? "N/A" : StandingTeam.tca}</td>
            <td>${StandingTeam.tcr == undefined ? "N/A" : StandingTeam.tcr}</td>
            <td>${StandingTeam.dif == undefined ? "N/A" : StandingTeam.dif}</td>
        </tr>
    `;
}

const cargarGrupos = async() => {
    let grupos = await standing.leerGruposDisponibles();

    if (grupos != null) {
        await Promise.all(grupos.docs.map(async(documento) => {
            let opcion = document.createElement("option");
            opcion.setAttribute("value", documento.id);
            opcion.innerHTML = documento.data().Nombre;
            selectorGrupos.appendChild(opcion);
        }));
    }
}

btnMostrarTodo.addEventListener('click', async() => {
    contenedorSinDatos.classList.add("oculto");
    contenedorCarga.classList.remove("oculto");
    contenedorStandings.classList.add("oculto");
    contenedorStandings.innerHTML = "";

    for (let i = 0; i < selectorModalidad.children.length; i++) {
        selectorModalidad.children[i].classList.remove('active');
    }
    btnMostrarTodo.classList.add('active');

    // Carga de Categorias Disponibles //
    let categorias = await standing.leerCategoriasDisponibles();
    if (categorias != null) {
        // Lectura de las categorias que obtuvo en el query //
        await Promise.all(categorias.docs.map(async(documento) => {

            // Lectura de los standings filtradas por categoria
            let standings = await standing.leerStanding(documento.id);
            let gruposCategoria = [];

            if (standings != null) {
                // Aqui hace el armado de la tabla de los equipos dentro
                // de la modalidad. Hace algunas lecturas adicionales
                // donde obtiene información del equipo
                let divContenedorTablas = document.createElement("div");

                standings.forEach(docu => {
                    let grupo = docu.data().grupo;
                    if (!gruposCategoria.includes(grupo)) {
                        gruposCategoria.push(grupo);
                    }
                });

                await Promise.all(gruposCategoria.map(async(docuGrupo) => {
                    if (docuGrupo == "") {

                        let contenedorTabla = document.createElement("div");
                        contenedorTabla.id = `contenedor-${documento.data().Descripcion.split(' ').join('')}`;
                        contenedorTabla.classList.add("contenedorTabla");

                        let tabla = document.createElement("table");
                        tabla.setAttribute("class", "table table-striped-columns table-striped table-dark table-responsive");
                        tabla.innerHTML = `
                     <thead class="cabezalModalidad">
                        <tr>
                          <th scope="col" class="tituloHeadModalidad" colspan="12">${documento.data().Descripcion}</th>
                        </tr>
                      </thead>
                      <thead>
                        <tr>
                          <th scope="col">POS</th>
                          <th scope="col"></th>
                          <th scope="col">EQUIPOS</th>
                          <th scope="col">JJ</th>
                          <th scope="col">T</th>
                          <th scope="col">D</th>
                          <th scope="col">E</th>
                          <th scope="col">PCT</th>
                          <th scope="col">TCA</th>
                          <th scope="col">TCR</th>
                          <th scope="col">DIF</th>
                        </tr>
                      </thead>
                     `;

                        let tbody = document.createElement("tbody");
                        tbody.id = `tbody-${documento.data().Descripcion.split(' ').join('')}`

                        tabla.appendChild(tbody);

                        contenedorTabla.appendChild(tabla);
                        divContenedorTablas.appendChild(contenedorTabla);
                        contenedorStandings.appendChild(divContenedorTablas);

                    } else {
                        let nombreGrupo = await standing.leerGrupo(docuGrupo);

                        let contenedorTabla = document.createElement("div");
                        contenedorTabla.id = `contenedor-${documento.data().Descripcion.split(' ').join('')}${nombreGrupo.data().Nombre.split(' ').join('')}`;
                        contenedorTabla.classList.add("contenedorTabla");

                        let tabla = document.createElement("table");
                        tabla.setAttribute("class", "table table-striped-columns table-striped table-dark table-responsive");
                        tabla.innerHTML = `
                            <thead class="cabezalModalidad">
                               <tr>
                                 <th scope="col" class="tituloHeadModalidad" colspan="12">${documento.data().Descripcion} <small> - ${nombreGrupo.data().Nombre}</small></th>
                               </tr>
                             </thead>
                             <thead>
                               <tr>
                                 <th scope="col">POS</th>
                                 <th scope="col"></th>
                                 <th scope="col">EQUIPOS</th>
                                 <th scope="col">JJ</th>
                                 <th scope="col">T</th>
                                 <th scope="col">D</th>
                                 <th scope="col">E</th>
                                 <th scope="col">PCT</th>
                                 <th scope="col">TCA</th>
                                <th scope="col">TCR</th>
                                <th scope="col">DIF</th>
                               </tr>
                             </thead>
                            `;

                        let tbody = document.createElement("tbody");
                        tbody.id = `tbody-${documento.data().Descripcion.split(' ').join('')}${nombreGrupo.data().Nombre.split(' ').join('')}`;

                        tabla.appendChild(tbody);
                        contenedorTabla.appendChild(tabla);
                        divContenedorTablas.appendChild(contenedorTabla);
                        contenedorStandings.appendChild(divContenedorTablas);
                    }
                }));

                let numero = 1;
                let lastGrupo = "";
                let dataPCT = [];
                await Promise.all(standings.docs.map(async(s) => {

                    // Verificar si el equipo pertenece a un grupo //
                    if (s.data().grupo != "") {
                        // Pertenece a un grupo
                        // Se añadirá información adicional del grupo

                        let equipo = await standing.leerEquipo(s.data().equipo);
                        if (equipo != null) {
                            let nombreGrupo = await standing.leerGrupo(s.data().grupo);

                            dataPCT.push({
                                logotipo: equipo.data().Logotipo,
                                nombre: equipo.data().Nombre_completo,
                                idEquipo: equipo.id,
                                grupo: nombreGrupo.data().Nombre,
                                jj: s.data().jj,
                                t: s.data().t,
                                d: s.data().d,
                                e: s.data().e,
                                pct: s.data().pct,
                                tca: s.data().tca,
                                tcr: s.data().tcr,
                                dif: s.data().dif
                            });

                            // let tbody = document.getElementById(`tbody-${documento.data().Descripcion.split(' ').join('')}${nombreGrupo.data().Nombre.split(' ').join('')}`);
                            // tbody.innerHTML += `
                            // <tr>
                            //     <th scope="row">${numero++}</th>
                            //     <td><img src="${equipo.data().Logotipo}" class="logotipo_Equipo"></td>
                            //     <td>${equipo.data().Nombre_completo}</td>
                            //     <td>${s.data().jj}</td>
                            //     <td>${s.data().t}</td>
                            //     <td>${s.data().d}</td>
                            //     <td>${s.data().e}</td>
                            //     <td>${s.data().pct}</td>
                            // </tr>
                            // `;
                        }
                    } else {
                        // No pertenece a ningún grupo
                        let equipo = await standing.leerEquipo(s.data().equipo);

                        if (equipo != null) {

                            dataPCT.push({
                                logotipo: equipo.data().Logotipo,
                                nombre: equipo.data().Nombre_completo,
                                idEquipo: equipo.id,
                                grupo: "",
                                jj: s.data().jj,
                                t: s.data().t,
                                d: s.data().d,
                                e: s.data().e,
                                pct: s.data().pct,
                                tca: s.data().tca,
                                tcr: s.data().tcr,
                                dif: s.data().dif
                            });

                            // let tbody = document.getElementById(`tbody-${documento.data().Descripcion.split(' ').join('')}`);
                            // tbody.innerHTML += `
                            // <tr>
                            //     <th scope="row">${numero++}</th>
                            //     <td><img src="${equipo.data().Logotipo}" class="logotipo_Equipo"></td>
                            //     <td>${equipo.data().Nombre_completo}</td>
                            //     <td>${s.data().jj}</td>
                            //     <td>${s.data().t}</td>
                            //     <td>${s.data().d}</td>
                            //     <td>${s.data().e}</td>
                            //     <td>${s.data().pct}</td>
                            // </tr>
                            // `;

                        }

                    }
                }));

                const resultados = groupBy(dataPCT, equipo => equipo.pct);


                for await (const resultado of resultados) {


                    if (resultado[1].length == 1) {
                        // Es un solo equipos //
                        if (resultado[1][0].grupo == "")
                            ArmarRowEquipo(resultado[1][0], documento);
                        else
                            ArmarRowEquipoGrupo(resultado[1][0], documento)

                    } else if (resultado[1].length == 2) {
                        // Son dos equipos empatados //
                        // Revisará si los equipos ya jugaron para desempatar por el dominio //
                        let Compilacion_Dominio = await VerificarPartidaDominio(resultado[1][0].idEquipo, resultado[1][1].idEquipo);

                        if (Compilacion_Dominio == null) {
                            // No han jugado los dos equipos //
                            // Procederá a ordenar por la diferencia de carreras //

                            let ArrayEquipos = [resultado[1][0], resultado[1][1]];
                            let Diferencia_Ordenada = Ordenar_Diferencia_Carrera(ArrayEquipos);

                            for (const equipo of Diferencia_Ordenada) {
                                if (equipo.grupo == "")
                                    ArmarRowEquipo(equipo, documento);
                                else
                                    ArmarRowEquipoGrupo(equipo, documento);
                            }

                        } else {
                            // Se revisará quien ganó para desempatar //
                            let ArrayEquipos = [resultado[1][0], resultado[1][1]];
                            let Diferencia_Dominio = Ordenar_Por_Dominio(Compilacion_Dominio.docs[0]);
                            for (const equipo of Diferencia_Dominio) {
                                // Armar row //
                                if (equipo.grupo == "")
                                    ArmarRowEquipo(resultado[1].find((e) => e.idEquipo == equipo), documento);
                                else
                                    ArmarRowEquipoGrupo(resultado[1].find((e) => e.idEquipo == equipo), documento);
                            }
                        }

                    } else if (resultado[1].length > 2) {
                        // Mas de dos equipos empatados //
                        // Procedera a ordenar por la diferencia de carreras //
                        let ArrayEquipos = Ordenar_Diferencia_Carrera(resultado[1]);
                        for (const equipo of ArrayEquipos) {
                            if (equipo.grupo == "")
                                ArmarRowEquipo(equipo, documento);
                            else
                                ArmarRowEquipoGrupo(equipo, documento);
                        }
                    }


                }


            }

        }));
    } else {
        contenedorSinDatos.classList.remove("oculto");
    }

    contenedorCarga.classList.add("oculto");
    contenedorStandings.classList.remove("oculto");
});

const cambiarModalidad = async(e, modalidad = null) => {

    contenedorStandings.innerHTML = "";
    for (let i = 0; i < selectorModalidad.children.length; i++) {
        selectorModalidad.children[i].classList.remove('active');
    }
    e.classList.add('active');

    let standings = await standing.leerStanding(modalidad);
    let documento = await standing.leerCategoria(modalidad);

    let gruposCategoria = [];


    if (standings != null) {
        // Aqui hace el armado de la tabla de los equipos dentro
        // de la modalidad. Hace algunas lecturas adicionales
        // donde obtiene información del equipo
        let divContenedorTablas = document.createElement("div");

        standings.forEach(docu => {
            let grupo = docu.data().grupo;
            if (!gruposCategoria.includes(grupo)) {
                gruposCategoria.push(grupo);
            }
        });

        await Promise.all(gruposCategoria.map(async(docuGrupo) => {
            if (docuGrupo == "") {

                let contenedorTabla = document.createElement("div");
                contenedorTabla.id = `contenedor-${documento.data().Descripcion.split(' ').join('')}`;
                contenedorTabla.classList.add("contenedorTabla");

                let tabla = document.createElement("table");
                tabla.setAttribute("class", "table table-striped-columns table-striped table-dark table-responsive");
                tabla.innerHTML = `
                     <thead class="cabezalModalidad">
                        <tr>
                          <th scope="col" class="tituloHeadModalidad" colspan="12">${documento.data().Descripcion}</th>
                        </tr>
                      </thead>
                      <thead>
                        <tr>
                          <th scope="col">POS</th>
                          <th scope="col"></th>
                          <th scope="col">EQUIPOS</th>
                          <th scope="col">JJ</th>
                          <th scope="col">T</th>
                          <th scope="col">D</th>
                          <th scope="col">E</th>
                          <th scope="col">PCT</th>
                          <th scope="col">TCA</th>
                          <th scope="col">TCR</th>
                          <th scope="col">DIF</th>
                        </tr>
                      </thead>
                     `;

                let tbody = document.createElement("tbody");
                tbody.id = `tbody-${documento.data().Descripcion.split(' ').join('')}`

                tabla.appendChild(tbody);

                contenedorTabla.appendChild(tabla);
                divContenedorTablas.appendChild(contenedorTabla);
                contenedorStandings.appendChild(divContenedorTablas);

            } else {
                let nombreGrupo = await standing.leerGrupo(docuGrupo);

                let contenedorTabla = document.createElement("div");
                contenedorTabla.id = `contenedor-${documento.data().Descripcion.split(' ').join('')}${nombreGrupo.data().Nombre.split(' ').join('')}`;
                contenedorTabla.classList.add("contenedorTabla");

                let tabla = document.createElement("table");
                tabla.setAttribute("class", "table table-striped-columns table-striped table-dark table-responsive");
                tabla.innerHTML = `
                            <thead class="cabezalModalidad">
                               <tr>
                                 <th scope="col" class="tituloHeadModalidad" colspan="12">${documento.data().Descripcion} <small> - ${nombreGrupo.data().Nombre}</small></th>
                               </tr>
                             </thead>
                             <thead>
                               <tr>
                                 <th scope="col">POS</th>
                                 <th scope="col"></th>
                                 <th scope="col">EQUIPOS</th>
                                 <th scope="col">JJ</th>
                                 <th scope="col">T</th>
                                 <th scope="col">D</th>
                                 <th scope="col">E</th>
                                 <th scope="col">PCT</th>
                                 <th scope="col">TCA</th>
                                <th scope="col">TCR</th>
                                <th scope="col">DIF</th>
                               </tr>
                             </thead>
                            `;

                let tbody = document.createElement("tbody");
                tbody.id = `tbody-${documento.data().Descripcion.split(' ').join('')}${nombreGrupo.data().Nombre.split(' ').join('')}`;

                tabla.appendChild(tbody);
                contenedorTabla.appendChild(tabla);
                divContenedorTablas.appendChild(contenedorTabla);
                contenedorStandings.appendChild(divContenedorTablas);
            }
        }));

        let numero = 1;
        let lastGrupo = "";
        let dataPCT = [];
        await Promise.all(standings.docs.map(async(s) => {

            // Verificar si el equipo pertenece a un grupo //
            if (s.data().grupo != "") {
                // Pertenece a un grupo
                // Se añadirá información adicional del grupo

                let equipo = await standing.leerEquipo(s.data().equipo);
                if (equipo != null) {
                    let nombreGrupo = await standing.leerGrupo(s.data().grupo);

                    dataPCT.push({
                        logotipo: equipo.data().Logotipo,
                        nombre: equipo.data().Nombre_completo,
                        idEquipo: equipo.id,
                        grupo: nombreGrupo.data().Nombre,
                        jj: s.data().jj,
                        t: s.data().t,
                        d: s.data().d,
                        e: s.data().e,
                        pct: s.data().pct,
                        tca: s.data().tca,
                        tcr: s.data().tcr,
                        dif: s.data().dif
                    });

                    // let tbody = document.getElementById(`tbody-${documento.data().Descripcion.split(' ').join('')}${nombreGrupo.data().Nombre.split(' ').join('')}`);
                    // tbody.innerHTML += `
                    //         <tr>
                    //             <th scope="row">${numero++}</th>
                    //             <td><img src="${equipo.data().Logotipo}" class="logotipo_Equipo"></td>
                    //             <td>${equipo.data().Nombre_completo}</td>
                    //             <td>${s.data().jj}</td>
                    //             <td>${s.data().t}</td>
                    //             <td>${s.data().d}</td>
                    //             <td>${s.data().e}</td>
                    //             <td>${s.data().pct}</td>
                    //         </tr>
                    //         `;
                }
            } else {
                // No pertenece a ningún grupo
                let equipo = await standing.leerEquipo(s.data().equipo);

                if (equipo != null) {

                    dataPCT.push({
                        logotipo: equipo.data().Logotipo,
                        nombre: equipo.data().Nombre_completo,
                        idEquipo: equipo.id,
                        grupo: "",
                        jj: s.data().jj,
                        t: s.data().t,
                        d: s.data().d,
                        e: s.data().e,
                        pct: s.data().pct,
                        tca: s.data().tca,
                        tcr: s.data().tcr,
                        dif: s.data().dif
                    });

                    // let tbody = document.getElementById(`tbody-${documento.data().Descripcion.split(' ').join('')}`);
                    // tbody.innerHTML += `
                    //         <tr>
                    //             <th scope="row">${numero++}</th>
                    //             <td><img src="${equipo.data().Logotipo}" class="logotipo_Equipo"></td>
                    //             <td>${equipo.data().Nombre_completo}</td>
                    //             <td>${s.data().jj}</td>
                    //             <td>${s.data().t}</td>
                    //             <td>${s.data().d}</td>
                    //             <td>${s.data().e}</td>
                    //             <td>${s.data().pct}</td>
                    //         </tr>
                    //         `;

                }

            }
        }));

        const resultados = groupBy(dataPCT, equipo => equipo.pct);


        for await (const resultado of resultados) {


            if (resultado[1].length == 1) {
                // Es un solo equipos //
                if (resultado[1][0].grupo == "")
                    ArmarRowEquipo(resultado[1][0], documento);
                else
                    ArmarRowEquipoGrupo(resultado[1][0], documento)

            } else if (resultado[1].length == 2) {
                // Son dos equipos empatados //
                // Revisará si los equipos ya jugaron para desempatar por el dominio //
                let Compilacion_Dominio = await VerificarPartidaDominio(resultado[1][0].idEquipo, resultado[1][1].idEquipo);

                if (Compilacion_Dominio == null) {
                    // No han jugado los dos equipos //
                    // Procederá a ordenar por la diferencia de carreras //

                    let ArrayEquipos = [resultado[1][0], resultado[1][1]];
                    let Diferencia_Ordenada = Ordenar_Diferencia_Carrera(ArrayEquipos);

                    for (const equipo of Diferencia_Ordenada) {
                        if (equipo.grupo == "")
                            ArmarRowEquipo(equipo, documento);
                        else
                            ArmarRowEquipoGrupo(equipo, documento);
                    }

                } else {
                    // Se revisará quien ganó para desempatar //
                    let ArrayEquipos = [resultado[1][0], resultado[1][1]];
                    let Diferencia_Dominio = Ordenar_Por_Dominio(Compilacion_Dominio.docs[0]);
                    for (const equipo of Diferencia_Dominio) {
                        // Armar row //
                        if (equipo.grupo == "")
                            ArmarRowEquipo(resultado[1].find((e) => e.idEquipo == equipo), documento);
                        else
                            ArmarRowEquipoGrupo(resultado[1].find((e) => e.idEquipo == equipo), documento);
                    }
                }

            } else if (resultado[1].length > 2) {
                // Mas de dos equipos empatados //
                // Procedera a ordenar por la diferencia de carreras //
                let ArrayEquipos = Ordenar_Diferencia_Carrera(resultado[1]);
                for (const equipo of ArrayEquipos) {
                    if (equipo.grupo == "")
                        ArmarRowEquipo(equipo, documento);
                    else
                        ArmarRowEquipoGrupo(equipo, documento);
                }
            }


        }


    } else {
        contenedorSinDatos.classList.remove("oculto");
    }
}

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}