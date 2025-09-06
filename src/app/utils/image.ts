export const imageIdToUrl = (imageId: string, isCharacter: boolean) => {
	const lastTwoDigits = imageId.slice(-2);
	if (isCharacter) {
		return `https://t.vndb.org/ch/${lastTwoDigits}/${imageId.slice(2)}.jpg`;
	}
	return `https://t.vndb.org/cv/${lastTwoDigits}/${imageId.slice(2)}.jpg`;
};

export const urlToImageId = (url: string) => {
	if (!url) return "";
	const splitUrl = url.split("/");
	const last = splitUrl[splitUrl.length - 1];
	const imageId = last.slice(0, last.indexOf("."));
	return `cv${imageId}`;
};
