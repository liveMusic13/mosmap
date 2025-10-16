import { type RefObject, useEffect } from 'react';

export const useClickOutside = (
	ref: RefObject<HTMLDivElement | null>,
	handler: () => void,
) => {
	// Закрытие по клику вне
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				handler();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref, handler]);
};
