import ja from "../dictionaries/ja";

export const createInitialCookie = () => {
	const defaultTexts = ja.main.defaultTexts;
	const cookieObj: Record<string, string> = {};
	for (const text of defaultTexts) {
		cookieObj[text] = "";
	}
	return encodeURIComponent(JSON.stringify(cookieObj));
};

export const createInitialChCookie = () => {
	const cookieObj: boolean[] = [];
	for (let i = 0; i < 24; i++) {
		cookieObj.push(false);
	}
	cookieObj[5] = true;
	cookieObj[13] = true;
	cookieObj[14] = true;
	return encodeURIComponent(JSON.stringify(cookieObj));
};

export const createCookieFromProgress = (progress: Record<string, string>) => {
	return encodeURIComponent(JSON.stringify(progress));
};

export const getCookie = (key: string) => {
	const cookie = document.cookie
		.split("; ")
		.find((row) => row.startsWith(`${key}=`));
	if (!cookie) return "";
	return cookie.split("=")[1];
};

export const parseCookie = (cookie: string): Record<string, string> => {
	return JSON.parse(decodeURIComponent(cookie));
};

export const parseCookieForCh = (cookie: string): boolean[] => {
	return JSON.parse(decodeURIComponent(cookie));
};

export const isValidChCookie = (cookie: string) => {
	const parsedCookie = parseCookieForCh(cookie);
	return parsedCookie.length === 24;
};

export const setCookie = (key: string, value: string) => {
	const date = new Date();
	// Expires in 30 days
	date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
	const expires = date.toUTCString();
	document.cookie = `${key}=${value}; expires=${expires}; secure`;
};

export const isValidCookie = (cookie: string) => {
	const parsedCookie = parseCookie(cookie);
	const keys = Object.keys(parsedCookie);
	const values = Object.values(parsedCookie);
	return keys.length === 24 && values.length === 24;
};
