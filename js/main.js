// main.js

const queue = [];
let processing = false;
let zip = new JSZip();
let renameIndex = 1;

// Show disclaimer once per session
if (!sessionStorage.getItem("disclaimerShown")) {
  alert(
    "⚠️ Disclaimer: Dixel is not responsible for any lost or corrupted files.\n\n" +
    "By using this app, you accept that images may be altered.\n\n" +
    "JSZip (MIT License) is used for ZIP downloads."
  );
  sessionStorage.setItem("disclaimerShown", "true");
}

// Escape HTML to avoid injection
function escapeHTML(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m];
  });
}

// Rename file based on user input
function renameFile(file) {
  const baseName = document.getElementById("newFileName").value.trim();
  if (!baseName) return file;

  // Extract extension from original file
  const ext = file.name.split(".").pop();
  const newName = `${baseName}${renameIndex}.${ext}`;
  renameIndex++;
  
  // Create new File object with renamed file
  return new File([file], newName, { type: file.type });
}

// Add file to queue
function addToQueue(file) {
  queue.push(file);
  if (!processing) processQueue();
}

// Process queue in chunks
async function processQueue() {
  processing = true;

  const size = document.querySelector('input[name="size"]:checked').value;
  const quality = parseFloat(document.getElementById("qualitySlider").value);
  const customWidth = parseInt(document.getElementById("width").value) || null;
  const customHeight = parseInt(document.getElementById("height").value) || null;

  while (queue.length > 0) {
    const chunk = queue.splice(0, 20); // process 20 files at a time
    await Promise.all(
      chunk.map(file => processFile(file, size, quality, customWidth, customHeight))
    );
  }

  processing = false;
  await downloadZip();
  resetProgress();
}

// Process single file in worker
function processFile(file, size, quality, customWidth, customHeight) {
  return new Promise(resolve => {
    const worker = new Worker("./js/worker.js");
    worker.postMessage({ file, size, quality, customWidth, customHeight });

    worker.onmessage = (e) => {
      const { blob, newWidth, newHeight, originalName, originalSize, error } = e.data;

      if (error) {
        console.error(`Error processing ${originalName}:`, error);
        worker.terminate();
        resolve();
        return;
      }

      // Update table
      const tableRow = document.createElement("tr");
      const newSizeKB = (blob.size / 1024).toFixed(2);
      const compressionRatio = ((1 - newSizeKB / (originalSize / 1024)) * 100).toFixed(2);

      tableRow.innerHTML = `
        <td>${escapeHTML(originalName)}</td>
        <td>${escapeHTML(size)}</td>
        <td>${escapeHTML(newWidth)}</td>
        <td>${escapeHTML(newHeight)}</td>
        <td>${(originalSize / 1024).toFixed(2)}</td>
        <td>${newSizeKB}</td>
        <td>${compressionRatio}%</td>
      `;
      document.querySelector("#image-table tbody").appendChild(tableRow);

      // Add file to ZIP
      zip.file(originalName, blob);

      updateProgress();
      worker.terminate();
      resolve();
    };
  });
}

// Update progress bar
function updateProgress() {
  const progressBar = document.getElementById("progress-bar");
  const processed = document.querySelectorAll("#image-table tbody tr").length;
  const total = processed + queue.length;
  const percent = total ? Math.round((processed / total) * 100) : 100;
  progressBar.style.width = percent + "%";
  document.getElementById("progress-container").style.display = "block";
}

// Reset progress
function resetProgress() {
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = "0%";
  document.getElementById("progress-container").style.display = "none";
  renameIndex = 1;
}

// Download ZIP
async function downloadZip() {
  const content = await zip.generateAsync({ type: "blob" });
  const link = document.getElementById("downloadLink");
  link.href = URL.createObjectURL(content);
  link.download = "resized_images.zip";
  link.click();
  URL.revokeObjectURL(link.href);
}

// Handle file input / drop
function handleFiles(files) {
  if (!files || files.length === 0) return;

  // Limit max files
  if (files.length > 100) {
    alert("Warning: Only the first 100 files will be processed.");
    files = Array.from(files).slice(0, 101);
  }

  // Clear queue automatically before adding new files
  queue.length = 0;
  zip = new JSZip();
  document.querySelector("#image-table tbody").innerHTML = "";
  resetProgress();

  const selectedSize = document.querySelector('input[name="size"]:checked').value;
  let customWidth = null, customHeight = null;

  if (selectedSize === "custom") {
    customWidth = parseInt(document.getElementById("width").value);
    customHeight = parseInt(document.getElementById("height").value);
    if (isNaN(customWidth) || isNaN(customHeight) || customWidth <= 0 || customHeight <= 0) {
      alert("Invalid custom dimensions!");
      return;
    }
  }

  // Only PNG/JPG/JPEG
  const validFiles = Array.from(files).filter(file => {
    const type = file.type.toLowerCase();
    return type === "image/png" || type === "image/jpeg" || type === "image/jpg";
  });

  if (validFiles.length === 0) {
    alert("No valid images found (PNG, JPG, JPEG)!");
    return;
  }

  // Add to queue
  validFiles.forEach(file => {
    const renamedFile = renameFile(file);
    addToQueue(renamedFile);
  });
}

// DOM events
document.addEventListener("DOMContentLoaded", () => {

  // Clear queue button
  document.getElementById("clearQueue").addEventListener("click", () => {
    queue.length = 0;
    zip = new JSZip();
    document.querySelector("#image-table tbody").innerHTML = "";
    resetProgress();
  });

  // File select
  document.getElementById("fileSelect").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("fileElem").click();
  });

  document.getElementById("fileElem").addEventListener("change", function () {
    handleFiles(this.files);
  });

  // Show custom size inputs
  const sizeRadios = document.querySelectorAll('input[name="size"]');
  sizeRadios.forEach(radio => {
    radio.addEventListener("change", function () {
      document.getElementById("customSizeContainer").style.display =
        this.value === "custom" ? "block" : "none";
    });
  });
});