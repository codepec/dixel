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
      alert("Invalid");
      return;
    }
  }

  handleFiles(event.dataTransfer.files);
}

function handleFiles(files) {
  let selectedSize = document.querySelector('input[name="size"]:checked').value;
  let customWidth, customHeight;

  if (selectedSize === "custom") {
    customWidth = parseInt(document.getElementById("width").value);
    customHeight = parseInt(document.getElementById("height").value);

    if (
      isNaN(customWidth) ||
      isNaN(customHeight) ||
      customWidth <= 0 ||
      customHeight <= 0
    ) {
      alert("Invalid");
      return;
    }
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith("image/")) continue;
    const reader = new FileReader();

    reader.onprogress = function (event) {
      const percentLoaded = Math.round((event.loaded / event.total) * 100);
      document.getElementById("progress-bar").style.width = percentLoaded + "%";
    };

    reader.onloadstart = function () {
      document.getElementById("progress-container").style.display = "block";
    };

    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let newWidth, newHeight;
        if (selectedSize === "custom") {
          // Calculate new dimensions while maintaining aspect ratio
          const aspectRatio = img.width / img.height;
          if (customWidth / customHeight > aspectRatio) {
            newWidth = customHeight * aspectRatio;
            newHeight = customHeight;
          } else {
            newHeight = customWidth / aspectRatio;
            newWidth = customWidth;
          }
        } else {
          switch (selectedSize) {
            case "small":
              newWidth = 854;
              newHeight = Math.round(854 / (img.width / img.height));
              break;
            case "medium":
              newWidth = 1366;
              newHeight = Math.round(1366 / (img.width / img.height));
              break;
            case "large":
              newWidth = 1920;
              newHeight = Math.round(1920 / (img.width / img.height));
              break;
            case "xlarge":
              newWidth = 2560;
              newHeight = Math.round(2560 / (img.width / img.height));
              break;
            case "mobile":
              newWidth = 320;
              newHeight = Math.round(320 / (img.width / img.height));
              break;
            default:
              newWidth = img.width;
              newHeight = img.height;
              break;
          }
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const doneText = document.createElement("p");
        doneText.appendChild(
          document.createTextNode(
            file.name +
              " - " +
              selectedSize +
              " - " +
              newWidth +
              " x " +
              newHeight +
              " - 100%"
          )
        );

        const imageContainer = document.getElementById("image-container");
        imageContainer.appendChild(doneText);

        saveImage(canvas.toDataURL("image/jpeg", 0.5), file.name); // Save the resized image
      };

      document.getElementById("progress-container").style.display = "none";
    };
    reader.readAsDataURL(file);
  }
}

function saveImage(dataUrl, fileName) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = fileName;
  a.click();
}

// JavaScript
const customRadio = document.getElementById("custom");
const customSizeContainer = document.getElementById("customSizeContainer");
const otherRadios = document.querySelectorAll(
  'input[type="radio"]:not(#custom)'
);

customRadio.addEventListener("change", function () {
  if (this.checked) {
    customSizeContainer.style.display = "block";
  } else {
    customSizeContainer.style.display = "none";
  }
});

otherRadios.forEach(function (radio) {
  radio.addEventListener("change", function () {
    customSizeContainer.style.display = "none";
  });
});
