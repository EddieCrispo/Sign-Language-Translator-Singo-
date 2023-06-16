import { uid } from "../controller/client.js";
import { adminDetails, reWriteAdminData } from "../data.js";

export var adminToken = uid();
let Questions = [
  {
    ask: "What was the name of your first-grade teacher?",
    short: "teacher",
  },
  {
    ask: "What is the name of your first pet?",
    short: "pet",
  },
  {
    ask: "What is the name of the city where you were born?",
    short: "cityname",
  },
  {
    ask: "What was your first job?",
    short: "job",
  },
  {
    ask: "What is your favorite vacation spot?",
    short: "vacation",
  },
];

setInterval(function () {
  adminToken = uid();
  adminDetails.loggedIn = false;
  //change admin token and logout every 5 minutes for security
}, 1000 * 60 * 5);

export function securityQ(req, res) {
  res.json(Questions);
}

export function loginAdmin(req, res) {
  adminDetails.loggedIn = true;
  res.sendFile("public/admin/login.html", { root: "./" });
}

export function getCredentials(req, res) {
  let adminObj = {
    name: adminDetails.name,
    password: adminDetails.password,
    moreInfo: {
      name_of_first_grade_teacher: adminDetails.q.teacher,
      name_of_first_pet: adminDetails.q.pet,
      name_of_city_you_were_born: adminDetails.q.cityname,
      first_job: adminDetails.q.job,
      favorite_vacation_spot: adminDetails.q.vacation,
    },
  };
  res.json(adminObj);
}

export function authAdmin(req, res) {
  let { name, pass } = req.body;
  if (name == adminDetails.name && pass == adminDetails.password) {
    adminToken = uid();
    return res.json({ success: true, adminToken });
  }
  if (adminDetails.name !== name && adminDetails.password !== pass) {
    return res.json({
      success: false,
      message: "Username and Password are wrong",
    });
  } else if (adminDetails.name !== name) {
    return res.json({ success: false, message: "Wrong username" });
  } else if (adminDetails.password !== pass) {
    return res.json({ success: false, message: "Wrong password" });
  }
  res.status(403).json({ message: "Please provide username amd password" });
}

export function securityPage(req, res) {
  if (adminDetails.loggedIn == true) {
    return res.sendFile("public/admin/security.html", { root: "./" });
  }
  res.redirect("/login");
}

export function secureAdmin(req, res) {
  let newDetails = {};
  for (let i = 0; i < 5; i++) {
    newDetails = { ...newDetails, ...req.body[i] };
  }
  newDetails = { ...adminDetails, q: { ...newDetails } };
  newDetails["security"] = true;
  reWriteAdminData(newDetails);
  console.log(newDetails);
  res.json({ success: true, adminToken });
}

export function adminPage(req, res) {
  let { token } = req.query;
  if (adminDetails["security"] == false) {
    return res.redirect("/security");
  }
  if (token == adminToken) {
    return res.sendFile("public/admin/index.html", { root: "./" });
  }
  res.redirect("/login");
}

export function logoutAdmin(req, res) {
  adminToken = uid();
  adminDetails.loggedIn = false;
  res.json({ success: true });
}

export function forgotPass(req, res) {
  if (adminDetails["security"] == true) {
    return res.sendFile("/public/admin/forgotpass.html", { root: "./" });
  }
  res
    .status(403)
    .json({ message: "Please sign in as admin to access this route" });
}

export function passwordReset(req, res) {
  if (adminDetails["security"] == false) {
    return res
      .status(403)
      .json({ message: "Please sign in as admin to access this route" });
  }
  let { teacher, pet, cityname, job, vacation } = req.body;
  let adminQs = adminDetails.q;
  let arr = [];
  checkDoubles(req.body, adminQs);
  function checkDoubles(one, two) {
    for (var i in one) {
      if (one[i] == two[i]) {
        arr.push(true);
      }
    }
  }
  if (arr.length >= 3) {
    adminDetails.name = "admin";
    adminDetails.password = "admin";
    reWriteAdminData(adminDetails);
    adminToken = uid();
    return res.json({
      success: true,
      adminToken,
      message:
        "Admin username and password are reset to 'admin' successfully. Please change password after logging in for security.",
    });
  }
  res.json({ success: false });
}

export function changePass(req, res) {
  let { prevPass, name, newPass } = req.body;
  if (prevPass !== adminDetails.password) {
    return res.json({
      success: false,
      type: "danger",
      message: "You have entered wrong previous password",
    });
  }
  adminDetails.name = name;
  adminDetails.password = newPass;
  reWriteAdminData(adminDetails);
  res.json({
    success: true,
    type: "success",
    message: "successfully changed admin credentials",
  });
}
