const MAX_OUTPUT_BYTES = 3 * 1024 * 1024;
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width, MAX_HEIGHT / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("Unable to prepare image compression");
  }

  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let quality = 0.82;
  let blob = await canvasToWebp(canvas, quality);
  while (blob.size > MAX_OUTPUT_BYTES && quality > 0.45) {
    quality -= 0.08;
    blob = await canvasToWebp(canvas, quality);
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

function canvasToWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Unable to convert image to WebP"));
    }, "image/webp", quality);
  });
}

export function setupAdminImageCompression(): void {
  document.querySelectorAll<HTMLInputElement>(".file-input").forEach((input) => {
    input.addEventListener("change", async () => {
      if (!input.files?.length) return;

      const originalFiles = Array.from(input.files);
      const fileNameElement = input
        .closest("div.rounded-xl")
        ?.querySelector<HTMLElement>(".file-name-display");
      if (fileNameElement) fileNameElement.textContent = "Compressing image...";
      input.disabled = true;

      try {
        const compressedFiles = await Promise.all(originalFiles.map(compressImage));
        const transfer = new DataTransfer();
        compressedFiles.forEach((file) => transfer.items.add(file));
        input.files = transfer.files;

        if (fileNameElement) {
          fileNameElement.textContent = compressedFiles.length > 1
            ? `${compressedFiles.length} images ready`
            : `${compressedFiles[0].name} ready`;
          fileNameElement.classList.add("text-emerald-700", "font-medium");
        }
      } catch (error) {
        console.error("Image compression failed:", error);
        input.value = "";
        if (fileNameElement) fileNameElement.textContent = "Could not process image";
      } finally {
        input.disabled = false;
      }
    });
  });
}
