CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(50) NULL,
    price DECIMAL(10 , 2 ) NULL,
    stock_quantity INTEGER(10) NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Hutzler 571 Banana Slicer", "Kitchen & Dining", 5.42, 100),
("AutoExec Wheelmate Steering Wheel Attachable Work Surface Tray", "Automotive", 25.00, 5),
("How to Avoid Huge Ships", "Books", 14.87, 2),
("PetSafe Lickety Stik Dog Treat, Bacon", "Pet Supplies", 3.89, 2000),
("Nylabone Advanced Oral Care Natural Dog Dental Kit", "Pet Supplies", 5.50, 91),
("Pet ID Tags", "Pet Supplies", 3.70, 150),
("KONG Beaver Dog Toy", "Pet Supplies", 5.35, 41),
("Crafting with Cat Hair", "Books", 9.10, 51),
("Harry Potter and the Half-Blood Prince", "Books", 9.99, 500),
("PlayStation VR", "Electronics", 393.37, 20),
("HTC VIVE - Virtual Reality System", "Electronics", 799.99, 15),
("Fitbit Zip Wireless Activity Tracker, Charcoal", "Electronics", 59.95, 300);

    
ALTER TABLE products
ADD product_sales DECIMAL(10 , 2 ) default 0.00;

SELECT 
    *
FROM
    products;
