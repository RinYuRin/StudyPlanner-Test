<?php
session_start();

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized. Please log in."]);
    exit();
}

require __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

try {
    $client = new Client("mongodb://localhost:27017");
    $database = $client->StudyPlanner;
    $courseCollection = $database->courseman; 
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not connect to MongoDB."]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['courseId'])) {
    http_response_code(400);
    echo json_encode(["error" => "Course ID is required."]);
    exit();
}

$courseId = $data['courseId'];

try {
    $course = $courseCollection->findOne(['courseId' => $courseId]);

    if (!$course) {
        http_response_code(404);
        echo json_encode(["error" => "Course not found."]);
        exit();
    }

    echo json_encode($course); 
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not fetch course details."]);
}
?>
