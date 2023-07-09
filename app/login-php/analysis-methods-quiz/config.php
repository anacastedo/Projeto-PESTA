<?php
    require_once '../db-connect.php';
    require_once './common.inc.php';

    $currentType = $_POST['current_type'] ?? '';
    $methodType = $_POST['method_type'] ?? '';
    $difficulty = $_POST['difficulty'] ?? '';
    $quizId = userIsAdmin() ? ($_POST['quiz_id'] ?? '') : '';

    if ($quizId) {
      $quiz = getQuizById($quizId);
    }
    else if (userIsAdmin()) {
      $quiz = getQuiz($currentType, $methodType, $difficulty);
    }
    else {
      $quiz = getQuiz($currentType, $methodType, $difficulty, $_SESSION['user_id'] ?? null);
    }

    if (!$quiz) {
      exit(json_encode([
        'ok' => false
      ]));
    }

    $showEditQuizBtn = userIsAdmin();

    ob_start();
    include(__DIR__ . '/templates/base.php');
    $view = ob_get_clean();
    echo json_encode([
        'ok' => true,
        'quiz_id' => $quiz['id'],
        'html' => $view,
    ]);
