const showUrlTo = document.querySelectorAll(".hostUrl");
const inputWord = document.querySelector("#basic-url");
const btn = document.querySelector("#fetchBtn");
const showRes = document.querySelector("#showResponse");

showUrlTo.forEach((elem) => {
  elem.innerText = window.location.origin;
});

let inputWordErr = false;
inputWord.innerText = "test";
inputWord.addEventListener("input", function myFunc() {
  let value = inputWord.innerText;
  let space = value.split("");
  if (space.includes(" ")) {
    inputWordErr = "Word cannot contain whitespaces";
  } else if (space.length >= 26) {
    inputWordErr = "Word should not be more than 26 characters";
  } else if (space.length == 0) {
    inputWordErr = "Word cannot be empty";
  } else {
    inputWordErr = false;
  }
});

btn.addEventListener("click", function () {
  if (!inputWordErr) {
    fetchWord();
  } else {
    alert(inputWordErr);
  }
});
btn.click();

function downloadWordlist() {
  fetch(`/download/all/words`, {
    headers: {
      "Content-type": "text/plain",
    },
    Method: "get",
  })
    .then((res) => res.text())
    .then((data) => {
      let dataArr = data.split(",");
      downloadtxtFile(dataArr);
    })
    .catch((e) => {
      showAlert("downloadErr");
      console.log(e, "error occurred while downloading data");
    });
}
function downloadtxtFile(data) {
  let dataStr = data.join("\n");
  var a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([dataStr], {
      type: "text/plain",
    })
  );
  a.download = "wordlist.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
function fetchWord() {
  fetch(`/api/${inputWord.innerText}`)
    .then((response) => response.json())
    .then((data) => {
      showRes.innerText = JSON.stringify(data, null, 2);
    })
    .catch((e) => {
      showAlert("fetchErr");
      console.log(e, "err fetching data");
    });
}
function showAlert(id) {
  let alertId = document.getElementById(id);
  alertId.style.display = "block";
  setTimeout(() => {
    alertId.style.display = "none";
  }, 3000);
}

document.getElementById("submitBtn").addEventListener("click", submitForm);

function submitForm() {
  let email = document.getElementById("email");
  let subject = document.getElementById("subject");
  let message = document.getElementById("message");
  let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

  if (!regex.test(email.value)) {
    email.classList.add("is-invalid");
    message.classList.remove("is-invalid");
  } else if (message.value.length < 10) {
    email.classList.remove("is-invalid");
    message.classList.add("is-invalid");
  } else {
    email.classList.remove("is-invalid");
    message.classList.remove("is-invalid");
    let myObj = {
      email: email.value,
      subject: subject.value,
      message: message.value,
    };
    fetch(`/api/contact`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(myObj),
    })
      .then((r) => r.json())
      .then((d) => {
        console.log(d);
        showAlert("contactSuccess");
        email.value = "";
        subject.value = "";
        message.value = "";
      })
      .catch((e) => {
        showAlert("contactErr");
        console.log(e, " :contact query error");
      });
  }
}
