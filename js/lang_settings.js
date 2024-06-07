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

      // Setze den Tooltip-Text für Englisch
      document.getElementById("installButton").title =
        "Simply click 'Install Dixel' to install Dixel on your device and get quick access to our application. With the installation, you can use Dixel like a traditional app and benefit from the additional features and advantages of a progressive web app.";
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

      // Setze den Tooltip-Text für Deutsch
      document.getElementById("installButton").title =
        "Einfach auf 'Install Dixel' klicken, um Dixel auf Ihrem Gerät zu installieren und einen schnellen Zugriff auf unsere Anwendung zu erhalten. Mit der Installation können Sie Dixel wie eine herkömmliche App verwenden und von den zusätzlichen Funktionen und Vorteilen einer progressiven Web-App profitieren.";
    }
  }
});
