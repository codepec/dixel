// JavaScript

function toggleDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;

  if (darkModeToggle.checked) {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
}

// JavaScript
// Diese Funktion prüft den Initialstatus des Dark-Mode beim Laden der Seite
function checkDarkMode() {
  const darkModeEnabled = localStorage.getItem("darkModeEnabled");
  if (darkModeEnabled === "true") {
    enableDarkMode();
  }
}

// Diese Funktion aktiviert den Dark-Mode und speichert den Zustand im Local Storage
function enableDarkMode() {
  document.body.classList.add("dark-mode");
  localStorage.setItem("darkModeEnabled", "true");
}

// Diese Funktion deaktiviert den Dark-Mode und speichert den Zustand im Local Storage
function disableDarkMode() {
  document.body.classList.remove("dark-mode");
  localStorage.setItem("darkModeEnabled", "false");
}

// Diese Funktion wird aufgerufen, wenn der Benutzer den Schalter umlegt
function toggleDarkMode() {
  const darkModeEnabled = localStorage.getItem("darkModeEnabled");
  if (darkModeEnabled === "true") {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
}

// Diese Funktion wird beim Laden der Seite aufgerufen, um den Dark-Mode-Status zu überprüfen
window.onload = checkDarkMode;
