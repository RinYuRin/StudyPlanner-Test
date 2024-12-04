<?php
session_start();

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized. Please log in to create notes."]);
    exit();
}

require __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;


try {
    $client = new Client("mongodb://localhost:27017");
    $database = $client->StudyPlanner;
    $collection = $database->lessonman; 
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not connect to MongoDB."]);
    exit();
}


$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['noteTitle'], $data['noteDescription'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid data received."]);
    exit();
}

$note = [
    'lessonId' => uniqid("lesson_", true),
    'email' => $_SESSION['email'],
    'lessonTitle' => $data['noteTitle'],
    'courseId' => $data['courseId'],
    'lessonDescription' => $data['noteDescription'],
    'createdAt' => date('Y-m-d H:i:s'),
];

try {
    $collection->insertOne($note);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not save the note."]);
}
?>