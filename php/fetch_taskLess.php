<?php
session_start();

if (!isset($_SESSION['email'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["success" => false, "error" => "Unauthorized. Please log in."]);
    exit();
}

require __DIR__ . '/../vendor/autoload.php';
use MongoDB\Client;

try {
    $client = new Client("mongodb://localhost:27017");
    $collection = $client->StudyPlanner->taskman;

    $email = $_SESSION['email']; // Get the logged-in user's email

    // Fetch all tasks for the current user
    $tasks = $collection->find(['email' => $email])->toArray();

    // Format the tasks for frontend
    $taskList = [];
    foreach ($tasks as $task) {
        $taskList[] = [
            'taskId' => $task['taskId'],
            'title' => $task['title'],
            'description' => $task['description'],
            'creationDate' => $task['creationDate'], // e.g., "2024-12-04"
            'dueDate' => $task['dueDate'],           // e.g., "2024-12-07"
            'taskColor' => $task['taskColor'],
        ];
    }

    echo json_encode(["success" => true, "tasks" => $taskList]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error fetching tasks."]);
}
?>


