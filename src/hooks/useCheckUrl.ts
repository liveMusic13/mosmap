import { useQuery } from '@tanstack/react-query';

import { settingsService } from '@/services/settings.service';

export const useCheckUrl = (url: string) => {
	return useQuery({
		queryKey: ['check-url', url], // ключ будет меняться при изменении url
		queryFn: () => settingsService.check_url(url),
		enabled: !!url && url.length > 0, // запускать только если URL не пустой
		staleTime: 5 * 60 * 1000, // 5 минут кэширования
	});
};
