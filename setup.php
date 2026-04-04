<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Foodie - Database Setup</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .setup-card { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 600px; width: 100%; padding: 40px; }
    h1 { font-size: 1.8rem; margin-bottom: 8px; }
    h1 span { color: #e74c3c; }
    .subtitle { color: #888; margin-bottom: 30px; }
    .step { padding: 12px 16px; margin-bottom: 10px; border-radius: 10px; display: flex; align-items: center; gap: 12px; font-size: 0.95rem; }
    .step.success { background: #e8f5e9; color: #2e7d32; }
    .step.error { background: #ffeaea; color: #c0392b; }
    .step.info { background: #e3f2fd; color: #1565c0; }
    .icon { font-size: 1.2rem; flex-shrink: 0; }
    .done-box { margin-top: 24px; padding: 20px; background: linear-gradient(135deg, #e74c3c, #ff6b6b); border-radius: 12px; color: #fff; text-align: center; }
    .done-box a { color: #fff; font-weight: 700; text-decoration: underline; font-size: 1.1rem; }
    .error-box { margin-top: 24px; padding: 20px; background: #ffeaea; border-radius: 12px; color: #c0392b; }
    .form-box { margin-top: 20px; }
    .form-box label { display: block; font-weight: 600; margin-bottom: 6px; font-size: 0.9rem; }
    .form-box input { width: 100%; padding: 10px 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; margin-bottom: 14px; }
    .form-box button { background: #e74c3c; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-size: 1rem; cursor: pointer; width: 100%; font-weight: 600; }
    .form-box button:hover { background: #c0392b; }
  </style>
</head>
<body>
<div class="setup-card">
  <h1>Food<span>ie</span> - Database Setup</h1>
  <p class="subtitle">Ye page automatically database aur tables bana dega.</p>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $host = trim($_POST['host'] ?? 'localhost');
    $user = trim($_POST['user'] ?? 'root');
    $pass = $_POST['pass'] ?? '';

    $steps = [];
    $hasError = false;

    // Step 1: Connect to MySQL
    $conn = @new mysqli($host, $user, $pass);
    if ($conn->connect_error) {
        $steps[] = ['error', 'MySQL se connect nahi ho saka: ' . $conn->connect_error];
        $hasError = true;
    } else {
        $steps[] = ['success', 'MySQL se connect ho gaya'];
        $conn->set_charset('utf8mb4');

        // Step 2: Create database
        if ($conn->query("CREATE DATABASE IF NOT EXISTS foodie_simple")) {
            $steps[] = ['success', 'Database "foodie_simple" ready'];
        } else {
            $steps[] = ['error', 'Database create nahi ho saka: ' . $conn->error];
            $hasError = true;
        }

        $conn->select_db('foodie_simple');

        // Step 3: Users table
        $sql = "CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        if ($conn->query($sql)) {
            $steps[] = ['success', 'Table "users" ready'];
        } else {
            $steps[] = ['error', 'Users table error: ' . $conn->error];
            $hasError = true;
        }

        // Step 4: Orders table
        $sql = "CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_code VARCHAR(50) NOT NULL,
            user_id INT NOT NULL,
            item_name VARCHAR(100) NOT NULL,
            item_emoji VARCHAR(10) DEFAULT '',
            item_price INT NOT NULL,
            customer_name VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            address TEXT NOT NULL,
            payment VARCHAR(50) DEFAULT 'Cash on Delivery',
            status VARCHAR(50) DEFAULT 'Preparing',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )";
        if ($conn->query($sql)) {
            $steps[] = ['success', 'Table "orders" ready'];
        } else {
            $steps[] = ['error', 'Orders table error: ' . $conn->error];
            $hasError = true;
        }

        // Step 5: Update config.php
        $configContent = "<?php\nsession_start();\nheader('Content-Type: application/json');\nheader('Access-Control-Allow-Origin: *');\nheader('Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS');\nheader('Access-Control-Allow-Headers: Content-Type');\n\nif (\$_SERVER['REQUEST_METHOD'] === 'OPTIONS') {\n    http_response_code(200);\n    exit;\n}\n\n\$conn = new mysqli('$host', '$user', '" . addslashes($pass) . "', 'foodie_simple');\n\nif (\$conn->connect_error) {\n    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);\n    exit;\n}\n\n\$conn->set_charset('utf8mb4');\n";

        if (file_put_contents(__DIR__ . '/php/config.php', $configContent)) {
            $steps[] = ['success', 'Config file updated with your credentials'];
        } else {
            $steps[] = ['error', 'Config file update nahi ho saka'];
            $hasError = true;
        }

        $conn->close();
    }

    // Show results
    foreach ($steps as $step) {
        $icon = $step[0] === 'success' ? '&#10004;' : '&#10008;';
        echo "<div class='step {$step[0]}'><span class='icon'>$icon</span> {$step[1]}</div>";
    }

    if (!$hasError) {
        echo '<div class="done-box">Setup complete! <br><a href="index.html">Foodie Open Karein &rarr;</a></div>';
    } else {
        echo '<div class="error-box">Kuch errors hain upar. Please fix karein aur dubara try karein.</div>';
    }
} else {
?>
  <form method="POST" class="form-box">
    <label>MySQL Host</label>
    <input type="text" name="host" value="localhost" required>

    <label>MySQL Username</label>
    <input type="text" name="user" value="root" required>

    <label>MySQL Password</label>
    <input type="password" name="pass" placeholder="Password daalein (khali chor sakte hain)">

    <button type="submit">Setup Database</button>
  </form>
<?php } ?>
</div>
</body>
</html>
