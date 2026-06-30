/* =========================
   DESKTOP ICONS → OPEN WINDOWS
========================= */

const taskIcons = document.querySelectorAll(".desktop-icon");
const windows = document.querySelectorAll(".window");

// Start minimized
windows.forEach(win => win.style.display = "none");

let zIndexCounter = 10;

taskIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    const targetId = icon.dataset.target;
    const win = document.getElementById(targetId);
    if (!win) return;

    const isHidden = win.style.display === "none";
    win.style.display = isHidden ? "block" : "none";

    if (isHidden) {
      zIndexCounter += 1;
      win.style.zIndex = zIndexCounter;
    }
  });
});

/* =========================
   CLOSE / MINIMIZE BUTTONS
========================= */

windows.forEach(win => {
  const closeBtn = win.querySelector(".btn-close");
  const minBtn = win.querySelector(".btn-min");

  if (closeBtn) closeBtn.addEventListener("click", () => win.style.display = "none");
  if (minBtn) minBtn.addEventListener("click", () => win.style.display = "none");
});

/* =========================
   DRAGGABLE WINDOWS
========================= */

let dragData = null;

windows.forEach(win => {
  const header = win.querySelector(".window-header");

  header.addEventListener("mousedown", e => {
    dragData = {
      win,
      offsetX: e.clientX - win.offsetLeft,
      offsetY: e.clientY - win.offsetTop
    };

    zIndexCounter += 1;
    win.style.zIndex = zIndexCounter;

    document.body.style.userSelect = "none";
  });
});

document.addEventListener("mousemove", e => {
  if (!dragData) return;

  const { win, offsetX, offsetY } = dragData;
  win.style.left = e.clientX - offsetX + "px";
  win.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
  dragData = null;
  document.body.style.userSelect = "";
});

/* =========================
   RESIZABLE WINDOWS
========================= */

let resizeData = null;

windows.forEach(win => {
  const resizeHandle = win.querySelector(".window-resize");

  resizeHandle.addEventListener("mousedown", e => {
    resizeData = {
      win,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: win.offsetWidth,
      startHeight: win.offsetHeight
    };
    e.preventDefault();
  });
});

document.addEventListener("mousemove", e => {
  if (!resizeData) return;

  const { win, startX, startY, startWidth, startHeight } = resizeData;

  const newWidth = startWidth + (e.clientX - startX);
  const newHeight = startHeight + (e.clientY - startY);

  win.style.width = Math.max(240, newWidth) + "px";
  win.style.height = Math.max(180, newHeight) + "px";
});

document.addEventListener("mouseup", () => {
  resizeData = null;
});

/* =========================
   TASKBAR CLOCK
========================= */

const clockEl = document.getElementById("clock");

function updateClock() {
  const now = new Date();

  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const day = dayNames[now.getDay()];

  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  clockEl.textContent = `${day} ${dd}/${mm}/${yyyy} • ${time}`;
}

updateClock();
setInterval(updateClock, 1000);

/* =========================
   POMODORO TIMER
========================= */

let pomoInterval = null;
let pomoSeconds = 0;
let pomoTotal = 0;
let pomoMode = "work";

const pomoWorkInput = document.getElementById("pomo-work");
const pomoBreakInput = document.getElementById("pomo-break");
const pomoLabel = document.getElementById("pomo-label");
const pomoTime = document.getElementById("pomo-time");
const pomoProgressBar = document.getElementById("pomo-progress-bar");

function setPomodoro(mode) {
  pomoMode = mode;
  const mins = mode === "work" ? Number(pomoWorkInput.value) : Number(pomoBreakInput.value);
  pomoSeconds = mins * 60;
  pomoTotal = pomoSeconds;
  pomoLabel.textContent = mode === "work" ? "Work Session" : "Break Session";
  renderPomodoro();
}

function renderPomodoro() {
  const m = String(Math.floor(pomoSeconds / 60)).padStart(2, "0");
  const s = String(pomoSeconds % 60).padStart(2, "0");
  pomoTime.textContent = `${m}:${s}`;
  pomoProgressBar.style.width = `${100 - (pomoSeconds / pomoTotal) * 100}%`;
}

function startPomodoro() {
  if (pomoInterval) return;

  pomoInterval = setInterval(() => {
    if (pomoSeconds > 0) {
      pomoSeconds--;
      renderPomodoro();
    } else {
      clearInterval(pomoInterval);
      pomoInterval = null;

      if (pomoMode === "work") {
        alert("Work session done! Time for a break.");
        setPomodoro("break");
        startPomodoro();
      } else {
        alert("Break finished! Back to work.");
        setPomodoro("work");
        startPomodoro();
      }
    }
  }, 1000);
}

document.getElementById("pomo-start").addEventListener("click", startPomodoro);
document.getElementById("pomo-pause").addEventListener("click", () => {
  clearInterval(pomoInterval);
  pomoInterval = null;
});
document.getElementById("pomo-reset").addEventListener("click", () => {
  clearInterval(pomoInterval);
  pomoInterval = null;
  setPomodoro("work");
});

setPomodoro("work");

/* =========================
   MOTIVATION TAB
========================= */

document.getElementById("motivation-launch-btn").addEventListener("click", () => {
  window.open("https://yourmotivationwebsite.com", "_blank");
});

/* =========================
   DAILY XP SYSTEM
========================= */

let xpState = JSON.parse(localStorage.getItem("daily_xp_state") || `{
  "level": 1,
  "xp": 0,
  "next": 100
}`);

const xpLevelEl = document.getElementById("xp-level");
const xpCurrentEl = document.getElementById("xp-current");
const xpNextEl = document.getElementById("xp-next");
const xpBarFill = document.getElementById("xp-bar-fill");

function renderXP() {
  xpLevelEl.textContent = xpState.level;
  xpCurrentEl.textContent = xpState.xp;
  xpNextEl.textContent = xpState.next;
  xpBarFill.style.width = `${(xpState.xp / xpState.next) * 100}%`;
}

function addXP(amount) {
  xpState.xp += amount;

  while (xpState.xp >= xpState.next) {
    xpState.xp -= xpState.next;
    xpState.level++;
    xpState.next = Math.round(xpState.next * 1.2);
  }

  renderXP();
  localStorage.setItem("daily_xp_state", JSON.stringify(xpState));
}

document.querySelectorAll(".xp-actions button").forEach(btn => {
  btn.addEventListener("click", () => addXP(Number(btn.dataset.xp)));
});

renderXP();

/* =========================
   SPOTIFY PLAYER
========================= */

let spotifyPlayer;
let spotifyDeviceId = null;

window.onSpotifyWebPlaybackSDKReady = () => {
  spotifyPlayer = new Spotify.Player({
    name: "Dawned Edu Web OS Player",
    getOAuthToken: cb => cb(localStorage.getItem("spotify_token")),
    volume: 0.5
  });

  spotifyPlayer.addListener("ready", ({ device_id }) => {
    spotifyDeviceId = device_id;
    document.getElementById("spotify-status").textContent = "Connected to Spotify ✔";
  });

  spotifyPlayer.connect();
};

document.getElementById("spotify-login").addEventListener("click", () => {
  const clientId = "YOUR_SPOTIFY_CLIENT_ID";
  const redirectUri = "YOUR_REDIRECT_URL";

  const url =
    "https://accounts.spotify.com/authorize" +
    "?client_id=" + clientId +
    "&response_type=token" +
    "&redirect_uri=" + encodeURIComponent(redirectUri) +
    "&scope=user-modify-playback-state";

  window.location.href = url;
});

if (window.location.hash.includes("access_token")) {
  const token = window.location.hash.split("access_token=")[1].split("&")[0];
  localStorage.setItem("spotify_token", token);
  document.getElementById("spotify-status").textContent = "Logged in ✔ Reloading...";
  setTimeout(() => window.location.href = window.location.origin, 800);
}

document.getElementById("spotify-play").addEventListener("click", () => {
  const trackUri = document.getElementById("spotify-track").value.trim();
  const token = localStorage.getItem("spotify_token");

  if (!trackUri || !token || !spotifyDeviceId) {
    alert("Missing track URI, login, or device.");
    return;
  }

  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${spotifyDeviceId}`, {
    method: "PUT",
    body: JSON.stringify({ uris: [trackUri] }),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  });
});

/* =========================
   CALENDAR SYSTEM
========================= */

const calGrid = document.getElementById("calendar-grid");
const calMonthLabel = document.getElementById("cal-month");
const eventDateLabel = document.getElementById("event-date-label");
const eventList = document.getElementById("event-list");
const eventTitleInput = document.getElementById("event-title");
const eventDescInput = document.getElementById("event-desc");
const eventAddBtn = document.getElementById("event-add-btn");

let calDate = new Date();
let selectedDay = null;

let calendarEvents = JSON.parse(localStorage.getItem("calendar_events") || "{}");

function saveEvents() {
  localStorage.setItem("calendar_events", JSON.stringify(calendarEvents));
}

function renderCalendar() {
  calGrid.innerHTML = "";

  const year = calDate.getFullYear();
  const month = calDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calMonthLabel.textContent = calDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-day empty";
    calGrid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayEl = document.createElement("div");
    dayEl.className = "calendar-day";
    dayEl.textContent = d;

    const today = new Date();
    if (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayEl.classList.add("today");
    }

    dayEl.addEventListener("click", () => {
      selectedDay = `${d}-${month + 1}-${year}`;
      eventDateLabel.textContent = `Events for ${d}/${month + 1}/${year}`;

      document.querySelectorAll(".calendar-day").forEach(el =>
        el.classList.remove("selected")
      );
      dayEl.classList.add("selected");

      renderEvents();
    });

    calGrid.appendChild(dayEl);
  }
}

function renderEvents() {
  eventList.innerHTML = "";

  const events = calendarEvents[selectedDay] || [];

  if (events.length === 0) {
    eventList.innerHTML = "<p>No events yet.</p>";
    return;
  }

  events.forEach((ev, index) => {
    const div = document.createElement("div");
    div.className = "event-item";
    div.innerHTML = `
      <strong>${ev.title}</strong><br>
      <span>${ev.desc}</span><br>
      <button data-index="${index}" class="delete-event">Delete</button>
      <hr>
    `;
    eventList.appendChild(div);
  });

  document.querySelectorAll(".delete-event").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      calendarEvents[selectedDay].splice(index, 1);
      saveEvents();
      renderEvents();
    });
  });
}

eventAddBtn.addEventListener("click", () => {
  if (!selectedDay) {
    alert("Select a day first.");
    return;
  }

  const title = eventTitleInput.value.trim();
  const desc = eventDescInput.value.trim();

  if (!title) {
    alert("Event needs a title.");
    return;
  }

  if (!calendarEvents[selectedDay]) {
    calendarEvents[selectedDay] = [];
  }

  calendarEvents[selectedDay].push({ title, desc });
  saveEvents();

  eventTitleInput.value = "";
  eventDescInput.value = "";

  renderEvents();
});

document.getElementById("cal-prev").addEventListener("click", () => {
  calDate.setMonth(calDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("cal-next").addEventListener("click", () => {
  calDate.setMonth(calDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

/* =========================
   GOOGLE APP
========================= */

document.getElementById("google-launch-btn").addEventListener("click", () => {
  window.open("https://www.google.com", "_blank");
});
