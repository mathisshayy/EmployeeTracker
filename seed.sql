USE employeetracker_db;
INSERT INTO department (name)
VALUES ("Customer Service");

INSERT INTO department (name)
VALUES ("Marketing");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Human Relations");

USE employeetracker_db;

INSERT INTO role (title, salary, department_id)
VALUES ("Lead CSR", 50000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 57000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("HR Specialist", 40000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Team Lead", 37000, 4);

USE employeetracker_db;

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES ("1", "Shay", "Brown", "1", null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES ("2", "Eric", "Washington", "2", "1");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES ("3", "Michael", "Jefferson", "3", "2");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES ("4", "Quinton", "Coldwater", "4", 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES ("5", "Meridith", "Grey", "5", null);