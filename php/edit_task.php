<?php
session_start();

require __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized. Please log in to update tasks."]);
    exit();
}

try {
    $client = new Client("mongodb://localhost:27017");
    $collection = $client->StudyPlanner->taskman;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not connect to MongoDB."]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['taskId'], $data['title'], $data['description'], $data['status'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid data received."]);
    exit();
}

$taskId = $data['taskId'];
$title = $data['title'];
$description = $data['description'];
$status = $data['status'];
$manualOverride = $data['manualOverride'] ?? false;

//this is to have the ability to edit task if js is in due or late
if (!$manualOverride) {
    $task = $collection->findOne(['taskId' => $taskId]);
    if ($task) {
        $dueDate = new DateTime($task['dueDate']);
        $today = new DateTime();

        if ($today->format('Y-m-d') === $dueDate->modify('-1 day')->format('Y-m-d')) {
            $status = 'Due';
        } elseif ($today > $dueDate) {
            $status = 'Late';
        }
    }
}

try {
    $collection->updateOne(
        ['taskId' => $taskId],
        ['$set' => [
            'title' => $title,
            'description' => $description,
            'status' => $status,
            'manualStatus' => true,
        ]]
    );
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not update task."]);
}
?>



