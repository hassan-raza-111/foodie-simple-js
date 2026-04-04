<?php
require_once 'config.php';

if (!isset($_SESSION['user'])) {
    echo json_encode(['success' => false, 'message' => 'Please login first.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$userId = $_SESSION['user']['id'];
$itemName = trim($data['item'] ?? '');
$itemEmoji = $data['emoji'] ?? '';
$itemPrice = (int)($data['price'] ?? 0);
$customerName = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$address = trim($data['address'] ?? '');

if (!$itemName || !$customerName || !$phone || strlen($phone) < 10 || !$address) {
    echo json_encode(['success' => false, 'message' => 'Please fill all fields correctly.']);
    exit;
}

$orderCode = 'ORD-' . strtoupper(base_convert(time(), 10, 36));

$stmt = $conn->prepare('INSERT INTO orders (order_code, user_id, item_name, item_emoji, item_price, customer_name, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
$stmt->bind_param('sississs', $orderCode, $userId, $itemName, $itemEmoji, $itemPrice, $customerName, $phone, $address);
$stmt->execute();

echo json_encode([
    'success' => true,
    'order' => [
        'id' => $orderCode,
        'item' => $itemName,
        'emoji' => $itemEmoji,
        'price' => $itemPrice,
        'name' => $customerName,
        'phone' => $phone,
        'address' => $address,
        'payment' => 'Cash on Delivery',
        'status' => 'Preparing',
        'date' => date('c')
    ]
]);
