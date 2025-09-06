import { useRef, useState } from "react";
import styles from "./GamePanel.module.css";
import SearchForm from "./SearchForm";

interface GamePanelProps {
	index: number;
	initialText: string;
	initialUrl: string;
	isCapturing?: boolean;
	updateFunction: (index: number, title: string, vnId: string | null) => void;
	isCharacter: boolean;
	updateChFunction: (index: number) => void;
}

const MAX_CHARS = 120;

const getTextWidth = (text: string) => {
	let width = 0;

	for (let i = 0; i < text.length; i++) {
		const char = text.charAt(i);

		// half width ascii character and uppercase
		if (
			/[\u0000-\u007F]/.test(char) &&
			char.toUpperCase() === char &&
			char !== " "
		) {
			width += 6;
		}
		// half width ascii character and lowercase
		else if (/[\u0000-\u007F]/.test(char) && char.toLowerCase() === char) {
			width += 5;
		}
		// half width katakana
		else if (/[\uFF61-\uFF9F]/.test(char)) {
			width += 5;
		}
		// other characters (full width characters)
		else {
			width += 8.5;
		}
	}

	return width;
};

const ResizeableText = ({
	value,
	onChange,
	isCapturing,
}: {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	isCapturing?: boolean;
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (getTextWidth(e.target.value) > MAX_CHARS) {
			return;
		}
		onChange(e);
	};

	return (
		<div>
			{isCapturing ? (
				<div className={styles.descriptionInput}>{value}</div>
			) : (
				<>
					<textarea
						ref={textareaRef}
						value={value}
						onChange={handleChange}
						className={styles.descriptionInput}
						style={{ resize: "none" }}
						rows={2}
					/>
				</>
			)}
		</div>
	);
};

export default function GamePanel({
	index,
	initialText,
	initialUrl,
	isCapturing,
	updateFunction,
	isCharacter,
	updateChFunction,
}: GamePanelProps) {
	const [text, setText] = useState(initialText);
	const [imageUrl, setImageUrl] = useState<string | null>(
		initialUrl ? `/api/proxy?url=${initialUrl}` : null,
	);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isImageLoading, setIsImageLoading] = useState(false);
	const [hasImage, setHasImage] = useState(!!initialUrl);

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newText = e.target.value;
		setText(newText);
		updateFunction(index, newText, imageUrl);
	};

	const handleImageSelect = (url: string, title: string) => {
		if (url === "" && title === "") {
			setHasImage(false);
			setImageUrl(null);
			updateFunction(index, text, null);
			return;
		}
		setIsImageLoading(true);
		setImageUrl(url);
	};

	const handleImageLoad = () => {
		setIsImageLoading(false);
		updateFunction(index, text, imageUrl);
		setHasImage(true);
	};

	const handleImageError = () => {
		setIsImageLoading(false);
		setImageUrl(null);
	};

	return (
		<div className={styles.container}>
			<div
				className={styles.imageContainer}
				onClick={() => !isCapturing && setIsSearchOpen(true)}
				onKeyDown={(e) =>
					e.key === "Enter" && !isCapturing && setIsSearchOpen(true)
				}
				tabIndex={0}
				aria-label="Open search"
			>
				{imageUrl ? (
					<>
						<img
							src={imageUrl}
							alt=""
							className={`${styles.image} ${isImageLoading ? styles.hidden : ""}`}
							onLoad={handleImageLoad}
							onError={handleImageError}
						/>
						{isImageLoading && <div className={styles.loading}>Loading...</div>}
					</>
				) : (
					<div className={styles.placeholder}>{isCapturing ? "" : "Click"}</div>
				)}
			</div>
			<div className={styles.textareaContainer}>
				<ResizeableText
					value={text}
					onChange={handleTextChange}
					isCapturing={isCapturing}
				/>
			</div>
			{isSearchOpen && !isCapturing && (
				<SearchForm
					index={index}
					onImageSelect={handleImageSelect}
					onClose={() => setIsSearchOpen(false)}
					isCharacter={isCharacter}
					hasImage={hasImage}
					updateChFunction={updateChFunction}
				/>
			)}
		</div>
	);
}
