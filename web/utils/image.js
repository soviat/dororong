// Image utilities: compress image with <canvas>
export async function compressImage(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = {}) {
  if (!(file instanceof Blob)) throw new Error("compressImage: file must be a Blob/File");
  const img = await createImageBitmap(file);
  const { width, height } = fitContain(img.width, img.height, maxWidth, maxHeight);
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  const blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
}

function fitContain(srcW, srcH, maxW, maxH){
  const scale = Math.min(maxW / srcW, maxH / srcH, 1);
  return { width: Math.round(srcW * scale), height: Math.round(srcH * scale) };
}