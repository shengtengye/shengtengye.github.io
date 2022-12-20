const container = document.querySelector(".container");

const cards = [
  {
    name: "2048",
    image: "images/coffee1.jpg"
  },
  {
    name: "Counter",
    image: "images/coffee2.jpg"
  },
  {
    name: "math",
    image: "images/coffee3.jpg"
  },
  {
    name: "minesweeper",
    image: "images/coffee4.jpg"
  }
];

const showCards = () => {
  let output = "";
  cards.forEach(
    ({ name, image }) =>
      (output += `
              <div class="card">
                <img class="card--avatar" src=${image} />
                <h1 class="card--title">${name}</h1>
                <a class="card--link" href="#">Taste</a>
              </div>
              `)
  );
  container.innerHTML = output;
};

document.addEventListener("DOMContentLoaded", showCards);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}
