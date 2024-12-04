<?php

session_start();

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized. Please log in to get notif."]);
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
    echo json_encode(["error" => "Could not connect to MongoDB"]);
    exit();
}

$email = $_SESSION['email'];

// get today's date and tomorrow's date
$today = new DateTime();
$today->setTime(0, 0);
$tomorrow = new DateTime('+1 day');
$tomorrow->setTime(23, 59, 59);

try {
    $tasks = $collection->find([
        'email' => $email,
        'dueDate' => [
            '$gte' => $today->format('Y-m-d\TH:i:s'),
            '$lte' => $tomorrow->format('Y-m-d\TH:i:s')
        ]
    ]);

    $result = [];
    foreach ($tasks as $task) {
        $result[] = [
            'title' => $task['title'],
            'description' => $task['description'],
            'dueDate' => $task['dueDate'],
        ];
    }

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not fetch tasks"]);
}
?>
