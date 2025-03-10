import { useRef, useState } from 'react';

export const useMenuDropdown = () => {
	const [isHovered, setIsHovered] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => setIsHovered(false), 200);
	};

	const handleMenuEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	const handleMenuLeave = () => {
		timeoutRef.current = setTimeout(() => setIsHovered(false), 100);
	};

	return {
		isHovered,
		handleMouseEnter,
		handleMouseLeave,
		handleMenuEnter,
		handleMenuLeave,
	};
};
