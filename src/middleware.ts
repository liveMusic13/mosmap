import { NextRequest, NextResponse } from 'next/server';

//HELP: мидлвар для обновления номера карты в куках
export function middleware(req: NextRequest) {
	const url = req.nextUrl;
	const mapParam = url.searchParams.get('map') || '7';

	const res = NextResponse.next();
	res.cookies.set('map', mapParam);

	return res;
}

export const config = {
	matcher: '/', // HELP: маршруты, для которых будет применяться middleware
};
