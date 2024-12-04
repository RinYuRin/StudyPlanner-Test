<?php
require __DIR__ . '/../vendor/autoload.php';

session_start(); 

$client = new MongoDB\Client("mongodb://localhost:27017");

$db = $client->StudyPlanner;
$collection = $db->usercredential;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : null;
    $password = isset($_POST['password']) ? $_POST['password'] : null;

    if ($email && $password) {
        $user = $collection->findOne(['email' => $email]);

        if ($user) {
            if (password_verify($password, $user['password'])) {
                $_SESSION['email'] = $email;

                header("Location: ../html/dashboard.html");
                exit();
            } else {
                echo "Invalid password.";
            }
        } else {
            echo "No account found with this email.";
        }
    } else {
        echo "Please fill in all required fields.";
    }
} else {
    echo "Invalid request method.";
}
?>
