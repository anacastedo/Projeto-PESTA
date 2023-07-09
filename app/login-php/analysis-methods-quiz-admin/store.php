<?php
  require_once './common.inc.php';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    exit();
  }

  $attrs = postAttributes();

  if (!validateInput($attrs)) {
    http_response_code(400);
    exit();
  }

  $netlist = netlistFromUpload();
  $image = imageFromUpload();

  $attrs['steps'] = json_encode(parseSteps($attrs['steps']), JSON_UNESCAPED_UNICODE);

  $result = mysqli_query($DB, "INSERT INTO quiz (current_type, method_type, netlist, image, difficulty, steps) VALUES ('{$attrs['current_type']}', '{$attrs['method_type']}', '{$netlist}', '{$image}', {$attrs['difficulty']}, '{$attrs['steps']}')");

  if ($result) {
    exit(json_encode([
      'ok' => true,
      'id' => mysqli_insert_id($DB),
    ]));
  }

  echo json_encode([
    'ok' => false,
  ]);
