self.onmessage = async function (e) {
  const { file, size, quality, customWidth, customHeight } = e.data;

  // Validierung
  if (!file || !(file instanceof Blob)) {
    self.postMessage({ error: "No valid file received" });
    return;
  }

  try {
    // Bild als Bitmap laden
    const bitmap = await createImageBitmap(file);
    let newWidth, newHeight;
    const aspectRatio = bitmap.width / bitmap.height;

    // Zielgröße berechnen
    if (size === "custom" && customWidth && customHeight) {
      if (customWidth / customHeight > aspectRatio) {
        newWidth = customHeight * aspectRatio;
        newHeight = customHeight;
      } else {
        newHeight = customWidth / aspectRatio;
        newWidth = customWidth;
      }
    } else {
      let targetSize;
      switch (size) {
        case "small": targetSize = 854; break;
        case "medium": targetSize = 1366; break;
        case "large": targetSize = 1920; break;
        case "xlarge": targetSize = 2560; break;
        case "mobile": targetSize = 320; break;
        default: targetSize = Math.max(bitmap.width, bitmap.height); break;
      }

      if (bitmap.width > bitmap.height) {
        newWidth = targetSize;
        newHeight = Math.round(targetSize / aspectRatio);
      } else {
        newHeight = targetSize;
        newWidth = Math.round(targetSize * aspectRatio);
      }
    }

    // OffscreenCanvas für Resize
    const offscreen = new OffscreenCanvas(newWidth, newHeight);
    const ctx = offscreen.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);

    // JPEG-Blob erzeugen
    const blob = await offscreen.convertToBlob({ type: "image/jpeg", quality });

    // Ergebnis zurück an main thread
    self.postMessage({
      originalName: file.name,
      blob,
      newWidth,
      newHeight,
      originalSize: file.size
    });

  } catch (err) {
    self.postMessage({ error: err.message, fileName: file.name });
  }
};