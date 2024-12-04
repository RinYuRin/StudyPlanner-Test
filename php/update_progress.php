<?php
// Start the session
session_start();

// Check if the user is logged in
if (!isset($_SESSION['email'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["error" => "Unauthorized. Please log in to update tasks."]);
    exit();
}

// Include MongoDB library
require __DIR__ . '/../vendor/autoload.php'; // Composer autoload for MongoDB

use MongoDB\Client;

// Database connection
try {
    $client = new Client("mongodb://localhost:27017"); // Replace with your MongoDB URI if different
    $database = $client->StudyPlanner; // Database name
    $collection = $database->taskman; // Collection name
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not connect to MongoDB."]);
    exit();
}

// Get POST data
try {
    $data = json_decode(file_get_contents("php://input"), true);

    // Extract taskId and status from the request
    $taskId = $data['taskId'];
    $newStatus = $data['status'];

    if (!$taskId || !$newStatus) {
        echo json_encode(["error" => "Task ID or Status missing."]);
        http_response_code(400);
        exit;
    }

    // Convert taskId to MongoDB ObjectId
    $mongoId = new MongoDB\BSON\ObjectId($taskId);

    // Access the collection
    $collection = $db->taskman; // Ensure this matches your collection name

    // Update the task status
    $updateResult = $collection->updateOne(
        ['_id' => $mongoId], // Query
        ['$set' => ['progress' => $newStatus]] // Update
    );

    if ($updateResult->getModifiedCount() === 0) {
        echo json_encode(["error" => "No task found or status unchanged."]);
        http_response_code(404);
        exit;
    }

    echo json_encode(["message" => "Task status updated successfully!"]);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
    http_response_code(500);
    exit;
}
?>

