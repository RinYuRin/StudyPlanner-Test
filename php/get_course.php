<?php
session_start();

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized. Please log in to view courses."]);
    exit();
}

require __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

try {
    $client = new Client("mongodb://localhost:27017");
    $database = $client->StudyPlanner;
    $collection = $database->courseman; // Use courseman collection
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not connect to MongoDB."]);
    exit();
}

// Fetch courses for the logged-in user
$email = $_SESSION['email'];
$courses = $collection->find(['email' => $email], ['projection' => ['courseId' => 1, 'courseTitle' => 1]]);

$courseArray = iterator_to_array($courses);

echo json_encode(["success" => true, "data" => $courseArray]);
?>
