import { NextRequest, NextResponse } from 'next/server';

export const GET = (request: NextRequest) => {
	//HELP: для того чтобы в серверном компоненте получить адресную строку и в зависимости от неё изменить стили в layout
	return NextResponse.json({ path: request.nextUrl.pathname });
};
