<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://kit.fontawesome.com/319ba68859.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="/assets/css/liga-deportiva-elements.css">
    <link rel="stylesheet" href="/assets/css/noticias.css">
    <link rel="stylesheet" href="/assets/css/liga-deportiva-articulo.css">
    <link rel="stylesheet" href="/assets/css/lightbox.min.css">
    <title id="siteTitle">Noticias - </title>
</head>



<body>
    <nav id="liga-deportiva-nav"></nav>
    <div id="sidenav-menu" class="sidenav"></div>

    <div class="seccion-header-modulo">
        <div class="header-modulo-wrapperParallax">
            <div id="background_noticia" class="header-module-background"></div>
        </div>
        <div class="seccion-wrapper experiencia-modulo-wrapper">
            <header class="experiencia-header-wrapper">
                <h2 class="heading-03 titulo-experiencia">
                    <span class="span-headerTitulo" id="span_titulo_noticia"></span>
                </h2>
            </header>
        </div>
    </div>

    <div class="container">

        <div class="autorFecha">
            <div>Autor: <span id="span_autor_noticia"></span></div>
            <span class="fechaArticulo" id="span_fecha_noticia"></span>
        </div>

        <div id="contenedor_articulo" class="contenido-articulo">
            
        </div>

        <div>
            <div class="separador">
                <span>Galería</span>
                <hr>
            </div>

            <div id="contenedor_galeria_imagenes" class="galeriaFotos">
                
            </div>
        </div>

    </div>

    <style>
    .contenido-articulo{
        color: white !important;
    }
</style>

    <footer id="liga-deportiva-footer" class="liga--footer"></footer>
    <script src="/assets/js/liga-deportiva-nav.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="/assets/js/lightbox-plus-jquery.min.js"></script>
    <script type="module" src="/assets/js/loadNoticias.js"></script>

    <script>
        $(window).scroll(function() {
            $(".header-module-background").css("background-position", "50% " + ($(this).scrollTop() / 2) + "px");
        });

        document.getElementById('menu-noticias').classList.add('activo');
        document.getElementById('sidemenu-noticias').classList.add('activo');

        var dropdown = document.getElementsByClassName("dropdown-btn");
        var i;

        for (i = 0; i < dropdown.length; i++) {
            dropdown[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var dropdownContent = this.nextElementSibling;
                if (dropdownContent.style.display === "block") {
                    dropdownContent.style.display = "none";
                } else {
                    dropdownContent.style.display = "block";
                }
            });
        }
    </script>
</body>

</html>