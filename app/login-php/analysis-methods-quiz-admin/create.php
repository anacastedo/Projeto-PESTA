<?php
  require_once './common.inc.php';

  $quiz = [
      'steps' => [
          [
              'type' => 'free',
              'question' => '',
              'answer' => ''
          ]
      ]
  ];

  ob_start();
  include(__DIR__ . '/templates/create.php');
  $view = ob_get_clean();
  echo $view;
