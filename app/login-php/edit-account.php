<?php

require_once '../vendor/autoload.php';
require_once './db-connect.php';

if(isset($_SESSION['loggedin'])){
    $infoCodes = array();
    $email = $_SESSION['email'];

    if(!empty($_POST['edit-first-name']) && ($_POST['edit-first-name'] != $_SESSION['firstname']) ){
        $firstname = mysqli_real_escape_string($DB, $_POST['edit-first-name']);
        $sql = "UPDATE users SET first_name = '{$firstname}' WHERE email = '{$email}'";
        $result = mysqli_query($DB, $sql);
        if(!$result)
            die("MySQL query failed!" . mysqli_error($DB));
        array_push($infoCodes,"First Name Changed");
        $_SESSION['firstname'] = $firstname;
    }

    if(!empty($_POST['edit-last-name']) && ($_POST['edit-last-name'] != $_SESSION['lastname'])){
        $lastname = mysqli_real_escape_string($DB, $_POST['edit-last-name']);
        $sql = "UPDATE users SET last_name = '{$lastname}' WHERE email = '{$email}'";
        $result = mysqli_query($DB, $sql);
        if(!$result)
            die("MySQL query failed!" . mysqli_error($DB));
        array_push($infoCodes,"Last Name Changed");
        $_SESSION['last_name'] = $lastname;
    }

    if(!empty($_POST['edit-mech-nr']) && ($_POST['edit-mech-nr'] != $_SESSION['mechnr'])){
        $mechnr = mysqli_real_escape_string($DB, $_POST['edit-mech-nr']);
        $sql = "UPDATE users SET mech_nr = '{$mechnr}' WHERE email = '{$email}'";
        $result = mysqli_query($DB, $sql);
        if(!$result)
            die("MySQL query failed!" . mysqli_error($DB));
        array_push($infoCodes,"Mech Nr Changed");
        $_SESSION['mechnr'] = $mechnr;
    }

    if(!empty($_POST['edit-institution']) && ($_POST['edit-institution'] != $_SESSION['institution'])){
        $institution = mysqli_real_escape_string($DB, $_POST['edit-institution']);
        $sql = "UPDATE users SET institution = '{$institution}' WHERE email = '{$email}'";
        $result = mysqli_query($DB, $sql);
        if(!$result)
            die("MySQL query failed!" . mysqli_error($DB));
        array_push($infoCodes,"Institution Changed");
        $_SESSION['$institution'] = $institution;
    }

    echo json_encode($infoCodes);

}
else{
    echo false;
}
