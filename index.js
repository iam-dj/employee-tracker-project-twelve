const inquirer = require("inquirer");

const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "movies_db",
  },
  console.log(`Connected to the movies_db database.`)
);

mainMenu();

function mainMenu() {
  // Prompt user for input
  inquirer
    .prompt([
      {
        type: "list",
        name: "whatToDo",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then(function (answer) {
      // Switch case to handle user input
      switch (answer.whatToDo) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
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
          console.log("Goodbye!");
          process.exit();
      }
    });
}

function viewAllEmployees() {
  // code to view all employees
}

function updateEmployeeRole() {
  // code to update employee role
}

function viewAllRoles() {
  // code to view all roles
}

function addRole() {
  // code to add a new role
}

function viewAllDepartments() {
  // code to view all departments
}

function addDepartment() {
  // code to add a new department
  inquirer
  .prompt({
    type: "input",
    name: "departmentName",
    message: "Enter the name of the department:",
  })
  .then((answer) => {
    // insert the department into the database
    const query = `INSERT INTO department (name) VALUES ('${answer.departmentName}')`;
    db.query(query, (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} department added!\n`);
      // return to the main menu
      mainMenu();
    });
  });
}
