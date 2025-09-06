import html2canvas, { type Options } from "html2canvas";
import { useState } from "react";

interface ScreenshotConfig {
	type?: string;
	quality?: number;
}

type HookReturn = [
	string | null,
	(node: HTMLElement, options?: Partial<Options>) => Promise<string>,
	{
		error: Error | null;
	},
];

/**
 * Hook for creating screenshot from html node
 * @param config - Configuration options for the screenshot
 * @returns [image, takeScreenShot, { error }]
 */
const useScreenshot = (config: ScreenshotConfig = {}): HookReturn => {
	const [image, setImage] = useState<string | null>(null);
	const [error, setError] = useState<Error | null>(null);

	/**
	 * Convert html node to image
	 * @param node - Target HTML element to capture
	 * @param options - html2canvas options
	 * @returns Promise with base64 image string
	 */
	const takeScreenShot = async (
		node: HTMLElement,
		options: Partial<Options> = {
			scrollX: 0,
			scrollY: 0,
			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight,
		},
	): Promise<string> => {
		if (!node) {
			throw new Error("You should provide correct html node.");
		}

		try {
			const canvas = await html2canvas(node, options);
			const croppedCanvas = document.createElement("canvas");
			const croppedCanvasContext = croppedCanvas.getContext("2d");

			if (!croppedCanvasContext) {
				throw new Error("Failed to get canvas context");
			}

			// init data
			const cropPositionTop = 0;
			const cropPositionLeft = 0;
			const cropWidth = canvas.width;
			const cropHeight = canvas.height;

			croppedCanvas.width = cropWidth;
			croppedCanvas.height = cropHeight;

			croppedCanvasContext.drawImage(canvas, cropPositionLeft, cropPositionTop);

			const base64Image = croppedCanvas.toDataURL(config.type, config.quality);
			setImage(base64Image);
			return base64Image;
		} catch (err) {
			setError(err instanceof Error ? err : new Error("Screenshot failed"));
			throw err;
		}
	};

	return [
		image,
		takeScreenShot,
		{
			error,
		},
	];
};

/**
 * Creates name of file
 * @param extension - File extension
 * @param names - Parts of file name
 * @returns Formatted file name with extension
 */
const createFileName = (extension = "", ...names: string[]): string => {
	if (!extension) {
		return "";
	}
	return `${names.join("")}.${extension}`;
};

export { useScreenshot, createFileName };
export type { ScreenshotConfig };
