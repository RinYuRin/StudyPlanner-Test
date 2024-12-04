<?php
require __DIR__ . '/../vendor/autoload.php';

session_start();


$client = new MongoDB\Client("mongodb://localhost:27017");

$db = $client->StudyPlanner;
$collection = $db->usercredential;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $email = htmlspecialchars($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $school = htmlspecialchars($_POST['school']);

    $existingUser = $collection->findOne(['email' => $email]);
    if ($existingUser) {
        header("Location: ../html/signup.html");
        exit();
    } else {
        $insertResult = $collection->insertOne([
            'email' => $email,
            'password' => $password,
            'school' => $school
        ]);

        if ($insertResult->getInsertedCount() > 0) {
            header("Location: ../index.html");
            exit();
        } else {
            echo "Error: Could not create account.";
        }
    }
}
?>
