"use client";
import Header from "../components/Header";
import ja from "../dictionaries/ja";
import lastUpdate from "../dictionaries/lastUpdate.json";
import styles from "./page.module.css";

const TWITTER_LINK = "https://x.com/Te3p4V";

export default function AboutPage() {
	const t = ja;
	return (
		<div>
			<Header />
			<div className={styles.wrapper}>
				<section>
					<h1>{t.about.title}</h1>
					<p>{t.about.description1}</p>
					<p>{t.about.description2}</p>
					<p>{t.about.description3}</p>
					<p>{lastUpdate.lastUpdate}</p>
				</section>
				<section>
					<h2>{t.about.usageHeader}</h2>
					<ol className={styles.usage}>
						<li>{t.about.usage2}</li>
						<li>{t.about.usage3}</li>
						<li>{t.about.usage4}</li>
						<li>{t.about.usage5}</li>
					</ol>
				</section>
				<section>
					<h2>{t.about.miscHeader}</h2>
					<p>
						{t.about.misc1}
						<a
							className={styles.contactLink}
							href={TWITTER_LINK}
							target="_blank"
							rel="noreferrer"
						>
							Teepa
						</a>
					</p>
					<p>{t.about.misc2}</p>
				</section>
			</div>
		</div>
	);
}
