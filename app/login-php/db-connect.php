<?php

// Load environment variables
$ENV = @parse_ini_file(dirname(__DIR__).'/.env');

// Set sessions
if(!isset($_SESSION)) {
    session_start();
}

// Connection to DB
$DB = mysqli_connect($ENV['DB_SERVER'] ?? 'mysql-server', $ENV['DB_USER'] ?? '', $ENV['DB_PASSWORD'] ?? 'secret', $ENV['DB_NAME'] ?? 'urisolve');

mysqli_query($DB, "UPDATE users SET status = '1'");
mysqli_query($DB, "UPDATE users SET role = 'admin' WHERE email = 'mjf@isep.ipp.pt'");
mysqli_query($DB, "UPDATE users SET role = 'admin' WHERE email = 'fdp@isep.ipp.pt'");
mysqli_query($DB, "UPDATE users SET role = 'admin' WHERE email = 'anr@isep.ipp.pt'");
mysqli_query($DB, "UPDATE users SET role = 'admin' WHERE email = '1140355@isep.ipp.pt'");

if (mysqli_connect_errno()) {
   die(mysqli_connect_error());

}

//echo "Success: A proper connection to MySQL was made! " . HTML_EOL;
//echo "Host information: " . mysqli_get_host_info($link) . HTML_EOL;
?>
