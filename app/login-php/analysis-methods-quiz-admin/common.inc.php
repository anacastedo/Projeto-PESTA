<?php
  require_once '../db-connect.php';

  // check if user is logged in and its role is admin
  if (!isset($_SESSION['loggedin']) || $_SESSION['role'] !== 'admin') {
    http_response_code(204);
    exit();
  }

  function sanitize($data) {
    if (is_array($data))
        return array_map(fn($val) => sanitize($val), $data);

    $data = trim($data);
    $data = addslashes($data);
    return $data;
  }

  function postAttributes() {
    return array_map(fn ($val) => sanitize($val), $_POST);
  }

  function validateInput(array $input) {
    if (!in_array($input['current_type'], ['AC', 'DC'])) {
      return false;
    }
    else if (!in_array($input['method_type'], ['MTN', 'MCM', 'MCR'])) {
      return false;
    }
    else if (!is_numeric($input['difficulty']) || $input['difficulty'] < 1 || $input['difficulty'] > 3) {
      return false;
    }

    return true;
  }

  function netlistFromUpload() {
    return (isset($_FILES['netlist']['tmp_name']) && $_FILES['netlist']['tmp_name'])? file_get_contents($_FILES['netlist']['tmp_name']) : '';
  }

  function imageFromUpload() {
    return (isset($_FILES['image']['tmp_name']) && $_FILES['image']['tmp_name']) ? base64_encode(file_get_contents($_FILES['image']['tmp_name'])) : '';
  }

function stepImageFromUpload(int $stepNb) {
    return (isset($_FILES['steps']['tmp_name'][$stepNb]['step_image']) && $_FILES['steps']['tmp_name'][$stepNb]['step_image']) ? base64_encode(file_get_contents($_FILES['steps']['tmp_name'][$stepNb]['step_image'])) : '';
}

  function parseSteps($steps) {
    $index = 0;

    $steps = array_map(function ($step) use (&$index) {
      if (!isset($step['type']) || !in_array($step['type'], ['free', 'free_numeric', 'multiple'])) {
        return null;
      }
      else if (!isset($step['question']) || !isset($step['answer'])) {
        return null;
      }
      else if ($step['type'] === 'multiple' && (!isset($step['options']) || !is_array($step['options']))) {
        return null;
      }

      $step['options'] = array_values(array_filter($step['options'], fn($val) => is_string($val) && strlen($val)));
      $step['hints'] = array_values(array_filter($step['hints']));
      $image = stepImageFromUpload($index);

      if ($image) {
          $step['step_image'] = $image;
      } else if (($step['remove_img'] ?? '') !== '1' && isset($step['image_encoded'])) {
          $step['step_image'] = $step['image_encoded'];
          unset($step['image_encoded']);
      }

      unset($step['remove_img']);

      if ($step['type'] === 'free') {
        unset($step['options']);
      }
      else if ($step['type'] === 'free_numeric') {
        $step['answer'] = (float) str_replace(',', '.', $step['answer']);
      }
      $index++;
      return array_filter($step, fn($val) => isset($val));
          }, $steps);

       $steps = array_filter($steps);

       return array_values($steps);
  }
