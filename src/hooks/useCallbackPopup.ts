import { useState } from 'react';

import { IPopupErrorInConfirmPage } from '@/types/localState.types';
import { IRegistrResponse } from '@/types/requestData.types';

export const useCallbackPopup = () => {
	const [popup, setPopup] = useState<IPopupErrorInConfirmPage>({
		isPopup: false,
		message: '',
		status: '',
	});

	const handleCallback = (data: IRegistrResponse) => {
		console.log(data);
		setPopup({ isPopup: true, message: data.message, status: data.status });
	};

	const onClickPopup = () => setPopup({ isPopup: false, message: '' });

	return {
		handleCallback,
		onClickPopup,
		popup,
	};
};
