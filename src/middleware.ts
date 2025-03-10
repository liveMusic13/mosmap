import { NextRequest, NextResponse } from 'next/server';

//HELP: мидлвар для обновления номера карты в куках
export function middleware(req: NextRequest) {
	const url = req.nextUrl;
	const mapParam = url.searchParams.get('map') || null;

	const res = NextResponse.next();
	// res.cookies.set('map', mapParam || 'null');

	//HELP: Устанавливаем куку только если параметр есть
	if (mapParam) {
		res.cookies.set('map', mapParam);
	} else {
		//HELP: Удаляем куку если параметра нет
		res.cookies.delete('map');
	}

	return res;
}

export const config = {
	matcher: '/', // HELP: маршруты, для которых будет применяться middleware
};
