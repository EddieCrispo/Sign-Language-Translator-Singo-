import fs from "fs";
import myData, {
  queries,
  removeQuery,
  addWord,
  removeWord,
  editWord,
} from "../data.js";

export function getQueries(req, res) {
  res.json({ queries, dataLength: Object.keys(myData).length });
}

export function downloadJson(req, res) {
  let { file } = req.query;
  console.log("received a download req for " + file);
  if (file == "queries") {
    return res.json({ data: queries });
  }
  const filterDataByStartingLetters = (startingLetters, myData) => {
    let data = [];
    for (let key in myData) {
      let word = key;
      if (startingLetters.includes(word.charAt(0))) {
        data.push(myData[key]);
      }
    }
    return data;
  };

  switch (file) {
    case "a-c":
      return res.json({
        data: filterDataByStartingLetters(["A", "B", "C"], myData),
      });
    case "d-f":
      return res.json({
        data: filterDataByStartingLetters(["D", "E", "F"], myData),
      });
    case "g-i":
      return res.json({
        data: filterDataByStartingLetters(["G", "H", "I"], myData),
      });
    case "j-l":
      return res.json({
        data: filterDataByStartingLetters(["J", "K", "L"], myData),
      });
    case "m-o":
      return res.json({
        data: filterDataByStartingLetters(["M", "N", "O"], myData),
      });
    case "p-r":
      return res.json({
        data: filterDataByStartingLetters(["P", "Q", "R"], myData),
      });
    case "s-u":
      return res.json({
        data: filterDataByStartingLetters(["S", "T", "U"], myData),
      });
    case "v-z":
      return res.json({
        data: filterDataByStartingLetters(["V", "W", "X", "Y", "Z"], myData),
      });
    default:
      console.log(`error: ${file} not found !!`);
      return res.json({ err: "no such file exists" });
  }
}

export function remove(req, res) {
  removeQuery(req.query.id);
  res.json(queries);
}

export function workWithWord(req, res) {
  let body = req.body[0];
  let { opt } = req.query;
  switch (opt) {
    case "Add":
      addWord(body);
      res.json({
        result: "success",
        message: `Added Word "${body.WORD}" In the API successfully.`,
      });
      break;
    case "Remove":
      removeWord(body);
      res.json({
        result: "success",
        message: `Removed Word "${body.WORD}" from the API successfully.`,
      });
      break;
    case "Edit":
      editWord(body);
      res.json({
        result: "success",
        message: `Edited Word "${body}" In the API successfully.`,
      });
      break;
    default:
      res.status(400).json({
        result: "danger",
        message: "Looks like your query can't be resolved !!",
      });
  }
}
