const tabs = document.querySelectorAll(".toy-tab");
const panels = document.querySelectorAll(".toy-panel");
const tickerText = document.querySelector("#tickerText");

const tickerLines = {
  weather: "The sky is learning your color choices.",
  dots: "The dots are pretending to be statistics.",
  sandwich: "Lunch has entered its architectural period.",
  timeline: "A fossilized homepage is being gently dusted."
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const nextToy = tab.dataset.toy;
    tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === nextToy));
    tickerText.textContent = tickerLines[nextToy];
    if (nextToy === "dots") drawDots();
  });
});

const weatherCanvas = document.querySelector("#weatherCanvas");
const weatherContext = weatherCanvas.getContext("2d");
const moods = {
  sunrise: ["#ffb45a", "#ffe7ad", "#ff6574", "#243b55"],
  storm: ["#243447", "#6b879f", "#d8e7ef", "#15202a"],
  mint: ["#9ff3d1", "#eaffc7", "#31b7a8", "#24433f"],
  midnight: ["#111827", "#2f3a8f", "#d8b4fe", "#090e1a"]
};
let activeMood = "sunrise";
let weatherTick = 0;

document.querySelectorAll(".mood-button").forEach((button) => {
  button.addEventListener("click", () => {
    activeMood = button.dataset.mood;
    document.querySelectorAll(".mood-button").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
  });
});

function drawWeather() {
  const width = weatherCanvas.width;
  const height = weatherCanvas.height;
  const [top, bottom, accent, dark] = moods[activeMood];
  const sky = weatherContext.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, top);
  sky.addColorStop(1, bottom);
  weatherContext.fillStyle = sky;
  weatherContext.fillRect(0, 0, width, height);

  weatherContext.fillStyle = accent;
  for (let i = 0; i < 9; i += 1) {
    const x = ((i * 137 + weatherTick * (0.4 + i * 0.03)) % (width + 160)) - 80;
    const y = 70 + Math.sin(weatherTick / 35 + i) * 22 + (i % 3) * 36;
    blob(x, y, 48 + (i % 4) * 18, 0.26);
  }

  weatherContext.fillStyle = dark;
  const buildingCount = 16;
  for (let i = 0; i < buildingCount; i += 1) {
    const buildingWidth = width / buildingCount + 8;
    const buildingHeight = 130 + ((i * 53) % 190);
    const x = i * (width / buildingCount) - 4;
    weatherContext.fillRect(x, height - buildingHeight, buildingWidth, buildingHeight);

    weatherContext.fillStyle = activeMood === "midnight" ? "#ffe792" : "#fff7d1";
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 2; col += 1) {
        if ((row + col + i + Math.floor(weatherTick / 70)) % 3 !== 0) {
          weatherContext.fillRect(x + 16 + col * 24, height - buildingHeight + 22 + row * 32, 10, 14);
        }
      }
    }
    weatherContext.fillStyle = dark;
  }

  weatherContext.fillStyle = "rgba(255, 255, 255, 0.42)";
  for (let i = 0; i < 80; i += 1) {
    const x = (i * 79 + weatherTick * 1.3) % width;
    const y = (i * 41 + weatherTick * 0.7) % height;
    weatherContext.beginPath();
    weatherContext.arc(x, y, 1.4 + (i % 3), 0, Math.PI * 2);
    weatherContext.fill();
  }

  weatherTick += 1;
  requestAnimationFrame(drawWeather);
}

function blob(x, y, radius, alpha) {
  weatherContext.globalAlpha = alpha;
  weatherContext.beginPath();
  weatherContext.arc(x, y, radius, 0, Math.PI * 2);
  weatherContext.arc(x + radius * 0.85, y + 8, radius * 0.75, 0, Math.PI * 2);
  weatherContext.arc(x - radius * 0.8, y + 12, radius * 0.7, 0, Math.PI * 2);
  weatherContext.fill();
  weatherContext.globalAlpha = 1;
}

const dotCanvas = document.querySelector("#dotCanvas");
const dotContext = dotCanvas.getContext("2d");
const dotRange = document.querySelector("#dotRange");
const dotCount = document.querySelector("#dotCount");

dotRange.addEventListener("input", drawDots);

function drawDots() {
  const count = Number(dotRange.value);
  dotCount.textContent = count.toLocaleString();
  dotContext.fillStyle = "#fffdfa";
  dotContext.fillRect(0, 0, dotCanvas.width, dotCanvas.height);
  dotContext.fillStyle = "#172126";
  const gap = Math.max(4, Math.floor(Math.sqrt((dotCanvas.width * dotCanvas.height) / count)));
  let drawn = 0;

  for (let y = 18; y < dotCanvas.height - 74 && drawn < count; y += gap) {
    for (let x = 18; x < dotCanvas.width - 18 && drawn < count; x += gap) {
      const jitter = ((drawn * 17) % 5) - 2;
      dotContext.globalAlpha = 0.5 + (drawn % 5) * 0.1;
      dotContext.beginPath();
      dotContext.arc(x + jitter, y - jitter, Math.max(1.2, gap * 0.22), 0, Math.PI * 2);
      dotContext.fill();
      drawn += 1;
    }
  }

  dotContext.globalAlpha = 1;
  dotContext.fillStyle = "#ff5b5b";
  dotContext.font = "900 34px system-ui";
  dotContext.fillText(`${drawn.toLocaleString()} visible dots`, 26, dotCanvas.height - 112);
}

const sandwichStack = document.querySelector("#sandwichStack");
const sandwichHeight = document.querySelector("#sandwichHeight");
const sandwichVibe = document.querySelector("#sandwichVibe");
const layerData = {
  tomato: ["#e95757", 22, 82],
  cheese: ["#ffd45a", 20, 88],
  pickle: ["#75b843", 18, 76],
  egg: ["#fff2b2", 26, 84],
  jam: ["#9c2f6b", 18, 72]
};
const vibes = [
  "Polite lunch",
  "Picnic theory",
  "Structural snack",
  "Questionable tower",
  "Museum-grade meal",
  "A delicious zoning issue"
];
let sandwichLayers = [];

document.querySelector(".ingredient-board").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.action === "reset") {
    sandwichLayers = [];
  } else {
    sandwichLayers.push(button.dataset.layer);
  }
  renderSandwich();
});

function renderSandwich() {
  sandwichStack.innerHTML = "";
  const bottom = document.createElement("div");
  bottom.className = "layer bread bottom";
  sandwichStack.append(bottom);

  sandwichLayers.forEach((layerName, index) => {
    const [color, height, width] = layerData[layerName];
    const layer = document.createElement("div");
    layer.className = "layer";
    layer.style.setProperty("--c", color);
    layer.style.setProperty("--h", `${height}px`);
    layer.style.setProperty("--w", `${width + (index % 3) * 3}%`);
    sandwichStack.append(layer);
  });

  const top = document.createElement("div");
  top.className = "layer bread top";
  sandwichStack.append(top);

  const height = 2.8 + sandwichLayers.length * 0.7;
  sandwichHeight.textContent = `${height.toFixed(1)} cm`;
  sandwichVibe.textContent = vibes[Math.min(vibes.length - 1, Math.floor(sandwichLayers.length / 2))];
}

const fossils = [
  {
    year: 1996,
    title: "Guestbook Galaxy",
    url: "http://home.example/~beep",
    text: "A page with eleven counters, five fonts, and one sincere guestbook.",
    art: "repeating-linear-gradient(45deg, #172126 0 8px, #ffc94a 8px 16px)"
  },
  {
    year: 2003,
    title: "Button Garden",
    url: "http://clickworld.example/buttons",
    text: "Everything is a button, including the paragraph explaining the buttons.",
    art: "radial-gradient(circle at 30% 30%, #ff5b5b 0 16%, transparent 17%), radial-gradient(circle at 72% 62%, #29b8b4 0 18%, transparent 19%), #ffe7ad"
  },
  {
    year: 2011,
    title: "Infinite Quiz",
    url: "https://quiz.example/forever",
    text: "A quiz that seems short until question 84 asks what kind of cloud you are.",
    art: "linear-gradient(135deg, #8367c7 0 25%, #fff 25% 50%, #b8d94b 50% 75%, #172126 75%)"
  },
  {
    year: 2018,
    title: "Scroll Aquarium",
    url: "https://soft.example/aquarium",
    text: "A scrolling experiment where the fish are calmer than the analytics dashboard.",
    art: "repeating-radial-gradient(circle at 30% 40%, #29b8b4 0 8px, #d5f2e5 9px 22px)"
  },
  {
    year: 2026,
    title: "Tiny Museum",
    url: "https://tiny.example/museum",
    text: "A compact cabinet of handmade web toys, built for wandering instead of optimizing.",
    art: "conic-gradient(from 90deg, #ff5b5b, #ffc94a, #29b8b4, #8367c7, #ff5b5b)"
  }
];
const yearRange = document.querySelector("#yearRange");
const yearValue = document.querySelector("#yearValue");
const fossilUrl = document.querySelector("#fossilUrl");
const fossilTitle = document.querySelector("#fossilTitle");
const fossilText = document.querySelector("#fossilText");
const fossilImage = document.querySelector("#fossilImage");

yearRange.addEventListener("input", renderFossil);

function renderFossil() {
  const year = Number(yearRange.value);
  yearValue.textContent = year;
  const fossil = fossils.reduce((closest, item) => {
    return Math.abs(item.year - year) < Math.abs(closest.year - year) ? item : closest;
  }, fossils[0]);
  fossilUrl.textContent = fossil.url;
  fossilTitle.textContent = fossil.title;
  fossilText.textContent = fossil.text;
  fossilImage.style.setProperty("--fossil-art", fossil.art);
}

renderSandwich();
renderFossil();
drawDots();
drawWeather();
