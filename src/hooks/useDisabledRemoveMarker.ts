import { useEffect } from 'react';

import { usePopupStore, useRemoveMarkerCrdStore } from '@/store/store';

export const useDisabledRemoveMarker = () => {
	const isRemoveMarker = useRemoveMarkerCrdStore(store => store.isRemoveMarker);
	const { setIsPopup, setMessageInPopup } = usePopupStore(store => store);

	useEffect(() => {
		const handleMouseDown = (event: any) => {
			//HELP: event.button === 2 соответствует правой кнопке мыши
			if (event.button === 2) {
				if (isRemoveMarker) {
					event.preventDefault();
					setMessageInPopup(
						'Вы уверено что хотите изменить координаты маркера?',
					);
					setIsPopup(true);
				}
			}
		};

		document.addEventListener('contextmenu', handleMouseDown);
		return () => {
			document.removeEventListener('contextmenu', handleMouseDown);
		};
	}, [isRemoveMarker]);
};
