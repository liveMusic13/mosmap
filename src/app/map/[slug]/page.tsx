// import { Metadata } from 'next';
// import Home from '@/components/screens/home/Home';
// export const revalidate = 200;
// type PageProps = {
// 	params: { slug: string };
// 	searchParams?: { [key: string]: string | string[] | undefined };
// };
// // Небольшая helper-функция: если API умеет отдавать объект по ?url=slug
// async function fetchMapBySeo(seoSlug: string) {
// 	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/get_objects.php?url=${encodeURIComponent(seoSlug)}`;
// 	const res = await fetch(apiUrl, { method: 'GET', cache: 'no-store' });
// 	if (!res.ok) return null;
// 	return res.json(); // ожидание: { map: '7', title: '...', description: '...' } или подобное
// }
// export async function generateMetadata({
// 	params,
// }: PageProps): Promise<Metadata> {
// 	const slug = params.slug;
// 	const mapData = await fetchMapBySeo(slug);
// 	if (!mapData) {
// 		return {
// 			title: 'Придумать заголовок интерфейса',
// 			description: 'Придумать описание интерфейса',
// 		};
// 	}
// 	return {
// 		title: mapData.title || 'Придумать заголовок интерфейса',
// 		description: mapData.description || 'Придумать описание интерфейса',
// 	};
// }
// export default function HomePageCustomUrl() {
// 	return <Home />;
// }
import { Metadata } from 'next';

import Home from '@/components/screens/home/Home';

// export const revalidate = 200;
export const dynamic = 'force-dynamic';

// helper-функция
async function fetchMapBySeo(seoSlug: string) {
	const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/get_objects.php?url=${encodeURIComponent(seoSlug)}`;
	const res = await fetch(apiUrl, { method: 'GET', cache: 'no-store' });
	if (!res.ok) return null;
	return res.json();
}

// generateMetadata всегда принимает объект с params
export async function generateMetadata({ params }: any): Promise<Metadata> {
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

// сам компонент страницы
export default function HomePageCustomUrl({ params }: any) {
	return <Home />;
}
