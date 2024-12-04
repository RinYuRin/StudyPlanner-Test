<?php
session_start();

if (!isset($_SESSION['email'])) {
    http_response_code(401); 
    echo json_encode(["error" => "Unauthorized. Please log in to get courses."]);
    exit();
}

require __DIR__ . '/../vendor/autoload.php';
use MongoDB\Client;

try {
    $client = new Client("mongodb://localhost:27017");
    $database = $client->StudyPlanner;
    $collection = $database->courseman;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not connect to MongoDB."]);
    exit();
}

// Get logged-in user's email
$email = $_SESSION['email'];

try {
    // Fetch courses for the logged-in user
    $courses = $collection->find(['email' => $email])->toArray();

    // Return the courses as JSON
    echo json_encode($courses);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not fetch courses."]);
}
?>
