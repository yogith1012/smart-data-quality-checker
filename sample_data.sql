CREATE DATABASE IF NOT EXISTS smart_data_quality;
USE smart_data_quality;

CREATE TABLE IF NOT EXISTS customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(20),
    city VARCHAR(100)
);

INSERT INTO customers
(customer_name, email, phone, city)
VALUES
('Arun', 'arun@gmail.com', '9876543210', 'Erode'),
('Priya', NULL, '9876543211', 'Salem'),
('Arun', 'arun@gmail.com', '9876543210', 'Erode'),
('Ravi', 'ravi123', NULL, 'Coimbatore'),
('Meena', 'meena@gmail.com', '9876543214', NULL),
('Kumar', 'kumar@gmail.com', '9876543215', 'Erode'),
('Divya', 'divya@gmail.com', '9876543216', 'Salem');