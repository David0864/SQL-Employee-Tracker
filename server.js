const inquirer = require('inquirer');
const mysql = require('mysql2');
const util = require('util');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employeeTracker_db'
  },

);

db.query = util.promisify(db.query);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
  start();
});

function start() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Roles",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit"
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Roles":
          updateEmployeeRoles();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Quit":
          quit();
          break;
      }
    });
}

async function viewAllEmployees() {
  const employees = await db.query('SELECT employee.id, employee.first_name AS "first name", employee.last_name AS "last name", role.title, department.department_name AS department, role.salary, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id');
  console.table(employees);
  start();
}

async function addEmployee() {
  const roles = await db.query('SELECT id AS value, title AS name FROM role');
  const employees = await db.query('SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee');
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "fname",
      message: "What is the employees first name?",
    },
    {
      type: "input",
      name: "lname",
      message: "What is the employees last name?",
      
    },
    {
      type: "list",
      name: "roleid",
      message: "What is the employees role?",
      choices: roles,

    },
    {
      type: "list",
      name: "employeeid",
      message: "Who is the employees manager?",
      choices: employees,
      
    }

  ]);
  const newEmployee = await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)',[answers.fname, answers.lname, answers.roleid, answers.employeeid]);
  console.log("Employee added");
  start();
}

async function updateEmployeeRoles() {
  const roles = await db.query('SELECT id AS value, title AS name FROM role');
  const employees = await db.query('SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee'); 
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "employeeid",
      message: "Who is the employee?",
      choices: employees,
      
    },
    {
      type: "list",
      name: "roleid",
      message: "What is the employees new role?",
      choices: roles,

    },
  ])
  const something = await db.query(`UPDATE employee SET role_id = ${answers.roleid} WHERE id = ${answers.employeeid}`);
  console.log("Employee role updated");
  start();
}

async function viewAllRoles() {
  const roles = await db.query('SELECT role.title, role.salary, department.department_name FROM role JOIN department ON department.id = role.department_id');
  console.table(roles);
  start();
}

async function addRole() {
  const department = await db.query('SELECT id AS value, department_name AS name FROM department');
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "role",
      message: "What is the name of the role?",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
    },
    {
      type: "list",
      name: "roleid",
      message: "What is the name of the department of the role?",
      choices: department,
    },
  ]);
  const newRole = await db.query('INSERT INTO role (title, salary, department_id) VALUES(?,?,?)',[answers.role, answers.salary, answers.roleid]);
  console.log("Role added");
  start();
}

async function viewAllDepartments() {
  const department = await db.query('SELECT * FROM department');
  console.table(department);
  start();
}

async function addDepartment() {
  // const roles = await db.query();
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "department",
      message: "What is the name of the department?",
    },
  ]);
  const newDepartment = await db.query('INSERT INTO department (department_name) VALUES(?)',[answers.department]);
  console.log("Department added");
  start();
}

function quit() {
  db.end();
}
