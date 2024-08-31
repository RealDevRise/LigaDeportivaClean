<?php 
require_once $_SERVER['DOCUMENT_ROOT'] . "/config.php";

if(session_status() === PHP_SESSION_NONE){
    session_start();
}

if (!isset($_SESSION['id'])) {
    header("Location: /Login.php");
}

if( isset($_GET['id_noticia']) ){
    $idNoticia = $_GET['id_noticia'];
    $query = "SELECT * FROM noticias WHERE id=$idNoticia";
    $resultado = mysqli_query($mysqli, $query);
    $row = mysqli_fetch_assoc($resultado);

    echo json_encode($row);

}


?>