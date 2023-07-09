<?php
  require_once './common.inc.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    exit();
  }

  $id = trim(addslashes($_POST['id'] ?? ''));

  if ($id) {
    $result = mysqli_query($DB, "DELETE FROM quiz WHERE id = '{$id}'");

    if ($result === true) {
      exit(
      json_encode([
          'ok' => true,
      ])
      );
    }
  }

  echo json_encode([
    'ok' => false,
  ]);
