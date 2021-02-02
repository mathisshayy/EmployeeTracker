const mysql = require("mysql");
const inquirer = require("inquirer");
const logo = require("asciiart-logo");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "rootroot",
  database: "employeetracker_db"
});

connection.connect(function(err) {
  if (err) throw err;
  displayLogo();
  promptUser();

});

function displayLogo(){
  const logoText = logo(
    {
      name: "Employee Tracker",
      lineChars: 30,
      padding: 2,
      margin: 2,
      borderColor: 'pink',
      logoColor: 'yellow',
    }
      ).render();
  console.log(logoText);
}

// User Prompts

function promptUser() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add department",
        "Add roles",
        "Add employee/s",
        "View department",
        "View roles",
        "View employee/s",
        "Update employee roles",
        "Delete departments",
        "Delete roles",
        "Deletes employees",
        "Exit Application"
      ]
    })
  .then((answer) => {
      switch (answer.action) {
        case "Add department":
          addDepartment();
        break;

        case "Add roles":
          addRole();
        break;

        case "Add employee/s":
          addEmployee();
        break;

        case "View department":
          viewDept();
        break;

        case "View roles":
          viewRoles();
        break;

        case "View employee/s":
        viewEmployees();
        break;

        case "Update employee role":
        updateEmployeeRole();
        break;

        case "Delete employee":
        deleteEmployee();
        break;

        case "Exit Application":
        connection.end();
        console.log("Thank you. You are now exiting the application.");
        process.exit();
        break;

      }
  });
}

//  ADD A NEW DEPARTMENT 
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the new department you want to add?",
      },
    ])

    // add to SQL
    .then((answer) => {
      const query = `INSERT INTO department (name) VALUES (?);`;
      connection.query(query, [answer.name], (err, res) => {
          if (err) throw err;
          console.log("\n", "The new department has been added successfully.", "\n")
          promptUser();
      }) 
  });
}

// ADD A NEW ROLE 
function addRole() {

 const departments = [];
 const departmentNames = [];

 // add to SQL

 const query = `SELECT id, name FROM department`;
 connection.query(query, (err, res) => {
     if (err) throw err;
     for (let i=0;i<res.length;i++) {
         departments.push({
            id:res[i].id,
            name:res[i].name});
         departmentNames.push(res[i].name);   
     }

    inquirer
     .prompt([
         {
         name: "title",
         type: "input",
         message: "What is the title of the new role?",
         },
         {
         name: "salary",
         type: "input",
         message: "What is the salary for the new role?",
         },
         {
         name: "department",
         type: "list",
         message: "Which department does the new role belong to?",
         choices: departmentNames
         },
     ])
     .then((answer) => {
         let deptId = departments.find((obj) => obj.name === answer.department).id;
         connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`,
         [answer.title, answer.salary, deptId], (err, res) => {
             if (err) throw err; 
             console.log("\n", "Your new role has been added successfully.", "\n");
                 promptUser();
         });
        
     });
 });
} 

//ADD A NEW EMPLOYEE 
function addEmployee(){

  const newEmployee = {
      firstName: "",
      lastName: "", 
      roleID: 0, 
      managerID: 0
  };

  inquirer
      .prompt([{
          name: "firstName",
          message: "What is the new employee's first name?",
          }, 
          {
          name: "lastName",
          message: "What is the new employee's last name?",
          }])
      .then(answers => {
  
          newEmployee.firstName = answers.firstName;
          newEmployee.lastName = answers.lastName;

         
          const query = `SELECT role.title, role.id FROM role;`;
          connection.query(query, (err, res) => {
              if (err) throw err;
             
              const roles = [];
              const roleNames = [];
              for (let i = 0; i < res.length; i++) {
                  roles.push({
                      id: res[i].id,
                      title: res[i].title
                  });
                  roleNames.push(res[i].title);
              }
             
              inquirer
              .prompt({
                  type: "list",
                  name: "empRole",
                  message: "Select Role:",
                  choices: roleNames
                })
              .then(answer => {
                const chosenRole = answer.empRole;
                let chosenRoleID;
                for (let i = 0; i < roles.length; i++) {
                  if (roles[i].title === chosenRole) {
                    chosenRoleID = roles[i].id;
                    break;
                  }
                }

                const query = `INSERT INTO employee SET ?;`;
                          connection.query(query, {
                              first_name: newEmployee.firstName,
                              last_name: newEmployee.lastName,
                              role_id: newEmployee.roleID || 0,
                              }, (err, res) => {
                              if (err) throw err;
                              console.log("\n", "The new employee has been added successfully.", "\n");
                              promptUser();

                  
                  newEmployee.roleID = chosenRoleID;
                  console.log("\n", "The new employee has been added successfully.", "\n")
                  promptUser();
                  
                              });
                          });                            
                      });
                  });
}


// DISPLAY DEPARTMENTS
function viewDept() {

const query  = `SELECT id AS ID, name as DEPARTMENT FROM department;`;
connection.query(query, (err, res) => {
  if (err) throw err;
  console.table("\n", res, "\n");
  promptUser();
});
};

// DISPLAY ROLES
function viewRoles() {
const query = `SELECT id AS ID, title as ROLE, salary as SALARY FROM role;`;
connection.query(query, (err, res) => {
  if (err) throw err;
  console.table("\n", res, "\n");
  promptUser();
});
};

// DISPLAY EMPLOYEES
function viewEmployees() {
const query = `
SELECT employee.id AS ID, employee.first_name AS 'FIRST NAME', employee.last_name AS 'LAST NAME', role.title AS ROLE, department.name AS DEPARTMENT, role.salary AS SALARY, CONCAT(manager.first_name, ' ', manager.last_name) AS MANAGER 
FROM employee LEFT JOIN role on employee.role_id = role.id 
LEFT JOIN department on role.department_id = department.id 
LEFT JOIN employee manager on manager.id = employee.manager_id;`;
  connection.query(query, (err, res) => {
      if (err) throw err;
      console.table("\n", res, "\n");
      promptUser();
  });
};

// UPDATE AN EMPLOYEE'S ROLE
function updateEmployeeRole(){
  const updatedEmployee = {
      id: 0,
      roleID: 0, 
  };
  const query = `SELECT id, concat(employee.first_name, " ", employee.last_name) AS employee_full_name
  FROM employee ;`;
  connection.query(query, (err, res) => {
      if (err) throw err;
      let employees = [];
      let employeeNames = [];
      for (let i=0;i<res.length;i++){
          employees.push({
              id: res[i].id,
              fullName: res[i].employee_full_name});
          employeeNames.push(res[i].employee_full_name);
      }
      inquirer
      .prompt({
          type: "list",
          name: "employeeToUpdate",
          message: "Which employee's role do you want to update?",
          choices: employeeNames
        })
      .then(answer => {
          const chosenEmployee = answer.employeeToUpdate;
          let chosenEmployeeID;
          for (let i = 0; i < employees.length; i++) {
            if (employees[i].fullName === chosenEmployee) {
              chosenEmployeeID = employees[i].id;
              break;
            }
          }
          updatedEmployee.id = chosenEmployeeID;
    
          const query = `SELECT role.title, role.id FROM role;`;
          connection.query(query, (err, res) => {
              if (err) throw err;
    
              const roles = [];
              const roleNames = [];
              for (let i = 0; i < res.length; i++) {
                  roles.push({
                      id: res[i].id,
                      title: res[i].title
                  });
                  roleNames.push(res[i].title);
              }
        
              inquirer
              .prompt({
                  type: "list",
                  name: "newRole",
                  message: "What is the new role do you want to give this employee?",
                  choices: roleNames
              })
              .then(answer => {
              
                  const chosenRole = answer.newRole;
                  let chosenRoleID;
                  for (let i = 0; i < roles.length; i++) {
                      if (roles[i].title === chosenRole){
                          chosenRoleID = roles[i].id;
                      }
                  }
              
                  updatedEmployee.roleID = chosenRoleID;
                 
                  const query = `UPDATE employee SET ? WHERE ?`;
                  connection.query(query, [
                      {
                        role_id: updatedEmployee.roleID
                      },
                      {
                        id: updatedEmployee.id
                      }
                      ], (err, res) => {
                      if (err) throw err;

                      console.log("\n", "The employee's role has been updated.", "\n");
                      promptUser();
                  });
              });
          });            
      });
  });
}

// Delete AN EMPLOYEE
function deleteEmployee() {
  const query = `
  SELECT id, (employee.first_name, " ", employee.last_name) AS employee_full_name
  FROM employee ;`;
  connection.query(query, (err, res) => {
      if (err) throw err;
    
      let employees = [];
      let employeeFullNames = [];
      for (let i=0; i < res.length; i++) {
          employees.push({
              id: res[i].id,
              fullName: res[i].employee_full_name});
          employeeFullNames.push(res[i].employee_full_name);
      }
    
      inquirer
      .prompt({
          type: "list",
          name: "employees",
          message: "Select employee to delete:",
          choices: employeeFullNames
        })
      .then(answer => {
       
          const chosenEmployee = answer.employees;
          let chosenEmployeeID;
          for (let i = 0; i < employees.length; i++) {
            if (employees[i].fullName === chosenEmployee) {
              chosenEmployeeID = employees[i].id;
              break;
            }
          }
          const query = "DELETE FROM employee WHERE ?";
          connection.query(query, {id: chosenEmployeeID}, (err, res) => {
              if (err) throw err;
              console.log("\n", "The employee has been removed from the database.", "\n");
              promptUser();
          });       
      });
  });
}