<?php
  require_once './common.inc.php';

  $id = trim(addslashes($_GET['id'] ?? ''));

  if (!$id) {
    http_response_code(400);
    exit();
  }

  $result = mysqli_query($DB, "SELECT * FROM quiz WHERE id = '{$id}'");

  if (!$result || mysqli_num_rows($result) == 0) {
    http_response_code(500);
    exit();
  }

  $quiz = mysqli_fetch_assoc($result);
  $quiz['steps'] = json_decode($quiz['steps'], true);

  ob_start();
  include(__DIR__ . '/templates/edit.php');
  $view = ob_get_clean();
  echo $view;
