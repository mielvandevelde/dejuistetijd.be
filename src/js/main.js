const url = "time.php";

function setTime(time) {
  document.querySelector("time").innerHTML = time;
}

function getTime() {
  if (window.fetch) {
    // fetch API
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
      })
      .then(data => {
        setTime(data);
      });
  } else {
    // XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status === 200) {
        setTime(xhr.response);
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getTime();
  setInterval(getTime, 1000);
});
