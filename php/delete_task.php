<?php
session_start();

// Validate if user is logged in
if (!isset($_SESSION['email'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["error" => "Unauthorized. Please log in to delete tasks."]);
    exit();
}

// This is required
require __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

try {
    $client = new Client("mongodb://localhost:27017");
    $database = $client->StudyPlanner;
    $collection = $database->taskman;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not connect to MongoDB."]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

// Validate required data
if (!isset($data['taskId'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid data received."]);
    exit();
}

$taskId = $data['taskId'];
$email = $_SESSION['email'];

try {
    $deleteResult = $collection->deleteOne(['taskId' => $taskId, 'email' => $email]);
    
    if ($deleteResult->getDeletedCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Task not found or unauthorized."]);
        exit();
    }

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not delete task."]);
}
?>



