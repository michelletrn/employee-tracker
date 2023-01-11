DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  -- id set to integer, automatic increment, and primary key
  -- name set to varchar, max size 30, not null
  id int auto_increment primary key,
  name varchar(30) not null
);

CREATE TABLE role (
  -- id set to integer, automatic increment, and primary key
  -- title set to varchar, max size 30, and not null
  -- salary set to decimal and not null
  -- department id set to integer and not null
  -- foreign key department id referencing department table on id with on delete constraint
  id int auto_increment primary key,
  title varchar(30) not null,
  salary decimal not null,
  department_id int not null,
  foreign key department_id references department(id) on delete set null
  -- optional - index on department id
);

CREATE TABLE employee (
  -- id set to integer with automatic increment and primary key constraints
  -- first name set to var char, max size 30, and not null contraint
  -- last name set to var char, max size 30, and not null
  -- role id set to integer and not null
  -- manager id set to integer
  -- foreign key on role id referencing role table on id with on delete constraint
  -- foreign key on manager id referencing employee table on id with on delete constraint
  id int auto_increment primary key,
  first_name varchar(30) not null,
  last_name varchar(30) not null,
  role_id int not null,
  manager_id int,
  foreign key role_id references role(id) on delete cascade,
  foreign key manager_id references employee(id) on delete set null
  -- optional - indexes on role id, manager id
);
