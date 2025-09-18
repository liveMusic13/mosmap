import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { $axios } from '@/api';

export const useTest = () => {
	const pathname = usePathname();

	const seoUrl = pathname.startsWith('/map/')
		? pathname.split('/map/')[1]
		: null;

	return useQuery({
		queryKey: ['test'],
		queryFn: async () => {
			try {
				const resp = await $axios.get(`/api/get_objects.php?url=${seoUrl}`);
				console.log(resp, 'query str: ', pathname);
			} catch (err) {
				console.log('query str: ', pathname);
			}
		},
	});
};
