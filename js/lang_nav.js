document.addEventListener("DOMContentLoaded", function () {
  const languageSelect = document.getElementById("languageSelect");

  // Set the initial language based on local storage
  const storedLanguage = localStorage.getItem("selectedLanguage");
  if (storedLanguage) {
    languageSelect.value = storedLanguage;
    applyTranslations(storedLanguage);
  } else {
    // Default to English if no language is stored
    applyTranslations("en");
  }

  languageSelect.addEventListener("change", function () {
    const selectedLanguage = this.value;
    localStorage.setItem("selectedLanguage", selectedLanguage);
    applyTranslations(selectedLanguage);
  });

  function changeLanguage() {
    const language = document.getElementById("languageSelect").value;
    localStorage.setItem("selectedLanguage", language);
    applyTranslations(language);
  }

  function applyTranslations(language) {
    if (language === "en") {
      document.documentElement.lang = "en";
      // Update text content for English

      document.getElementById("home").querySelector("a").textContent = "Home";
      document.getElementById("settings").querySelector("a").textContent =
        "Settings";
      document.getElementById("instructions").querySelector("a").textContent =
        "Get Started";
      // Add any other text content updates for English here
    } else if (language === "de") {
      document.documentElement.lang = "de";
      // Update text content for German

      document.getElementById("home").querySelector("a").textContent =
        "Startseite";
      document.getElementById("settings").querySelector("a").textContent =
        "Einstellungen";
      document.getElementById("instructions").querySelector("a").textContent =
        "Erste Schritte";
      // Add any other text content updates for German here
    }
  }
});
