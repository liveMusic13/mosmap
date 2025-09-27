import Home from '@/components/screens/home/Home';

export const revalidate = 200;

// export async function generateMetadata() {
// 	//HELP: Доступ к параметрам из cookies
// 	const cookieStore = cookies();
// 	const mapParam = (await cookieStore).get('map')?.value || '7';
// 	// const mapParam = (await cookieStore).get(ACTUAL_MAP)?.value || null;

// 	//HELP: Получение данных
// 	const { data: dataMap } = await mapService.getObjectISR(mapParam);

// 	//HELP: Возвращаем метаданные
// 	return {
// 		title: dataMap.title || 'Придумать заголовок интерфейса',
// 		description: dataMap.description || 'Придумать описание интерфейса',
// 	};
// }
type Props = {
	params: { slug: string };
	searchParams?: { [key: string]: string | string[] | undefined };
};

// Небольшая helper-функция: если API умеет отдавать объект по ?url=slug
async function fetchMapBySeo(seoSlug: string) {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/get_objects.php?url=${encodeURIComponent(seoSlug)}`;
	const res = await fetch(apiUrl, { method: 'GET', cache: 'no-store' });
	if (!res.ok) return null;
	return res.json(); // ожидание: { map: '7', title: '...', description: '...' } или подобное
}

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}) {
	const slug = params.slug;
	const mapData = await fetchMapBySeo(slug);

	if (!mapData) {
		return {
			title: 'Придумать заголовок интерфейса',
			description: 'Придумать описание интерфейса',
		};
	}

	return {
		title: mapData.title || 'Придумать заголовок интерфейса',
		description: mapData.description || 'Придумать описание интерфейса',
	};
}

export default function HomePageCustomUrl() {
	return <Home />;
}
