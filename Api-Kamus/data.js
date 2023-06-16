import fs from "fs";

const parsedData = readData("meanings");
var myData = parsedData.data;
const queryData = readData("queries");
var queries = queryData.data;

export var adminDetails = readData("admin").data;

function readData(fName) {
  let db = fs.readFileSync(`./processed/${fName}.json`);
  return JSON.parse(db);
}

function pushData(path, obj) {
  fs.writeFile(
    `./processed/${path}.json`,
    JSON.stringify({ data: obj }),
    (err) => {
      if (err) console.log("err occurred while writing data");
      else {
        console.log(`wrote new data to ${path}.json file successfully`);
      }
    }
  );
}

function removeQuery(id) {
  queries = queries.filter((obj) => obj.id !== id);
  pushData("queries", queries);
}

function addWord(obj) {
  let { WORD } = obj;
  if (Object.keys(myData).includes(WORD)) {
    return;
  }
  myData[WORD] = obj;
  pushData("meanings", myData);
}
function removeWord(obj) {
  let { WORD } = obj;
  delete myData[WORD];
  pushData("meanings", myData);
}
function editWord(obj) {
  let { WORD } = obj;
  myData[WORD] = obj;
  pushData("meanings", myData);
}

function reWriteAdminData(obj) {
  adminDetails = obj;
  console.log(adminDetails);
  pushData("admin", obj);
}

export {
  pushData,
  queries,
  removeQuery,
  addWord,
  removeWord,
  editWord,
  reWriteAdminData,
};
export default myData;
