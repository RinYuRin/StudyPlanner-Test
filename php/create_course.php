<?php
session_start();

if (!isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized. Please log in to create courses."]);
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


$data = json_decode(file_get_contents('php://input'), true);

// Validate the required fields
if (!isset($data['courseTitle'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid data received. 'courseTitle' is required."]);
    exit();
}


$courseTitle = $data['courseTitle'];
$coursePicture = $data['coursePicture'] ?? null; 
$email = $_SESSION['email']; 


$courseId = uniqid("course_", true);


$course = [
    'courseId' => $courseId,
    'email' => $email,
    'courseTitle' => $courseTitle,
    'coursePicture' => $coursePicture, 
    'creationDate' => date('Y-m-d H:i:s'), 
];

try {
 
    $courseCount = $collection->countDocuments(['email' => $email]);
    if ($courseCount >= 6) {
        http_response_code(400);
        echo json_encode(["error" => "You can only create up to 6 courses."]);
        exit();
    }

    
    $insertResult = $collection->insertOne($course);
    echo json_encode(["success" => true, "courseId" => $courseId]); 
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Could not save course."]);
}
?>

