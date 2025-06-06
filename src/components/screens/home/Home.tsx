import { cookies, headers } from 'next/headers';
import { FC } from 'react';

import Content from '@/components/content/Content';
import ContentISR from '@/components/contentISR/ContentISR';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';

import { API_URL } from '@/app.constants';
import NotFound from '@/app/not-found/page';
import { mapService } from '@/services/map.service';

async function getServerSidePath() {
	const res = await fetch(`${API_URL}/api/path`, {
		headers: {
			cookie: (await headers()).get('cookie') || '',
		},
	});
}

export const revalidate = 200;

const Home: FC = async () => {
	//HELP: Доступ к параметрам search через headers или cookies
	const cookieStore = cookies();
	const mapParam = (await cookieStore).get('map')?.value || null;

	//HELP: Получение данных на сервере
	const { data: dataMap, status } = await mapService.getObjectISR(mapParam);
	const { data: dataFilter } = await mapService.getFiltersISR(mapParam);

	if (status > 400) {
		return NotFound(status);
	}

	return (
		<Layout>
			<Header />
			<Content dataMap={dataMap} />

			<ContentISR dataMap={dataMap} />
			{/* HELP: для SEO. Чтобы возвращало html с данными из бэка */}
			<h1 style={{ display: 'none' }}>{dataMap.title}</h1>
			{/* <h2>{mapParam}</h2> */}
			<Footer />
		</Layout>
	);
};

export default Home;
