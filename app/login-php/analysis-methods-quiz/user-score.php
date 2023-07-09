<?php
    require_once '../db-connect.php';

    if (!isset($_SESSION['loggedin']) || !isset($_SESSION['id'])) {
      http_response_code(204);
      exit();
    }

    $user_id = $_SESSION['id'];
    $result = mysqli_query($DB, "SELECT quiz_score FROM users WHERE id = $user_id");

    if (!$result || !$result->num_rows) {
      http_response_code(500);
      exit();
    }

    $row = $result->fetch_assoc();
    $row['quiz_score'] = (int) $row['quiz_score'];

    exit(json_encode($row));
