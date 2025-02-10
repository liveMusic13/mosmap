//TODO: Не использую хуки useRouter и useSearchParams из next, потому что если с их помощью добавлять/удалять query параметры в адресную строку, происходят серверные запросы. Т.к. next воспринимает изменение адресной строки как возможное изменение контента на странице и поэтому запрашивает новые данные. При использовании нативных new URLSearchParams(window.location.search) и window.history.replaceState(null, '', newUrl) запросов не происходит.
export const updateUrlParams = (newParams: Record<string, string | null>) => {
	const params = new URLSearchParams(window.location.search);

	//HELP: Обновляем существующие параметры
	Object.entries(newParams).forEach(([key, value]) => {
		if (value === null) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
	});

	const newUrl = `?${params.toString()}`;

	//HELP: Меняем URL без триггера ререндеринга RSC
	window.history.replaceState(null, '', newUrl);
};
