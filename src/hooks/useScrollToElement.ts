import { useEffect, useRef } from 'react';

export const useScrollToElement = (shouldScroll: boolean, delay = 100) => {
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (shouldScroll && elementRef.current) {
			const timeoutId = setTimeout(() => {
				elementRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
					inline: 'nearest',
				});
			}, delay);

			return () => clearTimeout(timeoutId);
		}
	}, [shouldScroll, delay]);

	return elementRef;
};
