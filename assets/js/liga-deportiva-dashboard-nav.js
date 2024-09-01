const sidebar_menu = document.getElementById("sidebar-container");
const navbar_menu = document.getElementById("navbar-dashboard");

sidebar_menu.innerHTML = `
<div class="logo">
<a href="/Dashboard/Principal.html">
    <img src="/assets/img/liga de ahome.png" alt="Liga Municipal de Ahome">
</a>
</div>
<div class="menu">
<a href="./Principal.html" class="d-block text-light p-3 border-0"><i class="fas fa-home fa-fw lead mr-2"></i>Principal</a>
<a href="./Noticias.html" class="d-block text-light p-3 border-0"><i class="fas fa-newspaper fa-fw lead mr-2"></i>Noticias</a>
<a href="./Calendario.html" class="d-block text-light p-3 border-0"> <i class="fas fa-calendar fa-fw lead mr-2"></i>Calendario</a>
<a href="./Temporadas.html" class="d-block text-light p-3 border-0"><i class="fas fa-baseball-ball fa-fw lead mr-2"></i>Temporadas</a>
<a href="./Categorias.html" class="d-block text-light p-3 border-0"><i class="fas fa-sitemap fa-fw lead mr-2"></i>Categorías</a>
<a href="./Equipos.html" class="d-block text-light p-3 border-0"><i class="fas fa-user-friends fa-fw lead mr-2"></i>Equipos</a>
<a href="./Personas.html" class="d-block text-light p-3 border-0"> <i class="fas fa-user-alt fa-fw lead mr-2"></i>Personas</a>
<a href="./Grupos.html" class="d-block text-light p-3 border-0"> <i class="fas fa-users fa-fw lead mr-2"></i>Grupos</a>
<a href="./ProgramacionJuegos.html" class="d-block text-light p-3 border-0"> <i class="fas fa-table fa-fw lead mr-2"></i>Programación de juegos</a>
<a href="./ProgramacionJuegos.html" class="d-block text-light p-3 border-0"> <i class="fas fa-clipboard fa-fw lead mr-2"></i>Compilación</a>
<a href="./Campos.html" class="d-block text-light p-3 border-0"> <i class="fas fa-map-marked fa-fw lead mr-2"></i>Campos</a>
<a href="./Patrocinadores.html" class="d-block text-light p-3 border-0"> <i class="fas fa-handshake fa-fw lead mr-2"></i>Patrocinadores</a>



</div>
`;

navbar_menu.innerHTML = `
                <div class="container">

                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        
                        <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
                            <li class="nav-item dropdown">
                                <a class="nav-link text-dark dropdown-toggle" href="#" id="menu-dropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="menu-dropdown">
                                    <a class="dropdown-item" href="#">Mi perfil</a>
                                    
                                    <div class="dropdown-divider"></div>
                                    <button id="btnlogOut" type="button" class="dropdown-item">Cerrar sesión</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
`;