var token = new URLSearchParams(window.location.search).get("token");

(function () {
  fetch(`${location.origin}/admin/api/queries?token=${token}`)
    .then((r) => r.json())
    .then((data) => {
      document.getElementById("meansNum").innerText = data.dataLength;
      document.getElementById("qNum").innerText = data.queries.length;
      setQueriesHtm(data.queries);
      console.log(data);
    })
    .catch((e) => {
      alert(`Error while fetching data: ${e.message}\nPlease try again`);
      console.log(e, " : error occurred while fetching data");
    });
})();

function setQueriesHtm(data) {
  let str = "";
  for (let i = 0; i < data.length; i++) {
    let { id, time, email, subject, message } = data[i];
    str += `
          <div class="my-2 card">
            <h6 class="card-header">
              ${time_ago(time)}
            </h6>
            <div class="card-body">
              <p class="card-text">
                <h6 class="card-subtitle text-muted d-inline">Posted on: </h6> <span>
                  ${time}
                </span>
              </p>
              <p class="card-text">
                <h6 class="card-subtitle text-muted d-inline">From: </h6> <span>
                  ${email}
                </span>
              </p>
              <p class="card-text">
                <h6 class="card-subtitle text-muted d-inline">Subject: </h6>
                <span>
                  ${subject}
                </span>
              </p>
              <p class="card-text">
                <h6 class="card-subtitle text-muted d-inline">Message: </h6>
                <span>
                  ${message}
                </span>
              </p>
              <hr>
              <div class="d-flex justify-content-start">
                <button type="button" onclick="removeReq('${id}')" class="btn btn-primary">Remove</button>
              </div>
            </div>
          </div>
    `;
  }

  document.getElementById("qData").innerHTML = str;
}
function time_ago(time) {
  switch (typeof time) {
    case "number":
      break;
    case "string":
      time = +new Date(time);
      break;
    case "object":
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, "seconds", 1], // 60
    [120, "1 minute ago", "1 minute from now"], // 60*2
    [3600, "minutes", 60], // 60*60, 60
    [7200, "1 hour ago", "1 hour from now"], // 60*60*2
    [86400, "hours", 3600], // 60*60*24, 60*60
    [172800, "Yesterday", "Tomorrow"], // 60*60*24*2
    [604800, "days", 86400], // 60*60*24*7, 60*60*24
    [1209600, "Last week", "Next week"], // 60*60*24*7*4*2
    [2419200, "weeks", 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, "Last month", "Next month"], // 60*60*24*7*4*2
    [29030400, "months", 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, "Last year", "Next year"], // 60*60*24*7*4*12*2
    [2903040000, "years", 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, "Last century", "Next century"], // 60*60*24*7*4*12*100*2
    [58060800000, "centuries", 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    token = "ago",
    list_choice = 1;

  if (seconds == 0) {
    return "Just now";
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    token = "from now";
    list_choice = 2;
  }
  var i = 0,
    format;
  while ((format = time_formats[i++]))
    if (seconds < format[0]) {
      if (typeof format[2] == "string") return format[list_choice];
      else
        return Math.floor(seconds / format[2]) + " " + format[1] + " " + token;
    }
  return time;
}
function removeReq(id) {
  if (confirm(`Are you sure you want to delete data of id: ${id}`)) {
    fetch(`${location.origin}/admin/api/remove?id=${id}&token=${token}`, {
      method: "delete",
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        setQueriesHtm(data);
      })
      .catch((e) => {
        alert(
          `There was an error while removing ${id}.\nPlease try again.\nError:${JSON.stringify(e, null, 2)}`
        );
        console.log(e, ` : error while removing ${id}`);
      });
  }
}
function downloadData(q) {
  fetch(`${location.origin}/admin/api/downloadJson?file=${q}&token=${token}`)
    .then((r) => r.json())
    .then((data) => {
      if (data.err) {
        alert("An error occurred while downloading data.\nPlease try again.");
        return;
      }
      console.log(data);
      downloadAsJson(q, data);
    })
    .catch((e) => {
      alert(
        `There was an error while downloading ${q} data\nPlease try again.\nError: ${JSON.stringify(e, null, 2)}`
      );
      console.log(e, ` :error occurred while downloading ${q} data `);
    });
}
function downloadAsJson(name, data) {
  let dataStr = JSON.stringify(data);
  var a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([dataStr], {
      type: "application/json",
    })
  );
  a.download = `${name}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.querySelectorAll("button").forEach((el) => {
  el.classList.add("bg-gradient");
});

let selected = "Add";
let showWorkBtn = document.getElementById("workWithWord");
let submitWorkBtn = document.getElementById("finishWork");
let modalBody = document.querySelector(".modal-body");

function setW(w) {
  selected = w;
  showWorkBtn.innerText = w;
}

showWorkBtn.addEventListener("click", function () {
  let input = document.getElementById("wordToWork");
  let inputVal = input.value;
  let modalHeading = document.getElementById("staticBackdropLabel");

  if (!inputVal || inputVal == "") {
    input.classList.add("is-invalid");
    return;
  }
  document.getElementById("modalBtn").click();
  switch (selected) {
    case "Add": {
      input.classList.remove("is-invalid");
      showSubmit();
      modalHeading.innerText = `Add Word ${inputVal} to API`;
      fetchWordData(`${inputVal}?q=exists`, "add");
      break;
    }
    case "Remove": {
      input.classList.remove("is-invalid");
      showSubmit();
      modalHeading.innerText = `Delete Word ${inputVal} from API`;
      fetchWordData(`${inputVal}?q=exists`, "remove");
      break;
    }
    case "fetch": {
      input.classList.remove("is-invalid");
      hideSubmit();
      modalHeading.innerText = `Fetch Word ${inputVal} from API`;
      fetchWordData(inputVal, "fetch");
      break;
    }
    case "Edit": {
      input.classList.remove("is-invalid");
      showSubmit();
      modalHeading.innerText = `Edit Word ${inputVal} in API`;
      fetchWordData(inputVal, "edit");
      break;
    }
    default:
      input.classList.remove("is-invalid");
      showSubmit();
      console.log("switch case was ran but no case was true.");
  }
});

function fetchWordData(input, work) {
  let paramsWord = input.split("?")[0].toUpperCase();
  fetch(`${location.origin}/api/${input}`)
    .then((r) => r.json())
    .then((data) => {
      switch (work) {
        case "add": {
          let addObj = [
            {
              WORD: document.getElementById("wordToWork").value.toUpperCase(),
              MEANINGS: [
                {
                  partsOfSpeech: "Noun",
                  definition: "word definition",
                  relatedWords: ["word1", "word2", "word3"],
                  exampleSentence: ["sentence 1", "sentence 2"],
                },
                {
                  partsOfSpeech: "Noun",
                  definition: "word definition 2",
                  relatedWords: ["word1", "word2", "word3"],
                  exampleSentence: ["sentence 1", "sentence 2"],
                },
              ],
              ANTONYMS: ["ant1", "ant2", "ant3"],
              SYNONYMS: ["syn1", "syn2", "syn3"],
            },
          ];
          if (data.result == false) {
            modalBody.innerHTML = `<h6 class="h6">Looks like Word '${paramsWord}' doesn't exist in API, Edit the content from below Code to add the word in API.</h6><pre id="jsonData" contenteditable="true">${JSON.stringify(
              addObj,
              null,
              2
            )}</pre>`;
            showSubmit();
            return;
          }
          modalBody.innerHTML = `<h6 class="h6">Word '${paramsWord}' already exists in API, Please try to edit it by clicking on 'Edit' option:</h6><pre>${JSON.stringify(data, null, 2 )}</pre>`;
          hideSubmit();
          break;
        }
        case "remove": {
          if (data.result == false) {
            modalBody.innerHTML = `<h6 class="h6">Looks like the Word ${paramsWord} already doesn't exist in API, Add it by clicking on 'Add' option </h6>`;
            hideSubmit();
            return;
          }
          modalBody.innerHTML = `<h6 class="h6">Are you sure you want to delete the word '${paramsWord}' and its Data from API :</h6><pre>${JSON.stringify( data, null, 2 )}</pre>`;
          showSubmit();
          break;
        }
        case "edit": {
          if (data[0].err) {
            modalBody.innerHTML = `
            <h6 class="h6">Word ${paramsWord} doesn't exist in API, add it by clicking on 'Add' option.</h6>
            `;
            hideSubmit();
            return;
          }
          modalBody.innerHTML = `<pre contenteditable="true">${JSON.stringify(data, null, 2 )}</pre>`;
          showSubmit();
          break;
        }
        case "fetch":
        default:
          modalBody.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
          hideSubmit();
      }
    })
    .catch((e) => {
      alert(
        `There was an error was fetching word\nPlease try again\nError: ${e.message}`
      );
      console.log(e);
    });
}

submitWorkBtn.addEventListener("click", function () {
  removeJsonErr();
  if (selected == "Add" || selected == "Edit") {
    let validation = isValidJson(modalBody.lastChild.innerText);
    if (validation.message) {
      let errMsg = `
      <p class="h6 text-danger">
        There was an error while parsing your data into json format, error shows following message: <br/> ${validation.message}
      </p>
      `;
      modalBody.insertAdjacentHTML("afterbegin", errMsg);
      modalBody.scrollTop = 0;
      console.log(validation);
      return;
    }
  }
  fetch(
    `${location.origin}/admin/api/word_work?opt=${selected}&token=${token}`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: modalBody.lastChild.innerText,
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      let { result = "danger", message } = data;
      document.getElementById("closeModalBtn").click();
      let msgAlert = document.createElement("div");
      msgAlert.setAttribute("class", `alert alert-${result}`);
      msgAlert.setAttribute("style", "position:fixed;top:0; width:100%;");
      msgAlert.setAttribute("role", "alert");
      msgAlert.innerText = message;

      document.body.appendChild(msgAlert);
      setTimeout(function() {
        modalBody.innerHTML = `<p>Nothing to see here :-&#40;</p>`;
      }, 100);
      setTimeout(function () {
        msgAlert.remove();
      }, 3000);
    })
    .catch((e) => {
      console.log(e);
      alert(
        `There was an error while posting your selected query and data to API server\nPlease try again\nError: ${e.message}`
      );
    });
});

function isValidJson(objStr) {
  try {
    let obj = JSON.parse(objStr);
    return true;
  } catch (e) {
    return e;
  }
}
function removeJsonErr() {
  let errPara = modalBody.querySelector("p");
  if (errPara) {
    errPara.remove();
  }
}
function hideSubmit() {
  submitWorkBtn.classList.add("d-none");
}
function showSubmit() {
  submitWorkBtn.classList.remove("d-none");
}

let convasAlert = document.getElementById("offcanvasAlert");
let prevPass = document.getElementById("pPass");
let name = document.getElementById("name");
let newPass = document.getElementById("nPass");
let confirmPass = document.getElementById("cPass");
document.getElementById("submitChange").addEventListener("click", submitChange);
function hideAlert() {
  if (convasAlert.classList.contains("alert-danger")) {
    convasAlert.classList.remove("alert-danger");
  }
  if (convasAlert.classList.contains("alert-success")) {
    convasAlert.classList.remove("alert-success");
  }
  convasAlert.style.display = "none";
  convasAlert.innerText = "";
}
function showAlert(type, text) {
  convasAlert.classList.add(`alert-${type}`);
  convasAlert.style.display = "block";
  convasAlert.innerText = text;
  document.querySelector(".offcanvas-body").scrollTop = 0;
}
function submitChange() {
  if (!name.value || !prevPass.value || !newPass.value) {
    showAlert("danger", "Please fill all the inputs!!");
    return;
  }
  if (newPass.value !== confirmPass.value) {
    showAlert(
      "danger",
      "Your new password didn't matched with confirmed password"
    );
    return;
  }
  hideAlert();
  let myInputData = {
    name: name.value,
    prevPass: prevPass.value,
    newPass: newPass.value,
  };
  fetch(`${location.origin}/change?token=${token}`, {
    method: "post",
    headers: {
      accept: "application.json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(myInputData),
  })
    .then((r) => r.json())
    .then((d) => {
      console.log(d);
      showAlert(d.type, d.message);
    })
    .catch((e) => {
      console.log(e);
    });
}

let logout = document.getElementById("logout");
logout.addEventListener("click", function () {
  if (confirm("Are you sure, you want to logout ?")) {
    fetch(`${location.origin}/logout`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          location.href = `/login`;
        }
      })
      .catch((e) => {
        alert("Error while logging out\nTry again");
        console.log(e);
      });
  }
});
