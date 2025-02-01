import { cookies } from 'next/headers';
import { FC } from 'react';

import Content from '@/components/content/Content';
import ContentISR from '@/components/contentISR/ContentISR';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';

import { mapService } from '@/services/map.service';

export const revalidate = 200;

const Home: FC = async () => {
	//HELP: Доступ к параметрам search через headers или cookies
	const cookieStore = cookies();
	const mapParam = (await cookieStore).get('map')?.value || '7';

	//HELP: Получение данных на сервере
	const { data: dataMap } = await mapService.getObjectISR(mapParam);

	return (
		<Layout>
			<Header dataMap={dataMap} />
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
