import { useEffect, useRef, useState } from "react";
import charData from "../data/char_image.json";
import vnData from "../data/title_image.json";
import { imageIdToUrl } from "../utils/image";
import { sliceObject } from "../utils/object";
import styles from "./SearchForm.module.css";

interface SearchFormProps {
	index: number;
	onImageSelect: (imageUrl: string, title: string) => void;
	onClose: () => void;
	isCharacter: boolean;
	hasImage: boolean;
	updateChFunction: (index: number) => void;
}

export default function SearchForm({
	index,
	onImageSelect,
	onClose,
	isCharacter,
	hasImage,
	updateChFunction,
}: SearchFormProps) {
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isChar, setIsChar] = useState(isCharacter);

	// Refs for focus trap
	const modalRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	// Store all focusable elements
	const [focusableElements, setFocusableElements] = useState<HTMLElement[]>([]);

	const getCurrentDict = () => {
		return isChar
			? (charData as Record<string, string>)
			: (vnData as Record<string, string>);
	};

	const [shownVns, setShownVns] = useState(
		sliceObject(getCurrentDict(), 0, 10),
	);

	// Set up focusable elements when the modal is rendered or content changes
	useEffect(() => {
		if (modalRef.current && !isLoading) {
			// Get all focusable elements within the modal
			const focusableElementsInModal = Array.from(
				modalRef.current.querySelectorAll(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
				),
			) as HTMLElement[];

			setFocusableElements(focusableElementsInModal);

			// Focus the search input when modal opens
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}
	}, [isLoading, shownVns, isChar]);

	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !isLoading) {
				onClose();
			}
		};

		const handleTab = (event: KeyboardEvent) => {
			// Only handle tab if we have focusable elements and the modal is open
			if (event.key === "Tab" && focusableElements.length > 0) {
				const firstElement = focusableElements[0];
				const lastElement = focusableElements[focusableElements.length - 1];

				// If shift+tab on first element, move to last element
				if (event.shiftKey && document.activeElement === firstElement) {
					event.preventDefault();
					lastElement.focus();
				}
				// If tab on last element, move to first element
				else if (!event.shiftKey && document.activeElement === lastElement) {
					event.preventDefault();
					firstElement.focus();
				}
			}
		};

		window.addEventListener("keydown", handleEsc);
		window.addEventListener("keydown", handleTab);

		document.body.style.overflow = "hidden";
		window.scrollTo(0, 0);

		// Save the previously focused element to restore focus when closing
		const previouslyFocused = document.activeElement as HTMLElement;

		return () => {
			window.removeEventListener("keydown", handleEsc);
			window.removeEventListener("keydown", handleTab);
			document.body.style.overflow = "auto";

			// Restore focus when component unmounts
			if (previouslyFocused.focus) {
				previouslyFocused.focus();
			}
		};
	}, [onClose, isLoading, focusableElements]);

	useEffect(() => {
		search(inputValue);
	}, [isChar]);

	const handleModalClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget && !isLoading) {
			onClose();
		}
	};

	const search = (inputValue: string) => {
		const dict = getCurrentDict();

		if (inputValue === "") {
			setShownVns(sliceObject(dict, 0, 10));
			return;
		}
		const searchedVns = Object.keys(dict).filter((title) =>
			title.toLowerCase().includes(inputValue.toLowerCase()),
		);
		const searchedVnsDict: { [key: string]: string } = {};
		for (const title of searchedVns) {
			searchedVnsDict[title] = dict[title];
		}
		setShownVns(sliceObject(searchedVnsDict, 0, 10));
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		search(e.target.value);
	};

	const handleTitleClick = async (title: string, isCharacter: boolean) => {
		setIsLoading(true);
		const dict = getCurrentDict();
		const imageId = dict[title];
		const url = imageIdToUrl(imageId, isCharacter);

		try {
			const proxyUrl = `/api/proxy?url=${url}`;
			onImageSelect(proxyUrl, title);
			onClose();
		} catch (e) {
			setIsLoading(false);
			throw new Error("Failed to fetch image");
		}
	};

	return (
		<div
			className={styles.modal}
			onClick={handleModalClick}
			onKeyDown={() => handleModalClick}
			role="dialog"
			aria-modal="true"
			aria-labelledby="search-form-title"
		>
			<div className={styles.modalContent} ref={modalRef}>
				{!isLoading && (
					<button
						type="button"
						onClick={onClose}
						className={styles.closeButton}
						ref={closeButtonRef}
						aria-label="閉じる"
					>
						×
					</button>
				)}

				{!isLoading ? (
					<>
						<div>
							<input
								type="text"
								value={inputValue}
								onChange={handleInputChange}
								className={styles.searchInput}
								placeholder={isChar ? "キャラ名で検索" : "タイトルを検索"}
								ref={inputRef}
							/>
							<div>
								{hasImage && (
									<button
										type="button"
										className={styles.deleteButton}
										onClick={() => {
											onClose();
											onImageSelect("", "");
										}}
									>
										削除
									</button>
								)}
								{!hasImage && (
									<button
										type="button"
										className={styles.deleteButton}
										disabled
									>
										削除
									</button>
								)}
								<button
									type="button"
									className={styles.switchButton}
									onClick={() => {
										setIsChar(!isChar);
										updateChFunction(index);
									}}
								>
									{isChar ? "ゲームに切り替え" : "キャラに切り替え"}
								</button>
							</div>
						</div>
						<div className={styles.results}>
							{Object.keys(shownVns).map((title) => (
								<div key={title} className={styles.titleItem}>
									<p
										tabIndex={0}
										onClick={() => handleTitleClick(title, isChar)}
										onKeyDown={(e) =>
											e.key === "Enter" && handleTitleClick(title, isChar)
										}
										role="button"
										aria-label={`${title}を選択`}
									>
										{title}
									</p>
								</div>
							))}
							{Object.keys(shownVns).length === 0 && (
								<div className={styles.placeholder}>Not Found </div>
							)}
						</div>
					</>
				) : (
					<div className={styles.loadingContainer}>
						<p>画像を読み込み中...</p>
					</div>
				)}
			</div>
		</div>
	);
}
