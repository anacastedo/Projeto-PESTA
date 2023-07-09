<?php

require_once '../db-connect.php';
require_once './common.inc.php';

$quizId = addslashes($_GET['quiz_id'] ?? '');
$asset = addslashes($_GET['asset'] ?? '');

if (!$quizId || !in_array($asset, ['image', 'netlist'])) {
    http_response_code(400);
    exit('Invalid input');
}

$quiz = getQuizById($quizId);

if (!$quiz) {
    http_response_code(400);
    exit('Quiz not found');
}

if ($asset === 'image') {
    $image = $quiz['image']; // base64 encoded image

    $image_content = base64_decode($image); // decode image

    // get image type
    $f = finfo_open();
    $mime_type = finfo_buffer($f, $image_content, FILEINFO_MIME_TYPE);
    $extension = finfo_buffer($f, $image_content, FILEINFO_EXTENSION);

    finfo_close($f);

    // send image as response (download)
    header('Content-Type: ' . $mime_type);
    header('Content-Disposition: attachment; filename="image.' . $extension . '"');
    exit(base64_decode($image));
}
else if ($asset === 'netlist') {
	$netlist = $quiz['netlist']; // text content

	// send netlist as response (download)
	header('Content-Type: text/plain');
	header('Content-Disposition: attachment; filename="netlist.txt"');
	exit($netlist);
}