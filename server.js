const inquirer = require("inquirer");
const db = require("./db/connection");
const logo = require('asciiart-logo');
require("console.table");

console.log(logo({
    name: 'Employee Manager',
    logoColor: 'bold-cyan',
    padding: 1,
}).render());

const app = async () => {

    const data = await inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Exit Application']
    })

    if (data.action === 'View All Employees') {
        viewEmployees();
    }
    if (data.action === 'Add Employee') {
        addEmployee();
    }
    if (data.action === 'Update Employee Role') {
        updateEmployeeRole();
    }
    if (data.action === 'View All Roles') {
        viewRoles();
    }
    if (data.action === 'Add Role') {
        addRole();
    }
    if (data.action === 'View All Departments') {
        viewDepartments();
    }
    if (data.action === 'Add Department') {
        addDepartment();
    }
    else if (data.action === 'Exit Application') {
        console.log('Goodbye')
        return
    }

};

const viewEmployees = async () => {
    console.log('======================================= Employees =========================================');
    const response = await db.promise().query(
        "Select employee.id as id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, employee.manager_id as manager from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id;") //how to get manager name instead of id number?
    console.table(response[0]);
    app();
}

const addEmployee = async () => {
    console.log('\n ===== Please enter new employee information: =====')
    const roles = await db.promise().query('select * from role');
    const roleChoices = roles[0].map(role => {
        return { name: role.title, value: role.id }
    });

    const employee = await db.promise().query('select * from employee');
    const managerChoices = employee[0].map(manager => { return {  } }) //how to get managers? maybe add boolean if theyre manager or not?

    const data = await inquirer.prompt([
        {
            type: 'input',
            message: 'New Employee first name: ',
            name: 'employeeFirstName'
        },
        {
            type: 'input',
            message: 'New Employee last name: ',
            name: 'employeeLastName'
        },
        {
            type: 'list',
            message: 'New Employee Role: ',
            name: 'employeeRole',
            choices: roleChoices //list of existing roles in db
        },
        {
            type: 'list',
            message: "Eew employee's manager?",
            name: 'newEmployeeManager',
            choices: ['null'] //make it so that the choices mirror the manager role of list of employees
        }
    ])
    console.log(data);
    const newEmployee = (db.query(`insert into employee (first_name, last_name, role_id, manager_id) values ('${data.employeeFirstName}', '${data.employeeLastName}', '${data.employeeRole}', ${data.newEmployeeManager})`), console.log(`'${data.employeeLastName}, ${data.employeeFirstName}' has been added to employee database.`));;
    app();
};

const updateEmployeeRole = async () => {
    const employeeData = await db.promise().query(
        'select concat(last_name, " ", first_name) as full_name, id from employee;');
    const rolesData = await db.promise().query(
        'select * from role;');
    const roleChoices = rolesData[0].map(role => { return { name: role.title, value: role.id } });

    const employeeChoice = employeeData[0].map(employee => {
        return { name: employee.full_name, value: employee.id }
    });
    const data = await inquirer.prompt([
        {
            type: 'list',
            message: 'Select employee to be updated: ',
            name: 'employeeName',
            choices: employeeChoice
        },
        {
            type: 'list',
            message: "Update employee role",
            name: 'updatedRole',
            choices: roleChoices
        }
    ])
    const updatedEmployeeRole = (db.query(
        `update employee set role_id = ${data.updatedRole} where id = ${data.employeeName}`
    ), console.log(`Employee with ID: ${data.employeeName} role updated successfully`));
    app();
};

const viewRoles = async () => {
    console.log('========== Roles ==========')
    const rolesTable = await db.promise().query(
        "select id, title from role;");
    const roles = rolesTable[0];
    console.table(roles);
    app();
};

const addRole = async () => {
    const depts = await db.promise().query(
        'select * from department;');
    const deptChoices = depts[0].map(department => {
        return { name: department.name, value: department.id }
    })
    console.log(deptChoices);
    const data = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the title of the new role?',
            name: 'newRoleTitle'
        },
        {
            type: 'number',
            message: 'What is the salary for this role?',
            name: 'newRoleSalary'
        },
        {
            type: 'list',
            message: 'Which department does this role work under?',
            name: 'newRoleDepartment',
            choices: deptChoices
        }
    ])
    console.log(data);
    const newRole = (db.query(`insert into role (title, salary, department_id) values ('${data.newRoleTitle}', ${data.newRoleSalary}, ${data.newRoleDepartment});`), console.log(`Role '${data.newRoleTitle} has been added!'`));
    app();
};

const viewDepartments = async () => {
    console.log('========== Departments ==========')
    const departmentTable = await db.promise().query(
        'select * from department;');
    const departments = departmentTable[0];
    console.table(departments);
    app();
};

const addDepartment = async () => {
    const data = await inquirer.prompt(
        {
            type: 'input',
            message: 'Name of the new department',
            name: 'newDepartmentName'
        });
    const newDepartment = (db.query(
        `insert into department(name) values ('${data.newDepartmentName}');`), console.log(`Department ${data.newDepartmentName} has been added!`));
    app();
}

app();


