CREATE DATABASE smart_data_quality;
USE smart_data_quality;
CREATE TABLE customers (
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
SELECT*FROM customers;
USE smart_data_quality;

SELECT
    customer_name,
    email,
    phone,
    city,
    COUNT(*) AS duplicate_count
FROM customers
GROUP BY
    customer_name,
    email,
    phone,
    city
HAVING COUNT(*) > 1;

SELECT *
FROM customers
WHERE customer_name IS NULL
   OR email IS NULL
   OR phone IS NULL
   OR city IS NULL;
   
   SELECT customer_id, customer_name, email
FROM customers
WHERE email IS NOT NULL
  AND email NOT LIKE '%_@_%._%';
  
  SELECT customer_id, customer_name, phone
FROM customers
WHERE phone IS NOT NULL
  AND phone NOT REGEXP '^[0-9]{10}$';