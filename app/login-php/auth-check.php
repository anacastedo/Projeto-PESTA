<?php

require_once './db-connect.php';

if (isset($_SESSION['loggedin'])) {
    exit(json_encode([
        'auth' => true,
        'user' => [
            'firstname' => $_SESSION['firstname'],
            'lastname' => $_SESSION['lastname'],
            'email' => $_SESSION['email'],
            'mechnr' => $_SESSION['mechnr'],
            'institution' => $_SESSION['institution'],
            'name' => $_SESSION['firstname'] . ' ' . $_SESSION['lastname']
        ]
    ]));
}

exit(json_encode([
    'auth' => false,
]));
