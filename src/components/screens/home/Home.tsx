import { cookies } from 'next/headers';
import { FC } from 'react';

import ContentISR from '@/components/contentISR/ContentISR';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';

import ClientWrapper from './ClientWrapper';
import { ACTUAL_MAP } from '@/app.constants';
import NotFound from '@/app/not-found/page';
import { mapService } from '@/services/map.service';

// export const revalidate = 200;
export const dynamic = 'force-dynamic';

const Home: FC = async () => {
	//HELP: Доступ к параметрам search через headers или cookies
	const cookieStore = cookies();
	// const mapParam = (await cookieStore).get('map')?.value || null;
	const mapParam = (await cookieStore).get(ACTUAL_MAP)?.value || null;

	//HELP: Получение данных на сервере
	const { data: dataMap, status } = await mapService.getObjectISR(mapParam);

	if (status > 400) {
		return NotFound(status);
	}

	return (
		<Layout>
			<Header />
			<ContentISR dataMap={dataMap} />

			<h1 style={{ display: 'none' }}>{dataMap.title}</h1>
			<ClientWrapper dataMap={dataMap} />

			<Footer />
		</Layout>
	);
};

export default Home;
// import { cookies } from 'next/headers';
// import { FC } from 'react';

// import ContentISR from '@/components/contentISR/ContentISR';
// import Footer from '@/components/footer/Footer';
// import Header from '@/components/header/Header';
// import Layout from '@/components/layout/Layout';

// import ClientWrapper from './ClientWrapper';
// import { ACTUAL_MAP } from '@/app.constants';
// import NotFound from '@/app/not-found/page';
// import { mapService } from '@/services/map.service';

// export const revalidate = 200;

// const Home: FC = async () => {
// 	//HELP: Доступ к параметрам search через headers или cookies
// 	const cookieStore = cookies();
// 	// const mapParam = (await cookieStore).get('map')?.value || null;
// 	const mapParam = (await cookieStore).get(ACTUAL_MAP)?.value || null;
// 	const test1 = (await cookieStore).get(ACTUAL_MAP);

// 	//HELP: Получение данных на сервере
// 	const { data: dataMap, status } = await mapService.getObjectISR(mapParam);
// 	const { data: dataFilter } = await mapService.getFiltersISR(mapParam);

// 	// console.log('test react', dataMap, mapParam, test1);

// 	if (status > 400) {
// 		return NotFound(status);
// 	}

// 	return (
// 		<Layout>
// 			<Header />
// 			{/* <Content dataMap={dataMap} /> */}
// 			<ClientWrapper dataMap={dataMap} />

// 			<ContentISR dataMap={dataMap} />
// 			{/* HELP: для SEO. Чтобы возвращало html с данными из бэка */}
// 			<h1 style={{ display: 'none' }}>{dataMap.title}</h1>
// 			{/* <h2>{mapParam}</h2> */}
// 			<Footer />
// 		</Layout>
// 	);
// };

// export default Home;
