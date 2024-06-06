//index.html

const translations = {
  en: {
    title: "Dixel - Size it right",
    chooseSize: "Choose Image Size",
    manualInput: "Manual Input",
    selectImages: "Select Images",
    labelSmall: "Small",
    labelMedium: "Medium",
    labelLarge: "Large",
    labelXlarge: "XXL",
    labelMobile: "Mobile",
    labelCustom: "Custom",
    widthPlaceholder: "Width in pixels",
    heightPlaceholder: "Height in pixels",
    dropAreaText: "Drop images here",
    resizedImages: "Resized Images",
  },
  de: {
    title: "Dixel - Size it right",
    chooseSize: "Bildgröße wählen",
    manualInput: "Manuelle Eingabe",
    selectImages: "Bilder auswählen",
    labelSmall: "Klein",
    labelMedium: "Mittel",
    labelLarge: "Groß",
    labelXlarge: "XXL",
    labelMobile: "Mobil",
    labelCustom: "Benutzerdefiniert",
    widthPlaceholder: "Breite in Pixel",
    heightPlaceholder: "Höhe in Pixel",
    dropAreaText: "Bilder hier ablegen",
    resizedImages: "Verkleinerte Bilder",
  },
};

function changeLanguage() {
  const language = document.getElementById("languageSelect").value;
  localStorage.setItem("selectedLanguage", language);
  applyTranslations(language);
}

function applyTranslations(language) {
  document.getElementById("title").textContent = translations[language].title;
  document.getElementById("chooseSize").textContent =
    translations[language].chooseSize;
  document.getElementById("manualInput").textContent =
    translations[language].manualInput;
  document.getElementById("labelSmall").textContent =
    translations[language].labelSmall;
  document.getElementById("labelMedium").textContent =
    translations[language].labelMedium;
  document.getElementById("labelLarge").textContent =
    translations[language].labelLarge;
  document.getElementById("labelXlarge").textContent =
    translations[language].labelXlarge;
  document.getElementById("labelMobile").textContent =
    translations[language].labelMobile;
  document.getElementById("labelCustom").textContent =
    translations[language].labelCustom;
  document.getElementById("width").placeholder =
    translations[language].widthPlaceholder;
  document.getElementById("height").placeholder =
    translations[language].heightPlaceholder;
  document.getElementById("dropAreaText").textContent =
    translations[language].dropAreaText;
  document.getElementById("resizedImages").textContent =
    translations[language].resizedImages;
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
