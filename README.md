Tech stacks used:
Backend:Express JS
Frontend:React JS
Database:MYSQL

Steps to run the project:
1)Clone the Repositories for both frontend and backend 
    i)command to clone backend "git clone https://github.com/mahesh079/order-management-system-backend.git" 
    ii)command to clone frontend "git clone https://github.com/mahesh079/order-management-system-frontend.git"
2)After cloning run "npm i" or "npm install" command in the terminal to download the required dependencies 
3)Run command "npm run start" or "npm run dev" in backend and "npm run dev" for frontend

Admin credentials:
username:admin
password:admin


MYSQL Credentials:
host: 'localhost',
user: 'root',
password: 'root',
database: 'order_management_system'

Commands to create required dba nd required table

1)create database order_management_system;
2)use order_management_system;
3)CREATE TABLE orders (
    id INT NOT NULL AUTO_INCREMENT,
    customerName VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    contactNumber CHAR(10) NOT NULL,
    address VARCHAR(100) NOT NULL,
    productName VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    productImage VARCHAR(500) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

If you want to change the databse configuration then you can change it in the mysqlConnection.js file
