import { FC } from 'react';

import ContentOptions from '@/components/content-options/ContentOptions';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Layout from '@/components/layout/Layout';

const SettingsMap: FC = () => {
	return (
		<Layout>
			<Header />
			<ContentOptions title='Настройка карты' />
			<Footer />
		</Layout>
	);
};

export default SettingsMap;
