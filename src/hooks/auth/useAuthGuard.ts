import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface IUseAuthGuardOptions {
	redirectTo?: string;
	enabled?: boolean;
}

export const useAuthGuard = (
	hasMapAccess: () => boolean,
	options: IUseAuthGuardOptions = {},
) => {
	const router = useRouter();
	const { redirectTo = '/auth', enabled = true } = options;

	useEffect(() => {
		if (!enabled) return;

		const checkAuth = () => {
			const hasAccess = hasMapAccess();

			if (!hasAccess) {
				router.push(redirectTo);
			}
		};

		checkAuth();
	}, [hasMapAccess, router, redirectTo, enabled]);
};
