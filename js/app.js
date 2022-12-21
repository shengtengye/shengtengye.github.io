const container = document.querySelector(".container");

const cards = [
  {
    name: "2048",
    image: "images/coffee1.jpg",
    link: "./2048/index.html"
  },
  {
    name: "counter",
    image: "images/coffee2.jpg",
    link: "./counter/index.html"
  },
  {
    name: "math",
    image: "images/coffee3.jpg",
    link: "./math/index.html"
  },
  {
    name: "minesweeper",
    image: "images/coffee4.jpg",
    link: "./minesweeper/index.html"
  },
  {
    name: "typing",
    image: "images/coffee5.jpg",
    link: "./typing/index.html"
  },
];

const showCards = () => {
  let output = "";
  cards.forEach(
    ({ name, image, link }) =>
      (output += `
              <div class="card">
                <a href=${link}>
                <img class="card--avatar" src=${image} />
                <h1 class="card--title">${name}</h1>
                <!--a class="card--link" href=${link}>${name}</a-->
                </a>
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

let isSupported = false;

if ('wakeLock' in navigator) {
  isSupported = true;
  console.log('Screen Wake Lock API supported!');
} else {
  console.log('Wake lock is not supported by this browser.');
}

if (isSupported) {
  // create a reference for the wake lock
  let wakeLock = null;

  // create an async function to request a wake lock
  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock is active!');
    } catch (err) {
      // if wake lock request fails - usually system related, such as battery
      console.log(`${err.name}, ${err.message}`);
    }
  }
  
  requestWakeLock()
}
