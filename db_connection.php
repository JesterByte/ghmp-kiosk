<?php
$hostName = "localhost";
$serverUsername = "u714551035_ghmp";
$serverPassword = "P~t5GTVnuaZ";
$databaseName = "u714551035_ghmp_db";

// $hostName = "localhost";
// $serverUsername = "root";
// $serverPassword = "";
// $databaseName = "ghmp_db";

$conn = mysqli_connect($hostName, $serverUsername, $serverPassword, $databaseName);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}