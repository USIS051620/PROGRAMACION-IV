<?php
/**
 * Importamos la conexion a la BD
 */
include('db.php');
//                  server, user, pass
$conexion = new DB('mysql:host=localhost;charset=utf8', 'root', '');
?>