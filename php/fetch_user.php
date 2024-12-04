<?php
session_start();

require __DIR__ . '/../vendor/autoload.php';

$client = new MongoDB\Client("mongodb://localhost:27017");
$db = $client->StudyPlanner;
$collection = $db->usercredential;

header('Content-Type: application/json');

if (!isset($_SESSION['email'])) {
    echo json_encode(['error' => 'User not logged in.']);
    exit();
}

$email = $_SESSION['email'];
$user = $collection->findOne(['email' => $email]);

if ($user) {
    echo json_encode([
        'email' => $user['email'] ?? null,
        'name' => $user['name'] ?? null,
        'school' => $user['school'] ?? null,
        'status' => $user['status'] ?? null,
        'course' => $user['course'] ?? null,
        'contact' => $user['contact'] ?? null,
        'address' => $user['address'] ?? null
    ]);
} else {
    echo json_encode(['error' => 'User not found.']);
}
?>

