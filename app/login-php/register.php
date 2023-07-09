<?php

require_once '../vendor/autoload.php';
require_once './db-connect.php';
include 'email-sender.php';

// Status Messages
global $errorCodes, $emailExist, $fnameErr, $lnameErr, $emailErr, $mechErr, $instErr, $pwErr;

if (!isset($_POST['email'], $_POST['mech-nr'], $_POST['first-name'], $_POST['last-name'], $_POST['password'], $_POST['re-pass'])) {
  die('invalid input');
}

// Define and initialize variables
// Clean the form data before sending to database
$email = mysqli_real_escape_string($DB, trim($_POST['email']));
$first_name = mysqli_real_escape_string($DB, trim($_POST['first-name']));
$last_name = mysqli_real_escape_string($DB, trim($_POST['last-name']));
$mech = mysqli_real_escape_string($DB, trim($_POST['mech-nr']));
$institution = mysqli_real_escape_string($DB, trim($_POST['institution']));
$password = mysqli_real_escape_string($DB, trim($_POST['password']));
$re_password = mysqli_real_escape_string($DB, trim($_POST['re-pass']));

if (  empty($email)
    || empty($first_name)
    || empty($last_name)
    || empty($mech)
    || empty($password)
    || $password !== $re_password
    || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  die('invalid input');
}

$userExists = mysqli_query($DB, "SELECT * FROM users WHERE email = '{$email}' LIMIT 1");

if (mysqli_num_rows($userExists)) {
  $emailExist = "<div><strong><span class='text-lead text-danger mt-2 mb-2'>E-mail already exists!</span></strong></div>";
  $errorCodes['emailExistEn'] = $emailExist;
  $emailExist = "<div><strong><span class='text-lead text-danger mt-2 mb-2'>O e-mail fornecido já existe!</span></strong></div>";
  $errorCodes['emailExistPt'] = $emailExist;

  exit(json_encode($errorCodes));
}

// Validation

if(!preg_match("/^[a-zA-Z ]*$/", $first_name)) {
    $fnameErr = "<div><strong><span class='text-lead text-danger'>
                  Only letters and white space allowed (first name).
                  </span></strong></div>";
    $errorCodes['firstNameErr'] = $fnameErr;
}

if(!preg_match("/^[a-zA-Z ]*$/", $last_name)) {
  $lnameErr = "<div><strong><span class='text-lead text-danger'>
                Only letters and white space allowed (last name).
                </span></strong></div>";
  $errorCodes['lastNameErr'] = $lnameErr;
}

if(!preg_match("/^[a-zA-Z ]*$/", $institution)) {
  $instErr = "<div><strong><span class='text-lead text-danger'>
                Only letters and white space allowed (institution).
                </span></strong></div>";
  $errorCodes['institutionErr'] = $instErr;
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $emailErr= "<div><strong><span class='text-lead text-danger'>
                  Email format is invalid.
                  </span></strong></div>";
    $errorCodes['emailErr'] = $emailErr;
}

if(!preg_match("/^[0-9]{5,10}+$/", $mech)) {
    $mechErr = "<div><strong><span class='text-lead text-danger'>
                  Only numbers of 10-digit max allowed.
                  </span></strong></div>";
    $errorCodes['numberErr'] = $mechErr;
}

// TODO: password validation (actual: 4 - 16 chars / change to 6-10?)

if (!empty($errorCodes)) {
  exit(json_encode($errorCodes));
}

// Generate random activation token
$token = md5(rand().time());

// Password hash
$password_hash = password_hash($password, PASSWORD_BCRYPT);

// Query insertion
$insertQuery = "INSERT INTO users (role, email, first_name, last_name, mech_nr, institution, password, token, status, join_date,
nvm_sim, mcm_sim, bcm_sim, total_sim) VALUES ('student', '{$email}', '{$first_name}', '{$last_name}', '{$mech}', '{$institution}', 
'{$password_hash}', '{$token}', '1', now(), '0', '0', '0', '0')";

// Create mysql query
$sqlQuery = mysqli_query($DB, $insertQuery);

if(!$sqlQuery){
  die("MySQL query failed!" . mysqli_error($DB));
}

if ($sqlQuery) {
  exit(json_encode(['success' => true]));
}

/*
$message = createHTMLemail($firstname, $token, 0);
sendEmail($email, $message,"Email Verification"); */
