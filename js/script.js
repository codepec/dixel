function renameFile(file) {
  const newFileName = document.getElementById("newFileName").value.trim();
  if (newFileName) {
    file.newName = newFileName;
  }
  return file;
}

function dragOverHandler(event) {
  event.preventDefault();
  const dropArea = document.getElementById("drop-area");
  dropArea.classList.add("drag-over");
}

function dragLeaveHandler(event) {
  event.preventDefault();
  const dropArea = document.getElementById("drop-area");
  dropArea.classList.remove("drag-over");
}

function dropHandler(event) {
  event.preventDefault();
  const dropArea = document.getElementById("drop-area");
  dropArea.classList.remove("drag-over");

  // Check if only image files are dropped
  for (let i = 0; i < event.dataTransfer.files.length; i++) {
    if (!event.dataTransfer.files[i].type.startsWith("image/")) {
      alert("Invalid file type");
      return;
    }
  }

  handleFiles(event.dataTransfer.files);
}

document.getElementById("fileSelect").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default anchor behavior
  document.getElementById("fileElem").click(); // Trigger the hidden file input
});

function handleFiles(files) {
  let selectedSize = document.querySelector('input[name="size"]:checked').value;
  let customWidth, customHeight;

  if (selectedSize === "custom") {
    customWidth = parseInt(document.getElementById("width").value);
    customHeight = parseInt(document.getElementById("height").value);

    if (isNaN(customWidth) || isNaN(customHeight) || customWidth <= 0 || customHeight <= 0) {
      alert("Invalid dimensions");
      return;
    }
  }

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    if (!file.type.startsWith("image/")) continue;

    file = renameFile(file); // Apply renaming if a new name is provided

    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let newWidth, newHeight;
        if (selectedSize === "custom") {
          const aspectRatio = img.width / img.height;
          if (customWidth / customHeight > aspectRatio) {
            newWidth = customHeight * aspectRatio;
            newHeight = customHeight;
          } else {
            newHeight = customWidth / aspectRatio;
            newWidth = customWidth;
          }
        } else {
          let targetSize = 1920; // Default target size for resizing

          if (img.width > img.height) {
            newWidth = targetSize;
            newHeight = Math.round(targetSize / (img.width / img.height));
          } else {
            newHeight = targetSize;
            newWidth = Math.round(targetSize * (img.width / img.height));
          }

          switch (selectedSize) {
            case "small":
              targetSize = 854;
              break;
            case "medium":
              targetSize = 1366;
              break;
            case "large":
              targetSize = 1920;
              break;
            case "xlarge":
              targetSize = 2560;
              break;
            case "mobile":
              targetSize = 320;
              break;
            default:
              targetSize = img.width > img.height ? img.width : img.height;
              break;
          }

          if (img.width > img.height) {
            newWidth = targetSize;
            newHeight = Math.round(targetSize / (img.width / img.height));
          } else {
            newHeight = targetSize;
            newWidth = Math.round(targetSize * (img.width / img.height));
          }
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const quality = parseFloat(document.getElementById("qualitySlider").value);
        const imageDataUrl = canvas.toDataURL("image/jpeg", quality);
        const imageData = atob(imageDataUrl.split(",")[1]);
        const imageSizeKB = (imageData.length / 1024).toFixed(2);

        const originalSizeKB = (file.size / 1024).toFixed(2);
        const compressionRatio = ((1 - imageSizeKB / originalSizeKB) * 100).toFixed(2);

        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
          <td>${escapeHTML(file.newName || file.name)}</td>
          <td>${escapeHTML(selectedSize)}</td>
          <td>${escapeHTML(newWidth)}</td>
          <td>${escapeHTML(newHeight)}</td>
          <td>${escapeHTML(originalSizeKB)}</td>
          <td>${escapeHTML(imageSizeKB)}</td>
          <td>${escapeHTML(compressionRatio)}%</td>
        `;
        document.querySelector("#image-table tbody").appendChild(tableRow);

        saveImage(imageDataUrl, file.newName || file.name, quality);
      };
    };
    reader.readAsDataURL(file);
  }
}

function escapeHTML(text) {
  const element = document.createElement('div');
  if (text) {
    element.innerText = text;
    text = element.innerHTML;
  }
  return text;
}

function saveImage(dataUrl, fileName) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = fileName;
  a.click();
}

// Event Listener für den Slider-Wert
document.getElementById("qualitySlider").addEventListener("input", function () {
  // Aktualisierung der Anzeige für die Bildqualität in Prozent
  document.getElementById("qualityValue").textContent =
    Math.round(this.value * 100) + "%";
  // Aktualisierung der quality-Variable
  quality = this.value;
});

const sizeRadios = document.querySelectorAll('input[name="size"]');
sizeRadios.forEach((radio) => {
  radio.addEventListener("change", function () {
    const customSizeContainer = document.getElementById("customSizeContainer");
    if (this.value === "custom") {
      customSizeContainer.style.display = "block";
    } else {
      customSizeContainer.style.display = "none";
    }
  });
});

function setDefaultSliderValue() {
  const slider = document.getElementById("qualitySlider");
  const sliderValueDisplay = document.getElementById("qualityValue");

  // Setze den Slider-Wert auf 0.9
  slider.value = 0.9;
  // Setze die Anzeige für die Qualität auf 90%
  sliderValueDisplay.textContent = "90%";
}

// Füge ein Event Listener hinzu, der die Funktion beim Laden der Seite aufruft
window.addEventListener("load", setDefaultSliderValue);
