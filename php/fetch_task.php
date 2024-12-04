<?php

session_start();

// Validate if the user is logged in
if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized. Please log in to view tasks."]);
    exit();
}

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

// Get the user's email from session
$email = $_SESSION['email'];

$tasks = $collection->find(['email' => $email]);

$taskArray = iterator_to_array($tasks);
echo json_encode($taskArray);

?>



