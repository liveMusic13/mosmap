import { useEffect, useState } from 'react';

export const useCheckWidth = () => {
	const [width, setWidth] = useState<number>(
		typeof window !== 'undefined' ? window.innerWidth : 0,
	);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const handleResize = () => {
			setWidth(window.innerWidth);
		};

		//HELP: сразу установить текущее значение
		handleResize();

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return width;
};
