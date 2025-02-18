import { useRouter } from 'next/navigation';
import { ChangeEvent, useCallback, useState } from 'react';

import { IFormAuth } from '@/types/data.types';
import { IObjectFieldsState } from '@/types/localState.types';
import {
	INewpassData,
	IRegistrResponse,
	IRegistrationData,
	IRestoreData,
} from '@/types/requestData.types';

import { getStateFromDate } from '@/utils/formatData';

import { authService } from '@/services/auth.service';

export const useEntryAuth = (formData: IFormAuth[]) => {
	const router = useRouter();
	const [valueFields, setValueField] = useState<IObjectFieldsState>(
		getStateFromDate(formData),
	);

	const handleAuth = async () =>
		await authService.login(
			valueFields['Логин'].value,
			valueFields['Пароль'].value,
			router,
		);

	const onChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>, stateName: string) => {
			setValueField(prev => ({
				...prev,
				[stateName]: { value: e.target.value },
			}));
		},
		[setValueField],
	);

	const handleRegistr = async (
		data: IRegistrationData,
	): Promise<IRegistrResponse> => await authService.registration(data);

	const handleRestore = async (data: IRestoreData): Promise<IRegistrResponse> =>
		await authService.restore(data);

	const handleNewpass = async (data: INewpassData): Promise<IRegistrResponse> =>
		await authService.newpass(data);

	return {
		handleAuth,
		onChange,
		valueFields,
		handleRegistr,
		handleRestore,
		handleNewpass,
	};
};
