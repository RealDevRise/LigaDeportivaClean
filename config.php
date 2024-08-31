<?php
    $mysqli = new mysqli("localhost", "root", "", "ligadeportiva");

    // Revisar conexion //
    if($mysqli->connect_error){
        die("Error de conexión: " . $mysqli->connect_error);
    }
?>