export const sliceObject = (
	obj: Record<string, string>,
	start: number,
	end?: number,
): Record<string, string> => {
	return Object.fromEntries(Object.entries(obj).slice(start, end));
};
