import "sharp";
//#region src/lib/image-optimizer.ts
function validateImage(file) {
	return [
		"image/jpeg",
		"image/png",
		"image/webp"
	].includes(file.type) && file.size <= 5242880;
}
//#endregion
export { validateImage as t };
