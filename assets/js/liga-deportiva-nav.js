const nav = document.getElementById('liga-deportiva-nav');
const sidebar = document.getElementById('sidenav-menu');
const footer = document.getElementById('liga-deportiva-footer');
const nombreSitio = "Liga Municipal de Ahome";
const fileLogo = "liga de ahome.png";

nav.innerHTML = `
    <div class="container-menu">
        <div class="logotipo">
            <a href="/index.html">
                <img src="/assets/img/${fileLogo} " alt="${nombreSitio} ">
            </a>
        </div>

        <div class="menu">
            <a href="/index.html" id='menu-inicio'>Inicio</a>
            <a href="/noticias.html" id='menu-noticias'>Noticias</a>
            <div class="dropdownd">
                <button id='menu-liga' class="dropbtn">Liga
                    <i class="fa fa-caret-down"></i>
                </button>
                <div class="dropdown-content">
                    <a href="/liga/estadisticas.html">Estadísticas</a>
                    <a href="/liga/rosters.html">Roster de equipos</a>
                    <a href="/liga/posiciones.html">Standing</a>

                    
                </div>
            </div>
            
            <a href="/calendario.html" id='menu-calendario'>Calendario</a>

            
            
            <a href="#" id='menu-acerca'>Acerca de</a>
            
        </div>

        <button class="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
`;

sidebar.innerHTML = `
    <div class="header-sidenav">
        <h1>Liga de Ahome</h1>
        <div><a id="sidenav-cerrar" href="javascript:void(0)" class="cerrarSide">&times;</a></div>
    </div>
    <a href="/index.html" id='sidemenu-inicio'>Inicio</a>
    <a href="/noticias.html" id='sidemenu-noticias'>Noticia</a>
    <button class="dropdown-btn">Liga
        <i class="fa fa-caret-down"></i>
    </button>
    <div class="dropdown-container">
        <a href="/liga/estadisticas.html">Estadísticas</a>
        <a href="/liga/rosters.html">Roster de Equipos</a>
        <a href="/liga/posiciones.html">Standing</a>
        
    </div>
    
    <a href="/calendario.html" id='sidemenu-calendario'>Calendario</a>
    
    <a href="#" id='sidemenu-acerca'>Acerca de</a>
    
`;

footer.innerHTML = `
<div class="container-footer">
            <img class="logo-footer" src="/assets/img/${fileLogo} " alt="${nombreSitio} ">

            <div class="lista-menu-footer">
                <a href="/index.html">Inicio</a>
                <a href="/noticias.html">Noticia</a>
                <a href="#">Liga</a>
                <a href="/calendario.html">Calendario</a>
                <a href="/resultados.html">Resultados</a>
                <a href="#">Acerca de</a>
            </div>

            <div class="redes-sociales">
                <i class="fab fa-facebook-square"></i>
                <i class="fab fa-instagram"></i>
                <i class="fab fa-twitter"></i>
                <i class="fab fa-youtube"></i>
            </div>
            <hr>

            <div class="copyright">
                <p>${nombreSitio}  &copy;${new Date().getFullYear()}</p>
            </div>
        </div>
`;


const menu = document.querySelector('.hamburger');
const sidebarNavClose = document.getElementById('sidenav-cerrar');
const sidebarNav = document.getElementById('sidenav-menu');
const htmlSelector = document.querySelector('html');

const abrirFrameCategoria = (categoria) =>{

};


menu.addEventListener('click', function(e) {
    e.stopPropagation();
    sidebarNav.style.transform = "translateX(0)";
});

sidebarNav.addEventListener('click', function(e) {
    e.stopPropagation();
});

sidebarNavClose.addEventListener('click', function() {
    sidebarNav.style.transform = "translateX(100%)";
});

htmlSelector.addEventListener('click', function() {
    sidebarNav.style.transform = "translateX(100%)";
});

document.querySelector('title').textContent += nombreSitio;
