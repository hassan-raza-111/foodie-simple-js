-- =============================================
-- FOODIE PROJECT - Database Setup Script
-- =============================================
-- Ye file import karo phpMyAdmin mein ya command line mein:
--   mysql -u root -p < database.sql
-- =============================================

CREATE DATABASE IF NOT EXISTS foodie_simple;
USE foodie_simple;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
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
);
