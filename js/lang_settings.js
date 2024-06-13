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

      document.querySelector(".settings-title").textContent = "Settings";
      document.querySelector("label[for='languageSelect']").textContent =
        "Select your Language:";
      document.querySelector(".toggle-container p").textContent = "Dark Mode:";
      document.querySelector(
        ".settings-section:nth-child(3) .toggle-container p"
      ).textContent = "Offline Mode:";
    } else if (language === "de") {
      document.documentElement.lang = "de";
      // Update text content for German

      document.querySelector(".settings-title").textContent = "Einstellungen";
      document.querySelector("label[for='languageSelect']").textContent =
        "Sprache auswählen:";
      document.querySelector(".toggle-container p").textContent =
        "Dunkelmodus:";
      document.querySelector(
        ".settings-section:nth-child(3) .toggle-container p"
      ).textContent = "Offline Modus:";
    }
  }
});
