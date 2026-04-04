<?php
require_once 'config.php';

if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first.']);
    exit;
}

$userId = $_SESSION['user']['id'];

$stmt = $conn->prepare('SELECT order_code, item_name, item_emoji, item_price, customer_name, phone, address, payment, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC');
$stmt->bind_param('i', $userId);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = [
        'id' => $row['order_code'],
        'item' => $row['item_name'],
        'emoji' => $row['item_emoji'],
        'price' => (int)$row['item_price'],
        'name' => $row['customer_name'],
        'phone' => $row['phone'],
        'address' => $row['address'],
        'payment' => $row['payment'],
        'status' => $row['status'],
        'date' => $row['created_at']
    ];
}

echo json_encode(['success' => true, 'orders' => $orders]);
