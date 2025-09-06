"use client";

import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import GamePanel from "./components/GamePanel";
import Header from "./components/Header";
import ja from "./dictionaries/ja";
import styles from "./page.module.css";
import {
	createInitialChCookie,
	createInitialCookie,
	getCookie,
	isValidChCookie,
	isValidCookie,
	parseCookie,
	parseCookieForCh,
	setCookie,
} from "./utils/cookie";
import myFont from "./utils/font";
import { imageIdToUrl, urlToImageId } from "./utils/image";

export default function Home() {
	const dictionary = ja;
	const defaultTitle = dictionary.main.defaultTitle;
	const [title, setTitle] = useState(defaultTitle);
	const [chList, setChList] = useState<boolean[]>([]);
	const [isCapturing, setIsCapturing] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
	const [progress, setProgress] = useState<Record<string, string>>({});
	const popoverRef = useRef<HTMLDivElement>(null);

	const showPopover = () => {
		const popover = popoverRef.current;

		if (popover && typeof popover.showPopover === "function") {
			popover.showPopover();
		}

		return () => {
			if (popover && typeof popover.hidePopover === "function") {
				popover.hidePopover();
			}
		};
	};

	useEffect(() => {
		const cookie = getCookie("vnm-progress");

		if (!cookie || !isValidCookie(cookie)) {
			const cookieValue = createInitialCookie();
			setCookie("vnm-progress", cookieValue);
			//progress = parseCookie(cookieValue);
			setProgress(parseCookie(cookieValue));
		} else {
			const parsedCookie = parseCookie(cookie);
			//progress = parsedCookie;
			setProgress(parsedCookie);
		}

		const titleCookie = decodeURIComponent(getCookie("vnm-title"));
		if (titleCookie) {
			setTitle(titleCookie);
		}

		const chCookie = getCookie("vnm-ch");

		if (!chCookie || !isValidChCookie(chCookie)) {
			const chCookieValue = createInitialChCookie();
			setCookie("vnm-ch", chCookieValue);
			setChList(parseCookieForCh(chCookieValue));
			showPopover();
			//isCharacter = parseCookieForCh(chCookieValue);
		} else {
			setChList(parseCookieForCh(chCookie));
			//isCharacter = parseCookieForCh(chCookie);
		}
	}, []);
	const titles = Object.keys(progress);
	//const titles = dictionary.main.defaultTexts;
	const vnIds = Object.values(progress);

	const coverImages = vnIds.map((vnId: string, index: number) => {
		//const isCharacter = index === 5 || index === 13 || index === 14;
		const isCharacter = chList[index];
		return vnId !== "" ? imageIdToUrl(vnId, isCharacter) : "";
	});

	const countNumberOfImagesInWrapper = () => {
		if (!wrapperRef.current) return 0;
		return wrapperRef.current.querySelectorAll("img").length;
	};

	const handleInitializeButton = () => {
		const res = window.confirm(dictionary.main.initializeConfirmation);
		if (!res) return;
		const cookieValue = createInitialCookie();
		setCookie("vnm-progress", cookieValue);
		setProgress(parseCookie(cookieValue));
		const titleCookie = decodeURIComponent(dictionary.main.defaultTitle);
		setTitle(titleCookie);
		setCookie("vnm-title", encodeURIComponent(titleCookie));
		const chCookieValue = createInitialChCookie();
		setCookie("vnm-ch", chCookieValue);
		setChList(parseCookieForCh(chCookieValue));
		location.reload();
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
		setCookie("vnm-title", encodeURIComponent(e.target.value));
	};

	const handleChChange = (index: number) => {
		const newChList = [...chList];
		newChList[index] = !newChList[index];
		setChList(newChList);
		setCookie("vnm-ch", encodeURIComponent(JSON.stringify(newChList)));
	};

	const handleGamePanelChange = (
		index: number,
		title: string,
		url: string | null,
	) => {
		const vnId = url ? urlToImageId(url) : "";
		const cookieProgress = parseCookie(getCookie("vnm-progress"));
		const progressKeys = Object.keys(cookieProgress);
		const progressValues = Object.values(cookieProgress);
		progressKeys[index] = title;
		progressValues[index] = vnId;

		const newProgress: Record<string, string> = {};
		progressKeys.forEach((key, index) => {
			newProgress[key] = progressValues[index];
		});
		setCookie("vnm-progress", encodeURIComponent(JSON.stringify(newProgress)));
	};

	const getScreenshot = async () => {
		if (!wrapperRef.current) return;

		if (countNumberOfImagesInWrapper() < 9) {
			const result = window.confirm(dictionary.main.confirmation);
			if (!result) return;
		}

		try {
			setIsCapturing(true);
			setScreenshotUrl(null);
			await new Promise((resolve) => setTimeout(resolve, 0));

			const pixelRatio = window.devicePixelRatio;

			const canvas = await html2canvas(wrapperRef.current, {
				scale: pixelRatio,
				useCORS: true,
				allowTaint: true,
				logging: false,
				imageTimeout: 0,
				width: wrapperRef.current.offsetWidth,
				height: wrapperRef.current.offsetHeight,
			});

			const offscreen = new OffscreenCanvas(canvas.width, canvas.height);

			const ctx = offscreen.getContext("2d", {
				alpha: true,
				antialias: false,
				desynchronized: true,
			});

			if (!ctx) {
				throw new Error("Failed to get OffscreenCanvas context");
			}

			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(canvas, 0, 0);

			const blob = await offscreen.convertToBlob({
				type: "image/png",
				quality: 2.0,
			});

			navigator.clipboard.write([
				new ClipboardItem({
					"image/png": blob,
				}),
			]);

			const dataUrl = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = dataUrl;
			a.download = "screenshot.png";
			//a.click();
			setScreenshotUrl(dataUrl);

			setIsCapturing(false);
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);

			setTimeout(() => URL.revokeObjectURL(dataUrl), 100);
		} catch (error) {
			console.error("Screenshot failed:", error);
			setIsCapturing(false);
		}
	};

	return (
		<div className={myFont.className}>
			<div ref={popoverRef} popover="auto" className={styles.usagePopover}>
				<h2>機能更新のおしらせ (2025/02/28)</h2>
				<ul>
					<li>
						「エロゲMEME」のタイトルと各パネルのテキストを自由に編集できるようになりました！(文字数制限あり)
					</li>
					<li>
						また、各パネルでゲームを選択するか、キャラクターを選択するかをユーザーが決められるようになりました！
					</li>
					<li>
						これらの新機能を使って、あなただけのエロゲMEMEを作りましょう！
					</li>
				</ul>
				<p>メッセージウィンドウの外をクリックして閉じてください</p>
			</div>
			<Header />
			<div
				ref={wrapperRef}
				className={styles.wrapper}
				style={{ transform: "translateZ(0)" }}
			>
				{isCapturing ? (
					<div className={`${styles.titleInput} min-h-[24px]`}>{title}</div>
				) : (
					<input
						ref={inputRef}
						type="text"
						value={title}
						onChange={handleTitleChange}
						className={styles.titleInput}
					/>
				)}
				<div className={styles.gridContainer}>
					{titles.map((title, index) => (
						<GamePanel
							key={title + index.toString()}
							index={index}
							initialText={title}
							initialUrl={coverImages[index]}
							isCapturing={isCapturing}
							updateFunction={handleGamePanelChange}
							isCharacter={chList[index]}
							updateChFunction={handleChChange}
						/>
					))}
				</div>
			</div>
			<div className={styles.screenshotButtonWrapper}>
				<button
					type="button"
					className={styles.screenshotButton}
					onClick={getScreenshot}
				>
					{dictionary.main.takeScreenshot}
				</button>
				<button
					type="button"
					className={styles.initializeButton}
					onClick={handleInitializeButton}
				>
					{dictionary.main.initialize}
				</button>
			</div>
			<div className={styles.previewSection}>
				{screenshotUrl && (
					<div className={styles.screenshotPreview}>
						<h3>{dictionary.main.preview}</h3>
						<img src={screenshotUrl} alt="Screenshot preview" />
					</div>
				)}
				{isCapturing && <div>{dictionary.main.loading}</div>}
				{!screenshotUrl && !isCapturing && (
					<div className="">{dictionary.main.noPreview}</div>
				)}
			</div>
		</div>
	);
}
