"use client";
import Link from "next/link";
import ja from "../dictionaries/ja";
import myFont from "../utils/font";
import styles from "./Header.module.css";

export default function Header() {
	const dictionary = ja;
	return (
		<header className={`${styles.header} ${myFont.className}`}>
			<nav>
				<Link href="/" className={styles.topLink}>
					{dictionary.header.home}
				</Link>
				<span className={styles.navLinks}>
					<Link href={"/about"} prefetch={false}>
						{dictionary.header.about}
					</Link>
				</span>
			</nav>
		</header>
	);
}
