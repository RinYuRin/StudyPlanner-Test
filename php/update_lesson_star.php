<?php
session_start();

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized. Please log in to update lesson star status."]);
    exit();
}

require __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

try {
    $client = new Client("mongodb://localhost:27017");
    $database = $client->StudyPlanner;
    $collection = $database->lessonman;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not connect to MongoDB."]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['lessonId'], $data['starred'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid data received."]);
    exit();
}

$lessonId = $data['lessonId'];
$starred = $data['starred'];

try {
    $result = $collection->updateOne(
        ['lessonId' => $lessonId],
        ['$set' => ['starred' => $starred]]
    );

    if ($result->getMatchedCount() === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Lesson not found."]);
        exit();
    }

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not update star status."]);
}
?>
