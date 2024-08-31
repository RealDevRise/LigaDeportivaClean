<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/config.php";

if(session_status() === PHP_SESSION_NONE){
    session_start();
}

if (!isset($_SESSION['id'])) {
    header("Location: /Login.php");
}

if( isset($_POST['id_noticia'])  ){
    
    $id_noticia = $_POST['id_noticia'];
    $query = "DELETE FROM noticias WHERE id = '$id_noticia'";
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