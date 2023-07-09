<?php
    require_once '../db-connect.php';
    require_once './common.inc.php';

    $quizId = addslashes($_POST['quiz_id'] ?? '');
    $stepNb = addslashes($_POST['step_nb'] ?? '');
    $userAnswer = addslashes(trim($_POST['answer'] ?? ''));
    $hintDisplayedCount = (int) addslashes($_POST['hint_displayed_count'] ?? '');
    $theme = addslashes($_POST['theme'] ?? '');

     if (!$quizId || !$stepNb || !is_numeric($quizId) || !is_numeric($stepNb) || !strlen($userAnswer)) {
        http_response_code(400);
        exit('Invalid input');
    }

    $quiz = getQuizById($quizId);

    if (!$quiz) {
        exit(json_encode([
            'ok' => false
        ]));
    }

    $steps = $quiz['steps'];
    $stepNb = (int) $stepNb;
    $currentStep = $steps[$stepNb - 1] ?? null;

    $isCorrect = strtolower($currentStep['answer']) === strtolower($userAnswer);
    $hasMoreHints = $hintDisplayedCount < count($currentStep['hints'] ?? []);

    if ($stepNb === 1) {
      // reset session results for the current quiz
      $_SESSION['quiz_temp_results'][$quizId] = null;
    }

    if ($isCorrect && !$theme) {
      $quizTempResults = $_SESSION['quiz_temp_results'] ?? [];
      $quizTempResults[$quizId] = $quizTempResults[$quizId] ?? [];
      $quizTempResults[$quizId]['nb_correct_answers'] = ($quizTempResults[$quizId]['nb_correct_answers'] ?? 0) + 1;
      $_SESSION['quiz_temp_results'] = $quizTempResults;
    }

    if (!$theme && ($stepNb === count($steps) && ($isCorrect || !$hasMoreHints) && $_SESSION['loggedin'] && isset($_SESSION['id']))) {
      // quiz ended and user is logged in --> save results
      userCompletedQuiz($_SESSION['id'], $quizId, $quiz['difficulty'], $_SESSION['quiz_temp_results'][$quizId]['nb_correct_answers'] ?? 0);

      $_SESSION['quiz_temp_results'][$quizId] = null;
    }

    if (!$theme && ($isCorrect || !$hasMoreHints)) {
      $nextStep = $steps[$stepNb] ?? null;

      if ($nextStep) {
        ob_start();
        $stepNb++;
        $step = $nextStep;
        include(__DIR__ . '/templates/step.php');
        $view = ob_get_clean();
      }
    }

    if ($isCorrect) {
      exit(json_encode([
          'ok' => true,
          'is_correct' => true,
          'next_step_html' => $view ?? null,
      ]));
    }

    if ($hasMoreHints) {
      exit(json_encode([
          'ok' => true,
          'is_correct' => false,
          'hint' => $currentStep['hints'][$hintDisplayedCount],
      ]));
    }

    exit(json_encode([
      'ok' => true,
      'is_correct' => false,
      'type' => $currentStep['type'],
      'answer' => $currentStep['answer'],
      'next_step_html' => $view ?? null,
  ]));
