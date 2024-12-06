<?php
require __DIR__ . '/../vendor/autoload.php';

$client = new MongoDB\Client("mongodb://localhost:27017");
$db = $client->StudyPlanner;
$collection = $db->usercredential;

session_start();
$userEmail = $_SESSION['email'] ?? null;

if ($userEmail) {
    $user = $collection->findOne(['email' => $userEmail]);
    if ($user) {
        echo json_encode([
            'username' => $user['username'] ?? null,
            'userstatus' => $user['userstatus'] ?? null,
            'school' => $user['school'] ?? null,
            'usercourse' => $user['usercourse'] ?? null,
            'email' => $user['email'] ?? null,
            'usercontact' => $user['usercontact'] ?? null,
            'useraddress' => $user['useraddress'] ?? null,
            'profilePicture' => $user['profilePicture'] ?? null
        ]);
    } else {
        echo json_encode(['error' => 'User not found.']);
    }
} else {
    echo json_encode(['error' => 'No user logged in.']);
}
?>


