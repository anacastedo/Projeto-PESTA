<?php

/**
 * Login System
 *  Error Code 1: Email doesnt exist
 *  Error Code 2: Invalid Email or Password
 *  Error Code 3: Account not verified
 *  Error Code 4: Email empty
 *  Error Code 5: Password empty
 */

require_once '../vendor/autoload.php';
require_once './db-connect.php';

$_SESSION['loggedin'] = false;

$email    = $_POST['email-login'] ?? '';
$password = $_POST['password-login'] ?? '';

// Clean input data
$user_email = filter_var($email, FILTER_SANITIZE_EMAIL);
$pswd = mysqli_real_escape_string($DB, $password);

if (!$user_email) {
    exit(json_encode([4]));
}
else if (!$pswd) {
    exit(json_encode([5]));
}

// Check if user exists
$result = mysqli_query($DB, "SELECT * FROM users WHERE email = '{$email}' LIMIT 1");
if (!$result) {
    die("SQL query failed: " . mysqli_error($DB));
}
else if ($result->num_rows <= 0) {
    exit(json_encode([1]));
}

// Fetch user data
$row = mysqli_fetch_array($result);

if (! password_verify($password, $row['password'])) {
    exit(json_encode([2]));
}

// Allow only verified users to login
if ($row['status'] !== '1') {
    exit(json_encode([3]));
}

// Store user data in session
$_SESSION['loggedin'] = true;
$_SESSION['id'] = $row['id'];
$_SESSION['role'] = $row['role'];
$_SESSION['firstname'] = $row['first_name'];
$_SESSION['lastname'] = $row['last_name'];
$_SESSION['email'] = $row['email'];
$_SESSION['mechnr'] = $row['mech_nr'];
$_SESSION['institution'] = $row['institution'];
$_SESSION['token'] = $row['token'];

exit(json_encode([]));
