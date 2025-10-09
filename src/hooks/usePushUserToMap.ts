import Cookies from 'js-cookie';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { TOKEN } from '@/app.constants';

export const usePushUserToMap = () => {
	const pathname = usePathname();
	const searchparams = useSearchParams();
	const router = useRouter();
	const map = searchparams.get('map');

	useEffect(() => {
		const token = Cookies.get(TOKEN);
		if (pathname === '/' && !map && token) {
			router.push(`/?map=${map}`);
		}
	}, []);
};
