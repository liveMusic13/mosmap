import { useMutation } from '@tanstack/react-query';

import { INewpassClientData } from '@/types/requestData.types';

import { authService } from '@/services/auth.service';

export const useNewpass = () => {
	const { mutate, data, isPending, isError, isSuccess } = useMutation({
		mutationKey: ['newpass'],
		mutationFn: (data: INewpassClientData) => authService.newpass_client(data),
		onSuccess: data => data.data,
	});

	return { mutate, data, isPending, isError, isSuccess };
};
