<?php
    require_once '../db-connect.php';
    require_once './common.inc.php';

    $quiz = getAllQuizes($_SESSION['id'] ?? null);

    if (!$quiz) {
      exit(json_encode([
        'ok' => false
      ]));
    }

    ob_start();
    include(__DIR__ . '/templates/base.php');
    $view = ob_get_clean();
    echo json_encode([
        'ok' => true,
        'html' => $view,
    ]);