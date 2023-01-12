DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  id int auto_increment primary key,
  name varchar(30) not null
);

CREATE TABLE role (
  id int auto_increment primary key,
  title varchar(30) not null,
  salary decimal not null,
  department_id int not null,
  foreign key (department_id) references department(id) on delete cascade
);

CREATE TABLE employee (
  id int auto_increment primary key,
  first_name varchar(30) not null,
  last_name varchar(30) not null,
  role_id int not null,
  manager_id int,
  foreign key (role_id) references role(id) on delete cascade,
  foreign key (manager_id) references employee(id) on delete set null
);

source db/seed.sql;