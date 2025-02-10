import { useRouter } from 'next/router';

export const useQueryParams = () => {
	const router = useRouter();

	return { router };
};
