import fs from "fs";

function wf(path, data) {
  fs.writeFile(path, JSON.stringify(data), (err) => {
    if (err) console.log(err, " is err");
    else {
      console.log(`wrote ${path} file successfully`);
    }
  });
}

function checkIfExist(path, callback) {
  if (fs.existsSync(path)) {
    console.log(`${path} already exists !!`);
  } else {
    callback();
  }
}

checkIfExist("processed/", function () {
  fs.mkdirSync('processed');
  console.log('wrote processed/ folder successfully')
});

checkIfExist("processed/meanings.json", function () {
  const data1 = JSON.parse(
    fs.readFileSync(`./meaningsJson/meanings1.json`)
  ).data;
  const data2 = JSON.parse(
    fs.readFileSync(`./meaningsJson/meanings2.json`)
  ).data;
  wf("./processed/meanings.json", { data: { ...data1, ...data2 } });
});

checkIfExist("processed/admin.json", function () {
  wf("./processed/admin.json", {
    data: {
      name: "admin",
      password: "admin",
      security: false,
      loggedIn: false,
    },
  });
});

checkIfExist("processed/queries.json", function () {
  wf("./processed/queries.json", { data: [] });
});
