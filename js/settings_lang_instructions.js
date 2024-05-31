// instructions.html
function applyTranslations(language) {
  if (language === "en") {
    document.getElementById("instructions-de").style.display = "none";
    document.getElementById("instructions-en").style.display = "block";
  } else if (language === "de") {
    document.getElementById("instructions-en").style.display = "none";
    document.getElementById("instructions-de").style.display = "block";
  }
}

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
});
