<?php
  require_once '../db-connect.php';
  require_once './common.inc.php';

  if (!userIsAdmin()) {
    http_response_code(204);
    exit();
  }

   $result = mysqli_query($DB, "SELECT id FROM quiz ORDER BY id ASC");

   $quizIds = [];

   while ($row = mysqli_fetch_assoc($result)) {
       $quizIds[] = $row['id'];
    }

    exit(json_encode($quizIds));