<?php

function userIsAdmin() {
  return isset($_SESSION['loggedin']) && isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

function parseQuizResult($result) {
  if (!$result->num_rows) {
    return false;
  }

  $row = mysqli_fetch_assoc($result);
  $row['steps'] = $row['steps'] ?? '[]';
  $steps = json_decode($row['steps'], true);

  return array_filter([
      'id' => $row['id'],
      'current_type' => $row['current_type'],
      'method_type' => $row['method_type'],
      'netlist' => $row['netlist'] ?? null,
      'image' => $row['image'],
      'difficulty' => $row['difficulty'],
      'steps' => $steps,
  ]);
}
function getAllQuizes(string $userId = null){
    global $DB;

    $result = $userId ? mysqli_query($DB, "SELECT completed_quiz_ids FROM users WHERE id = '$userId'") : null;

    if ($result && $result->num_rows) {
      $row = mysqli_fetch_assoc($result);
      $completedQuizIds = json_decode($row['completed_quiz_ids'] ?? '[]', true);
      if (count($completedQuizIds)) {
          $completedQuizIdsQuery = implode(',', $completedQuizIds);
          $result = mysqli_query(
              $DB,
              "SELECT id, current_type, method_type, image, difficulty, steps FROM quiz WHERE id NOT IN ($completedQuizIdsQuery) ORDER BY RAND() LIMIT 1"
          );

          if ($result->num_rows) {
              return parseQuizResult($result);
          }
      }

      clearUserCompletedQuizes($userId);
    }

     $result = mysqli_query($DB, "SELECT id, current_type, method_type, image, difficulty, steps FROM quiz ORDER BY RAND() LIMIT 1");

     return parseQuizResult($result);
}

function getQuiz(string $currentType, string $methodType, string $difficulty, string $userId = null) {
    global $DB;

  if (    !in_array($currentType, ['AC', 'DC'])
      ||  !in_array($methodType, ['MTN', 'MCR', 'MCM'])
      ||  !in_array($difficulty, ['1', '2', '3']))
  {
    return false;
  }

  $where = [
        ['current_type', $currentType],
        ['method_type', $methodType],
        ['difficulty', $difficulty]
    ];

    $where = array_reduce($where, function ($carry, $item) {
        $result = $carry ? $carry . ' AND ' : '';
        $result .= $item[0] . ' = "' . $item[1] . '"';
        return $result;
    });

    $result = $userId ? mysqli_query($DB, "SELECT completed_quiz_ids FROM users WHERE id = '$userId'") : null;

    // try to obtain a quiz that the user has not completed yet
    if ($result && $result->num_rows) {
        $row = mysqli_fetch_assoc($result);
        $completedQuizIds = json_decode($row['completed_quiz_ids'] ?? '[]', true);
        if (count($completedQuizIds)) {
            $altWhere = $where . ' AND id NOT IN (' . implode(',', $completedQuizIds) . ')';
            $result = mysqli_query($DB, "SELECT id, current_type, method_type, netlist, image, difficulty, steps FROM quiz WHERE $altWhere ORDER BY RAND() LIMIT 1");

            if ($result->num_rows) {
                return parseQuizResult($result);
            }

            clearUserCompletedQuizes($userId);
        }
    }

    $result = mysqli_query($DB, "SELECT id, current_type, method_type, netlist, image, difficulty, steps FROM quiz WHERE $where ORDER BY RAND() LIMIT 1");

    return parseQuizResult($result);
}

function getQuizById(string $id) {
  global $DB;

  $result = mysqli_query($DB, "SELECT * FROM quiz WHERE id = '$id' ORDER BY RAND() LIMIT 1");

  return parseQuizResult($result);
}

function userCompletedQuiz($userId, $quizId, $quizDifficulty, $nbCorrectAnswers): bool {
  global $DB;

  $result = mysqli_query($DB, "SELECT quiz_score, completed_quiz_ids FROM users WHERE id = '$userId'");
  if (!$result->num_rows) {
    return false;
  }

  $row = mysqli_fetch_assoc($result);

  $newScore = ($row['quiz_score'] ?? 0) + ($quizDifficulty * $nbCorrectAnswers);

  $quizIds = json_decode($row['completed_quiz_ids'] ?? '[]', true);
  $quizIds[] = $quizId;
  $quizIds = json_encode(array_unique($quizIds));

  return mysqli_query($DB, "UPDATE users SET quiz_score = '$newScore', completed_quiz_ids = '$quizIds' WHERE id = '$userId'");
}

function clearUserCompletedQuizes($userId): bool {
  global $DB;

  return mysqli_query($DB, "UPDATE users SET completed_quiz_ids = NULL WHERE id = '$userId'");
}

function getStepsByTheme(string $theme) {
  global $DB;

  $result = mysqli_query($DB, "SELECT id, current_type, method_type, image, steps FROM quiz ORDER BY RAND()");

  if (!$result || !$result->num_rows) {
    return false;
  }

  $data = [];

  while ($row = mysqli_fetch_assoc($result)) {
    $steps = json_decode($row['steps'], true);
    $stepNb = 0;
    $data = array_merge($data, array_map(function ($step) use ($theme, $row, &$stepNb) {
      $stepNb++;
      if ($step['theme'] !== $theme) {
        return null;
      }



      return array_filter([
          'quiz_id' => $row['id'],
          'step_nb' => $stepNb,
          'current_type' => $row['current_type'],
          'method_type' => $row['method_type'],
          'image' => $row['image'],
          'type' => $step['type'],
          'question' => $step['question'],
          'options' => $step['options'] ?? '',
          'step_image' => $step['step_image'] ?? '',
      ]);
    }, $steps));
  }

  return array_values(array_filter($data));
}
