<?php

session_start();


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

$email = $_SESSION['email'];

$today = new DateTime();
$todayFormatted = $today->format('Y-m-d');

$tasks = $collection->find([
    'email' => $email,
    'creationDate' => $todayFormatted
]);

$taskArray = iterator_to_array($tasks);

if (count($taskArray) > 0) {
    echo json_encode(["success" => true, "tasks" => $taskArray]);
} else {
    echo json_encode(["success" => true, "tasks" => []]);
}
?>
