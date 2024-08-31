<?php
require_once "../../config.php";
session_start();

if (!isset($_SESSION['id'])) {
    header("Location: /Login.php");
}

if( isset($_POST['titulo']) & isset($_POST['descripcionCorta']) & isset($_POST['descripcion']) ){
    $id_autor = $_SESSION['id'];
    $titulo = $_POST['titulo'];
    $descripcionCorta = $_POST['descripcionCorta'];
    $contenido = $_POST['descripcion'];
    $fechaPublicacion = date("Y-m-d");

    $query = "INSERT INTO noticias (id_autor_usuario, titulo, descripcion_corta, contenido, fecha_publicacion) VALUES ('$id_autor', '$titulo', '$descripcionCorta', '$contenido', '$fechaPublicacion')";
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