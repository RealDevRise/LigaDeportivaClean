<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/config.php";

if(session_status() === PHP_SESSION_NONE){
    session_start();
}


// Asignación del número de noticias a mostrar //
$limite = 5;
$pagina = isset($_GET['page']) ? $_GET['page'] : 1;
$inicio = ($pagina - 1) * $limite;
$idusr = $_SESSION["id"];

// Obtener las noticias con limite para la paginacion //
$sql = "SELECT * FROM noticias WHERE id_autor_usuario = '$idusr' LIMIT $inicio, $limite";
$resultado = $mysqli->query($sql);

// if(mysqli_num_rows($resultado) > 0){
//     while($row = mysqli_fetch_array($resultado)){
//         echo '
//         <div class="card-body">
//             <h5 class="card-title">'.$row["titulo"].'</h5>
//             <p class="card-text">Fecha de publicación: <span class="noticia-fecha-publicacion">'.$row["fecha_publicacion"].'</span></p>
//             <button data-id="'.$row["id"].'" class="btn btn-primary">Editar</button>
//             <button class="btn btn-danger">Eliminar</button>
//         </div>
//         ';
//     }
// }


$noticias = $resultado->fetch_all(MYSQLI_ASSOC);


// Contar el número total de noticias //
$sql_2 = "SELECT count(id) as id FROM noticias WHERE id_autor_usuario = '$idusr'";
$resultado_2 = $mysqli->query($sql_2);
$contadorNoticia = $resultado_2->fetch_all(MYSQLI_ASSOC);
$numeroTotal_Noticias = $contadorNoticia[0]['id'];
$paginas = ceil($numeroTotal_Noticias / $limite);

// Funcion para los botones de paginacion 'Siguiente' y 'Anterior' //
$paginacion_anterior = $pagina - 1;
$paginacion_siguiente = $pagina + 1;



?>