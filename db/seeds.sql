INSERT INTO department (department_name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES 
('Sales Lead', 100000.00, 1),
('Salesperson', 80000.00, 1),
('Lead Engineer', 150000.00, 2),
('Software Engineer', 120000.00, 2),
('Account Manager', 160000.00, 3),
('Accountant', 125000.00, 3),
('Legal Team Lead', 250000.00, 4),
('Lawyer', 190000.00, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, null),
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriquez', 3, 2),
('Kevin', 'Tupik', 4, 3),
('Kunal', 'Singh', 5, 4),
('Malia', 'Brown', 6, 5),
('Sarah', 'Lourd', 7, 6),
('Tom', 'Allen', 8, 7),
('Sam', 'Kash', 8, 8);