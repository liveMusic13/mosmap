import { cookies } from 'next/headers';

import Home from '@/components/screens/home/Home';

import { mapService } from '@/services/map.service';

export const revalidate = 200;

export async function generateMetadata() {
	//HELP: Доступ к параметрам из cookies
	const cookieStore = cookies();
	// const mapParam = (await cookieStore).get('map')?.value || '7';
	const mapParam = (await cookieStore).get('map')?.value || null;

	//HELP: Получение данных
	const { data: dataMap } = await mapService.getObjectISR(mapParam);

	//HELP: Возвращаем метаданные
	return {
		title: dataMap.title || 'Придумать заголовок интерфейса',
		description: dataMap.description || 'Придумать описание интерфейса',
	};
}

export default function HomePage() {
	return <Home />;
}
