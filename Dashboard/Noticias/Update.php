<?php 
require_once $_SERVER['DOCUMENT_ROOT'] . "/config.php";

if(session_status() === PHP_SESSION_NONE){
    session_start();
}

if (!isset($_SESSION['id'])) {
    header("Location: /Login.php");
}

if( isset($_POST['titulo']) && isset($_POST['descripcionCorta']) && isset($_POST['descripcion']) && isset($_POST['idnoticia'])  ){
    
    $id_noticia = $_POST['idnoticia'];
    $id_autor = $_SESSION['id'];
    $titulo = $_POST['titulo'];
    $descripcionCorta = $_POST['descripcionCorta'];
    $contenido = $_POST['descripcion'];
    $fechaPublicacion = date("Y-m-d");

    $query = "UPDATE noticias SET titulo = '$titulo', descripcion_corta = '$descripcionCorta', contenido = '$contenido', fecha_publicacion = '$fechaPublicacion' WHERE id = '$id_noticia'";
    $resultado = mysqli_query($mysqli, $query);

    if($resultado){
        echo "OK";
    }
    else{
        die(mysqli_error($mysqli));
    }

}else{
    echo 'ERRDATA';
}


?>