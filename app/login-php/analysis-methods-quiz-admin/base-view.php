<?php
  require_once './common.inc.php';

  ob_start();
  include(__DIR__ . '/templates/base.php');
  $view = ob_get_clean();
  echo $view;
