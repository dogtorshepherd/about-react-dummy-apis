var express = require("express");
var router = express.Router();
var fs = require("fs");
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  socketPath: '/tmp/mysql.sock',
  database: 'rack_management'
});

/* List of API */
router.get("/", function (req, res, next) {
  res.render("list", {
    title: "ABOUTREACT",
    apilist: [
      {
        name: `${req.headers.host}/api/user`,
        description: "All User Listing",
        method: "get",
      },
      {
        name: `${req.headers.host}/api/user/register`,
        description: "New User Register",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/login`,
        description: "User Authentication",
        method: "post",
      },
      {
        name: `${req.headers.host}/api/user/search`,
        description: "User Search",
        method: "get",
      },
    ],
  });
});

/* All User Listing */
router.get("/user", function (req, res, next) {
  const users = require("../users");
  res.send({ status: "success", data: users, msg: "" });
});

/* New User Register */
router.post("/user/register", function (req, res, next) {
  console.log("req.body -> ", req.body);
  const users = require("../users");
  let newUsers = users.filter(function (e) {
    return e.email == req.body.email;
  });
  if (newUsers.length > 0) {
    res.send({ status: "failed", data: {}, msg: "User Already Exists" });
  } else {
    users.push(req.body);
    fs.writeFile("./users.json", JSON.stringify(users), (err) => {
      // Checking for errors
      if (err)
        res.send({
          status: "failed",
          data: {},
          msg: `Something went wrong ${err}`,
        });
      res.send({ status: "success", data: req.body, msg: "" });
    });
  }
});

/* User Authentication */
router.post("/user/login", function (req, res, next) {
  console.log("req.body -> ", req.body);
  const users = require("../users");
  let newUsers = users.filter(function (e) {
    return e.email == req.body.email && e.password == req.body.password;
  });
  if (newUsers.length > 0) {
    res.send({ status: "success", data: newUsers[0], msg: "" });
  } else {
    res.send({ status: "failed", data: {}, msg: "No UserId / Password Found" });
  }
});

/* User Search */
router.get("/user/search", function (req, res, next) {
  console.log("req.body -> ", req.query);
  const users = require("../users");
  console.log(users);
  let newUsers = users.filter(function (e) {
    return e.name && e.name.toLowerCase().includes(req.query.q.toLowerCase());
  });
  res.send({ status: "success", data: newUsers, msg: "" });
});

// USER
router.get('/users', function (req, res, next) {
  connection.query(
    'SELECT * FROM `users`',
    function(err, results, fields) {
      res.json(results);
    }
  );
})

router.get('/users/:id', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM `users` WHERE `U_UserID` = ?',
    [id],
    function(err, results) {
      res.json(results);
    }
  );
})

router.post('/users', function (req, res, next) {
  connection.query(
    'INSERT INTO `users`(`U_UserID`, `U_Salutation`, `U_Firstname`, `U_Lastname`, `U_Unit`, `U_Phone_Number`, `U_Permissions`, `U_Username`, `U_Password`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.body.id, req.body.sal, req.body.first, req.body.last, req.body.unit, req.body.phone, req.body.permission, req.body.username, req.body.password],
    function(err, results) {
      res.json(results);
    }
  );
})

router.put('/users', function (req, res, next) {
  connection.query(
    'UPDATE `users` SET `U_Salutation`= ?, `U_Firstname`= ?, `U_Lastname`= ?, `U_Unit`= ?, `U_Phone_Number`= ?, `U_Permissions`= ?, `U_Username`= ?, `U_Password`= ? WHERE U_UserID = ?',
    [req.body.sal, req.body.first, req.body.last, req.body.unit, req.body.phone, req.body.permission, req.body.username, req.body.password, req.body.id],
    function(err, results) {
      res.json(results);
    }
  );
})

router.delete('/users', function (req, res, next) {
  connection.query(
    'DELETE FROM `users` WHERE U_UserID = ?',
    [req.body.id],
    function(err, results) {
      res.json(results);
    }
  );
})

// RACK
router.get('/rack', function (req, res, next) {
  connection.query(
    'SELECT * FROM `manage`',
    function(err, results, fields) {
      res.json(results);
    }
  );
})

router.get('/rack/:id', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM `manage` WHERE `M_RID` = ?',
    [id],
    function(err, results) {
      res.json(results);
    }
  );
})

router.post('/rack', function (req, res, next) {
  connection.query(
    'INSERT INTO `manage`(`M_Rack_Name`, `M_System`, `M_Status`) VALUES (?, ?, ?, ?)',
    [req.body.name, req.body.system, req.body.status],
    function(err, results) {
      res.json(results);
    }
  );
})

router.put('/rack', function (req, res, next) {
  connection.query(
    'UPDATE `manage` SET `M_Rack_Name`= ?, `M_System`= ?, `M_Status`= ? WHERE M_RID = ?',
    [req.body.name, req.body.system, req.body.status, req.body.id],
    function(err, results) {
      res.json(results);
    }
  );
})

router.delete('/rack', function (req, res, next) {
  connection.query(
    'DELETE FROM `manage` WHERE M_RID = ?',
    [req.body.id],
    function(err, results) {
      res.json(results);
    }
  );
})

// REQUEST
router.get('/request', function (req, res, next) {
  connection.query(
    'SELECT * FROM `rack_request`',
    function(err, results, fields) {
      res.json(results);
    }
  );
})

router.get('/request/:id', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM `rack_request` WHERE `R_JobID` = ?',
    [id],
    function(err, results) {
      res.json(results);
    }
  );
})

router.post('/request', function (req, res, next) {
  connection.query(
    'INSERT INTO `rack_request`(`R_JobID`, `R_RID`, `R_UserID`, `R_Job_Status`, `R_Job`, `R_Job_Team`, `R_Date`, `R_Time_Strat`, `R_Time_End`, `R_User_Add`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.body.id, req.body.rId, req.body.userId, req.body.jobStatus, req.body.job, req.body.jobTeam, req.body.date, req.body.timeStart, req.body.timeEnd, req.body.userAdd],
    function(err, results) {
      res.json(results);
    }
  );
})

router.put('/request', function (req, res, next) {
  connection.query(
    'UPDATE `rack_request` SET `R_RID`= ?, `R_UserID`= ?, `R_Job_Status`= ?, `R_Job`= ?, `R_Job_Team`= ?, `R_Date`= ?, `R_Time_Strat`= ?, `R_Time_End`= ?, `R_User_Add`= ? WHERE R_JobID = ?',
    [req.body.rId, req.body.userId, req.body.jobStatus, req.body.job, req.body.jobTeam, req.body.date, req.body.timeStart, req.body.timeEnd, req.body.userAdd, req.body.id],
    function(err, results) {
      res.json(results);
    }
  );
})

router.delete('/request', function (req, res, next) {
  connection.query(
    'DELETE FROM `rack_request` WHERE R_JobID = ?',
    [req.body.id],
    function(err, results) {
      res.json(results);
    }
  );
})

// equipments
router.get('/equipments', function (req, res, next) {
  connection.query(
    'SELECT * FROM `equipments`',
    function(err, results, fields) {
      res.json(results);
    }
  );
})

router.get('/equipments/:id', function (req, res, next) {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM `equipments` WHERE `E_ID_Serial_Number` = ?',
    [id],
    function(err, results) {
      res.json(results);
    }
  );
})

router.post('/equipments', function (req, res, next) {
  connection.query(
    'INSERT INTO `equipments`(`E_ID_Serial_Number`, `E_Name_Equipments`, `E_System`, `E_Unit`, `E_Description`) VALUES (?, ?, ?, ?, ?)',
    [req.body.id, req.body.name, req.body.system, req.body.unit, req.body.description],
    function(err, results) {
      res.json(results);
    }
  );
})

router.put('/equipments', function (req, res, next) {
  connection.query(
    'UPDATE `equipments` SET `E_Name_Equipments`= ?, `E_System`= ?, `E_Unit`= ?, `E_Description`= ? WHERE E_ID_Serial_Number = ?',
    [req.body.name, req.body.system, req.body.unit, req.body.description, req.body.id],
    function(err, results) {
      res.json(results);
    }
  );
})

router.delete('/equipments', function (req, res, next) {
  connection.query(
    'DELETE FROM `equipments` WHERE E_ID_Serial_Number = ?',
    [req.body.id],
    function(err, results) {
      res.json(results);
    }
  );
})


module.exports = router;
