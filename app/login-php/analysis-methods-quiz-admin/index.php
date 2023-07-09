<?php
  require_once './common.inc.php';

  $result = mysqli_query($DB, 'SELECT id, current_type, method_type, difficulty, JSON_LENGTH(steps) AS step_count FROM quiz');

  ob_start();
  include(__DIR__ . '/templates/index.php');
  $view = ob_get_clean();
  echo $view;
