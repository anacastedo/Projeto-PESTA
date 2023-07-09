<?php
  require_once '../db-connect.php';
  require_once 'common.inc.php';

  $theme = $_POST['theme'] ?? '';
  $stepCount = (int) ($_POST['step_count'] ?? 0);
  $stepCount = max($stepCount, 0);

  $steps = getStepsByTheme($theme);
  $step = $steps[$stepCount] ?? null;

  if (!$step) {
    exit(json_encode([
      'ok' => false
    ]));
  }

  $internalStepNb = $step['step_nb'];
  $stepNb = $stepCount + 1;

  $quiz = [
      'id' => $step['quiz_id'],
      'image' => $step['image'],
      'current_type' => $step['current_type'],
      'method_type' => $step['method_type'],
      'steps' => [$step],
  ];

  ob_start();
  include(__DIR__ . '/templates/base.php');
  $view = ob_get_clean();

  echo json_encode([
    'ok' => true,
    'html' => $view,
  ]);
