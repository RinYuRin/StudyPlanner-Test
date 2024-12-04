<?php
// Start the session for the current user
session_start();

// Validate if user is logged in
if (!isset($_SESSION['email'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["error" => "Unauthorized. Please log in to create tasks."]);
    exit();
}

// This is required
require __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

// For connection to MongoDB
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


if (!isset($data['title'], $data['description'], $data['creationDate'], $data['dueDate'], $data['startTime'], $data['endTime'], $data['taskColor'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid data received."]);
    exit();
}


$title = $data['title'];
$description = $data['description'];
$creationDate = $data['creationDate'];
$dueDate = $data['dueDate'];
$startTime = $data['startTime'];
$endTime = $data['endTime'];
$taskColor = $data['taskColor'];


$email = $_SESSION['email'];


$taskId = uniqid("task_", true);


$task = [
    'taskId' => $taskId,
    'email' => $email,
    'title' => $title,
    'description' => $description,
    'creationDate' => $creationDate,
    'dueDate' => $dueDate,
    'startTime' => $startTime,
    'endTime' => $endTime,
    'taskColor' => $taskColor,
    'status' => 'In Progress',
];

try {
    // Insert the task into MongoDB
    $insertResult = $collection->insertOne($task);
    echo json_encode(["success" => true, "taskId" => $taskId]); 
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not save task."]);
}
?>


