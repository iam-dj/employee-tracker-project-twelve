const inquirer = require("inquirer");
const cTable = require('console.table');
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
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

promptUser();

function promptUser() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "whatToDo",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit"
        ],
      },
    ])
    .then(function (answer) {
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
        case "Add Employee":
          addEmployee();
          break;
        case "Quit":
          console.log("Goodbye!");
          process.exit();
      }
    });
}

function viewAllEmployees() {
    db.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id
      ORDER BY employee.id;
    `, function (err, res) {
      if (err) throw err;
      console.table(res);
      promptUser();
    });
  }
  

function updateEmployeeRole() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "Enter the ID of the employee whose role you want to update:",
          name: "employeeId",
        },
        {
          type: "input",
          message: "Enter the ID of the new role:",
          name: "roleId",
        },
        
      ])
      .then((res) => {
        const employeeId = parseInt(res.employeeId);
        const roleId = parseInt(res.roleId);
  
        db.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [roleId, employeeId],
          (err, result) => {
            if (err) {
              console.log(err);
              return;
            }
            promptUser();
        }
        );
      });
  }
  

  function viewAllRoles() {
    const sql = `SELECT role.title AS title, department.name AS department, role.salary
    FROM role
    LEFT JOIN department ON role.department_id = department.id
    ORDER BY role.salary DESC`;
  
    db.query(sql, (err, results) => {
      if (err) throw err;
  
      console.table(results);
  
      promptUser();
    });
  }

  function addRole() {
    db.query("SELECT name FROM department", function (err, results) {
        if (err) throw err;
    
        const choices = results.map((result) => result.name);
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of the new role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the new role?",
        },
        {
          type: "list",
          name: "department",
          message: "Which department does the new role belong to?",
          choices: choices,  
        },
      ])
      .then((answers) => {
        const query = `
          INSERT INTO role (title, salary, department_id)
          VALUES (?, ?, (SELECT id FROM department WHERE name = ?))
        `;
        const values = [answers.title, answers.salary, answers.department];
        db.query(query, values, (err, res) => {
          if (err) throw err;
          promptUser();
        });
      });
    })
  }
  

  function viewAllDepartments() {
    const sql = `SELECT * FROM department`;
  
    db.query(sql, (err, results) => {
      if (err) throw err;
  
      console.table(results);
  
      promptUser();
    });
  }

  

function addEmployee() {
    db.query("SELECT title FROM role", function (err, results) {
      if (err) throw err;
  
      const choices = results.map((result) => result.title);

    db.query(`SELECT manager_id, CONCAT(first_name, ' ', last_name) AS boss FROM employee
    `, function (err, results) {
      if (err) throw err;
  
      const people = results.map((result) => result.boss);
      people.push('nobody');
  console.log(people);
  
      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter the employee's first name:",
            validate: function(input) {
                if (!input || !input.trim()) {
                  return "Please enter a first name";
                }
                return true;
              }
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter the employee's last name:",
            validate: function(input) {
                if (!input || !input.trim()) {
                  return "Please enter a last name";
                }
                return true;
              }
          },
          {
            type: "list",
            name: "role",
            message: "Select the employee's role:",
            choices: choices,
          },
          {
              type: "rawlist",
              name: "manager",
              message: "Select your bosses name (Note the # is also the Manager ID) OR press ⬆️ to select null for all other choices",
              choices: people,
            },
            {
                type: "input",
                name: "managerId",
                message: "Enter the employee's manager ID:",
                when: (answers) => answers.manager !== 'nobody',
            },
        ])
        .then((answers) => {
         
          const query2 = "SELECT id FROM role WHERE title = ?";
          db.query(query2, [answers.role], (err, res) => {
            if (err) {
              throw err;
            }
            roleId = res[0].id;

            if (answers.managerId == '' || answers.managerId == 0 || answers.managerId > people.length || /[a-zA-Z]/.test(answers.managerId)) {
                answers.managerId = null;
            }
            
            const query =
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
            db.query(
                query,
                [answers.firstName, answers.lastName, roleId, answers.managerId],
                (err, res) => {
                    if (err) throw err;
                    promptUser();
                }
                );
            });
        });
        });
        });
  }
  
  
  

function addDepartment() {
  inquirer
  .prompt({
    type: "input",
    name: "departmentName",
    message: "Enter the name of the department:",
  })
  .then((answer) => {
    const query = `INSERT INTO department (name) VALUES ('${answer.departmentName}')`;
    db.query(query, (err, res) => {
      if (err) throw err;
      promptUser();
    });
  });
}
