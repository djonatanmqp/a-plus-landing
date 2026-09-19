const MAX_FILES_PER_SUBMISSION = 4;
const TARGET_BYTES_PER_IMAGE = 900 * 1024;
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 1600;
let logoPromise: Promise<HTMLImageElement | null> | undefined;

async function compressImage(file: File, targetBytes: number, addWatermark: boolean): Promise<File> {
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

  const logo = addWatermark ? await loadWatermarkLogo() : null;
  if (logo) {
    const watermarkWidth = canvas.width * 0.3;
    const watermarkHeight = watermarkWidth * (logo.naturalHeight / logo.naturalWidth);
    context.save();
    context.globalAlpha = 0.16;
    context.globalCompositeOperation = "multiply";
    context.drawImage(
      logo,
      (canvas.width - watermarkWidth) / 2,
      (canvas.height - watermarkHeight) / 2,
      watermarkWidth,
      watermarkHeight,
    );
    context.restore();
  }

  let quality = 0.82;
  let blob = await canvasToWebp(canvas, quality);
  while (blob.size > targetBytes && quality > 0.45) {
    quality -= 0.08;
    blob = await canvasToWebp(canvas, quality);
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}.webp`, {
    type: "image/webp",
    lastModified: Date.now(),
  });
}

function loadWatermarkLogo(): Promise<HTMLImageElement | null> {
  if (!logoPromise) {
    logoPromise = new Promise((resolve) => {
      const logo = new Image();
      logo.onload = () => resolve(logo);
      logo.onerror = () => resolve(null);
      logo.src = "/logo.png";
    });
  }
  return logoPromise;
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
    const warningElement = input.form?.querySelector<HTMLElement>("[data-image-limit-warning]");

    const showWarning = (message: string) => {
      if (warningElement) {
        warningElement.textContent = message;
        warningElement.classList.remove("hidden");
      }
    };

    const clearWarning = () => warningElement?.classList.add("hidden");

    input.addEventListener("change", async () => {
      if (!input.files?.length) return;

      const originalFiles = Array.from(input.files);
      const fileNameElement = input
        .closest("div.rounded-xl")
        ?.querySelector<HTMLElement>(".file-name-display");
      if (fileNameElement) fileNameElement.textContent = "Compressing image...";
      input.disabled = true;

      try {
        if (originalFiles.length > MAX_FILES_PER_SUBMISSION) {
          throw new Error(`Select up to ${MAX_FILES_PER_SUBMISSION} images per upload`);
        }

        clearWarning();
        const addWatermark = input.name !== "main_image_file";
        const compressedFiles = await Promise.all(
          originalFiles.map((file) => compressImage(file, TARGET_BYTES_PER_IMAGE, addWatermark)),
        );
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
        showWarning(error instanceof Error ? error.message : "Could not process image");
        if (fileNameElement) {
          fileNameElement.textContent = error instanceof Error
            ? error.message
            : "Could not process image";
        }
      } finally {
        input.disabled = false;
      }
    });

    input.form?.addEventListener("submit", (event) => {
      if (input.files && input.files.length > MAX_FILES_PER_SUBMISSION) {
        event.preventDefault();
        showWarning(`Select up to ${MAX_FILES_PER_SUBMISSION} images per upload`);
      }
    });
  });
}
