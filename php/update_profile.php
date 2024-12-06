<?php
require __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

// Connect to the database
$client = new Client("mongodb://localhost:27017");
$db = $client->StudyPlanner;
$collection = $db->usercredential;

// Start the session
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);

    if ($input) {
        // Use email from session for security, fallback to input if not available
        $email = $_SESSION['email'] ?? htmlspecialchars($input['email']);
        if (!$email) {
            echo json_encode(['success' => false, 'message' => 'No email provided.']);
            exit;
        }

        // Sanitize and prepare update data
        $updateData = [];
        $fields = ['username', 'userstatus', 'userschool', 'usercourse', 'usercontact', 'useraddress'];

        foreach ($fields as $field) {
            $updateData[$field] = isset($input[$field]) ? htmlspecialchars($input[$field]) : null;
        }

        try {
            // Update user data in MongoDB
            $result = $collection->updateOne(
                ['email' => $email],
                ['$set' => $updateData]
            );

            if ($result->getMatchedCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Profile updated successfully.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'No matching user found.']);
            }
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Error updating profile: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>

