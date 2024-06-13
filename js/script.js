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

        // Calculate the size in KB
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.5);
        const imageData = atob(imageDataUrl.split(",")[1]);
        const imageSizeKB = (imageData.length / 1024).toFixed(2);

        // Calculate compression ratio based on original and new sizes
        const originalSizeKB = (file.size / 1024).toFixed(2);
        const compressionRatio = (
          (1 - imageSizeKB / originalSizeKB) *
          100
        ).toFixed(2);

        // Create a new table row with the image details
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
          <td>${file.name}</td>
          <td>${selectedSize}</td>
          <td>${newWidth}</td>
          <td>${newHeight}</td>
          <td>${originalSizeKB}</td>
          <td>${imageSizeKB}</td>
          <td>${compressionRatio}%</td>
        `;
        document.querySelector("#image-table tbody").appendChild(tableRow);

        saveImage(canvas.toDataURL("image/jpeg", 0.5), file.name); // Save the resized image
      };
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
