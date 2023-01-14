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

}

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
    const manager = employee[0] //how to retrieve list of manager names
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
    // const employeesData = await db.promise().query(
    //     'select * from employee;');
        const employeeData= await db.promise().query(
            'select concat(last_name, " ", first_name) as full_name, id from employee;');
        //const employees = employeesData[0];
       // console.log(employeeData[0]);

    const employeeChoice = employeeData[0].map(employee => {
        return { name: employee.full_name, value: employee.id } 
    });
    console.log(employeeChoice);
    const data = await inquirer.prompt([
        {
            type: 'list',
            message: 'Select employee to be updated: ',
            name: 'employeeName',
            choices: employeeChoice
        }
    ])
    //console.log(data)
}

const viewRoles = async () => {
    console.log('========== Roles ==========')
    const rolesTable = await db.promise().query(
        "select id, title from role;");
    const roles = rolesTable[0];
    console.table(roles);
    app();
};

const addRole = async () => {
    const depts= await db.promise().query(
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





// const arr = [
//     {name: "sean" , id: 10 , cool:true},
//     {name: "bob" , id: 4 , cool:false},
//     {name: "sally" , id: 0 , cool:true},
//     {name: "michelle" , id: 5 , cool:true},
//     {name: "andy" , id: 3 , cool:false},
// ]

// const newArr = arr.map(person => {
//     return {nickname:person.name}
// })

// [{name:"bob", value: 4}]


// console.log(newArr)

/*
  REMOVE COMMENTS BEFORE SUBMITTING YOUR HOMEWORK
*/

// Import inquirer
// Optional: import asciiart-logo
// import your database module
//const db = require("./db");

// Import console table for logging information on screen in table format
// require("console.table");

// Call startup function

// function: start up
//    optional: display logo text using asciiart-logo
//    call function to the main prompt for questions


// function - main prompt for questions
// - Prompt with the list of choices
// - In .then callback, check user's response with the switch-case statement.
//    call the appropriate function depending on what the user chose
//      - in case of view employees, call the view employees function
//      - in case of add employee, call the add employee function
//      - in case of update employee's role, call the update employee role function
//      - in case of view departments, call the view departments function
//      - in case of add department, call the add department function
//      - in case of view roles, call the view roles function
//      - in case of add role, call the add role function
//      - in default, call function to quit
//
// OPTIONAL:
//      - in case of update employee's manager, call the update employee manager function
//      - in case of view employees by manager, call the view employees by manager function
//      - in case of view employees by department, call the view employees by department function
//      - in case of view utilized budget by department, call the function to view utilized budget by department
//      - in case of remove department, call the remove department function
//      - in case of remove role, call the remove role function
//      - in case of remve employee, call the remove employee function
//      - in default, call function to quit

// function - View all employees
  // 1. call find all employees method on database object
  //    in .then callback, display returned data with console table method
  // 2. call function to load main prompt for questions
  //

// function - View all roles
// 1. call find all roles method on database object
//    in .then callback, dispalay returned data with console table
// 2. call function to load main prompt for questons
//

// function - View all deparments
//  1. call find all departments method on database object
//      in .then call back, display returned data with console table
//  2. call function to load main prompt for questions
//

// Add a department
//  1. prompt user for the name of the department
//      in .then callback, call create department method on database object, passing the returned data as input argument
//  2. call function to load main prompt for questions
//

// functon - Add a role
//  **prompt for user to enter the role, the salary, and what department the role belongs to
//  1. call find all departments method on database connection to get array of existing department records
//      in .then call back, create array of objects with names and ids from returned data with .map() method
//  2. prompt user for title, salary, and department choosing from the list of departmernts created above
//      in .then callback, call funcon to create role on database connection, passing returned data from prompt as input argument
//  3. call function to load main prompt for questions
//

// function - Add a new employee
//  1. prompt for first_name and last_name
//      in .then callback, store the first namd and the last name to variables,
//  2. call function to find all roles on database connection to get all existing roles
//      in .then callback, create array of role objects with id and title from returned array of role data with .map()
//  3. prompt user for the role for the employee choosing from a list (array) of role objecs
//      in .then callback, store the role id to a variable,
//  4. call function to find all employees on database connection
//      in .then callback, create array of managers with id, first name, last name from the returned data with .map()
//  5. prompt user for the manager from a list from the array of managers
//      in .then callback, create an employee object with variables for first name, last name, role id, manager id
//  6. call function to create employee on database connection, passing the employee object as input argument
//      in .then callback, call function to load main prompt for questions

// function - Update an employee's role
//  1. call function to find all employees on database connection
//      - in .then callback, take first name, last name, and id from the returned database data and create an array
//        of new employee objects with .map().
//      - new objects have two properties, name and value
//        name consists of first name and last name from the returned database data
//        value has id from the returned database data
//  2. prompt the list of choices from the new array of employee objects
//      - in .then callback, store employee id to a variable from the returned user choice
//  3. call function to find all roles on database connection
//      - in .then callback, create a new array of new role objects using .map on the returned database role data
//      - for the new role objects, assign title from returned database data to the name property and assign id to the value property
//  4. prompt user with the list of choices from the new array of new role objects
//      - in .then callback, assign returned user choice to a role id variable
//  5. call function to update employee role, passing employee id variable and role id variable as input arguments
//  6. call fucntion to load main prompt of questions


// function - Exit the application

// ========================
//  OPTIONAL
// ========================

// fuction - View all employees that belong to a department

// function - View all employees that report to a specific manager

// function - Update an employee's manager

// function - View all departments and show their total utilized department budget

// function - Delete an employee

// function - Delete a department

// function - Delete a role

