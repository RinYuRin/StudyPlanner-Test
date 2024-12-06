<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['email'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["error" => "Unauthorized. Please log in."]);
    exit();
}

// MongoDB connection
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

// Decode incoming JSON data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['taskId'], $data['starred'])) {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "Invalid data received."]);
    exit();
}

$taskId = $data['taskId'];
$starred = $data['starred'];

// Update the task's starred field
try {
    $updateResult = $collection->updateOne(
        ['taskId' => $taskId, 'email' => $_SESSION['email']],
        ['$set' => ['starred' => $starred]]
    );

    if ($updateResult->getModifiedCount() > 0) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(["error" => "Task not found or no changes made."]);
    }
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Failed to update task."]);
}
?>
