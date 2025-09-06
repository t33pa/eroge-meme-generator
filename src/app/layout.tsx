import "./global.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import type { Viewport } from "next";
import myFont from "./utils/font";

export const metadata: Metadata = {
	title: "エロゲ MEME メーカー",
	description: "エロゲ MEME を作るためのツール",
	openGraph: {
		title: "エロゲ MEME メーカー",
		description: "エロゲ MEME を作るためのツール",
		type: "website",
		locale: "ja_JP",
		images: ["https://eroge-meme.vercel.app/ogp.png"],
	},
};

export const viewport: Viewport = {
	themeColor: "#ff88e1",
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body>{children}</body>
			<Analytics />
		</html>
	);
}
