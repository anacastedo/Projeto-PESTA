<?php

require_once './common.inc.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(400);
    exit();
}

$attrs = postAttributes();
$id = $attrs['id'] ?? null;

if (!$id || !validateInput($attrs)) {
    http_response_code(400);
    exit();
}

$attrs['netlist'] = netlistFromUpload();
if (!$attrs['netlist']) {
    unset($attrs['netlist']);
}

$attrs['image'] = imageFromUpload();
if (!$attrs['image']) {
    unset($attrs['image']);
}

$attrs['steps'] = json_encode(parseSteps($attrs['steps']), JSON_UNESCAPED_UNICODE);

$columns = [];

foreach ($attrs as $key => $value) {
    $columns[] = "$key = '$value'";
}

$columns = implode(', ', $columns);

$result = mysqli_query($DB, "UPDATE quiz SET $columns WHERE id = '$id'");

if ($result) {
    exit(json_encode([
        'ok' => true,
    ]));
}

echo json_encode([
    'ok' => false,
]);
