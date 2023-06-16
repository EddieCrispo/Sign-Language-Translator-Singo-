import myData, { queries, pushData } from "../data.js";

function findMeaning(word) {
  let UpperCasedWord = word.toUpperCase();
  let meaningObj = myData[UpperCasedWord];
  if (meaningObj) return meaningObj;

  const err = { err: `word ${UpperCasedWord} doesn't exist in dictionary` };
  return err;
}

export function uid() {
  return Math.random().toString(36).slice(2);
}

export const findOne = (req, res) => {
  let meaning = findMeaning(req.params.word);
  if (req.query.q == "exists") {
    if (meaning.err) {
      return res.json({ result: false });
    }
    return res.json([meaning]);
  }
  res.json([meaning]);
};

export const findTwo = (req, res) => {
  let { word1, word2 } = req.params;
  let defs = [];
  let meaning1 = findMeaning(word1);
  let meaning2 = findMeaning(word2);
  res.json([meaning1, meaning2]);
};

export const contact = (req, res) => {
  let newData = { ...req.body, id: uid(), time: new Date() };
  pushData("queries", [...queries, newData]);
  res.json({ result: "success" });
};
