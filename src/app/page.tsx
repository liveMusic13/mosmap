import { cookies } from 'next/headers';

import Home from '@/components/screens/home/Home';

import { mapService } from '@/services/map.service';

export const revalidate = 200;

export async function generateMetadata() {
	// Доступ к параметрам из cookies
	const cookieStore = cookies();
	const mapParam = (await cookieStore).get('map')?.value || '7';

	// Получение данных
	const { data: dataMap } = await mapService.getObjectISR(mapParam);

	// Возвращаем метаданные
	return {
		title: dataMap.title || 'Default Title',
		description: dataMap.description || 'Default Description',
	};
}

export default function HomePage() {
	return <Home />;
}
