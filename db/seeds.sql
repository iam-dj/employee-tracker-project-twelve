USE employee_db;

INSERT INTO department (name)  
VALUES 
("Sales"),           -- 1
("IT"),              -- 2
("Marketing"),       -- 3
("Operations"),      -- 4
("Finance"),         -- 5
("Customer Support");-- 6

INSERT INTO 
role (title,salary,department_id)  
VALUES 
("CEO", 350000, 4),       -- 1
("HR", 150000, 4),        -- 2
("Sales", 105000, 1),     -- 3
("CBO", 275000, 1),       -- 4
("CFO", 275000, 5),       -- 5
("Accountant", 175000, 5),-- 6
("IT", 123000, 2),        -- 7
("CTO", 275000, 2),       -- 8
("Marketing", 120000, 3), -- 9
("CMO", 275000, 3);       -- 10


INSERT INTO employee (first_name, last_name, role_id, manager_id)  
VALUES 
("Mark", "Brown", 1, null),    -- CEO 1
("John", "Doe", 2, 1),        -- HR 2
("Mike", "Johnson", 4, 1),    -- CBO 3
("Emily", "Jones", 5, 1),     -- CFO 4
("Ross", "Smith", 8, 1),      -- CTO 5
("Tally", "Shakes", 10, 1),   -- CMO 6
("Julia", "Davis", 6, 4),     -- Accountant 7
("David", "Lee", 7, 5),       -- IT 8
("Lon", "Givens", 9, 6),     -- Marketing 9
("Jane", "Smith", 3, 3);     -- Sales 10 