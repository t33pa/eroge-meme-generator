import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const imageUrl = searchParams.get("url");

	if (!imageUrl) {
		return new NextResponse("Image URL is required", { status: 400 });
	}

	try {
		const response = await fetch(imageUrl);
		const imageBlob = await response.blob();

		return new NextResponse(imageBlob, {
			headers: {
				"Content-Type": response.headers.get("Content-Type") || "image/jpeg",
				"Cache-Control": "public, max-age=31536000",
			},
		});
	} catch (error) {
		return new NextResponse("Failed to fetch image", { status: 500 });
	}
}
