import { NextRequest, NextResponse } from 'next/server';

import { TOKEN } from '@/app.constants';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const seoSlug = searchParams.get('url');

	if (!seoSlug) {
		return NextResponse.json(
			{ error: 'URL parameter is required' },
			{ status: 400 },
		);
	}

	try {
		const authToken = request.cookies.get(TOKEN)?.value;
		const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/get_objects.php?url=${seoSlug}`;

		const headers: HeadersInit = {
			'Content-Type': 'application/json',
		};

		if (authToken) {
			headers['Access-Token'] = authToken;
		}

		const response = await fetch(apiUrl, {
			method: 'GET',
			headers,
		});

		if (!response.ok) {
			return NextResponse.json(
				{ error: 'API request failed' },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json({ mapId: data.map || null });
	} catch (error) {
		console.error('Error fetching map ID by URL:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
