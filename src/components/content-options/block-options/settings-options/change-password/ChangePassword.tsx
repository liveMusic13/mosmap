import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Popup from '@/components/ui/popup/Popup';

import { useNewpass } from '@/hooks/useNewpass';

import BlockParam from '../../block-param/BlockParam';

import { ACTUAL_MAP } from '@/app.constants';
import { arrFields } from '@/data/changePassword.data';

const ChangePassword: FC = () => {
	const searchParams = useSearchParams();
	// const map = searchParams.get('map');
	const map = Cookies.get(ACTUAL_MAP) || null;

	const [valueFields, setValueFields] = useState<{
		['Новый пароль:']: string;
		['Старый пароль:']: string;
		['Подтверждение пароля:']: string;
	}>({
		['Новый пароль:']: '',
		['Подтверждение пароля:']: '',
		['Старый пароль:']: '',
	});
	const [isPopup, setIsPopup] = useState<boolean>(false);

	const isDisabled =
		valueFields['Новый пароль:'] === '' ||
		valueFields['Старый пароль:'] === '' ||
		valueFields['Подтверждение пароля:'] === '' ||
		valueFields['Новый пароль:'] !== valueFields['Подтверждение пароля:'];

	const dataNewPass = {
		map: map || 0,
		oldpassword: valueFields['Старый пароль:'],
		password: valueFields['Новый пароль:'],
	};

	const { mutate, data, isSuccess } = useNewpass();

	useEffect(() => {
		if (isSuccess) {
			setIsPopup(true);
		}
	}, [data, isSuccess]);

	const onChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>, name: string) => {
			setValueFields(prev => ({ ...prev, [name]: e.target.value }));
		},
		[],
	);
	const handleNewPass = () => {
		if (map) mutate(dataNewPass);
	};
	const handleClosePopup = () => setIsPopup(false);

	return (
		<>
			{isPopup && (
				<Popup
					isHtmlMessage={data?.status === 'error'}
					message={data?.status === 'error' ? data?.message : 'Пароль изменен'}
					functions={{ onClick: handleClosePopup }}
				/>
			)}
			{arrFields.map(el => (
				<BlockParam
					key={el.id}
					field='input'
					title={el.title}
					inputValue={valueFields[el.title]}
					functions={{
						input: e => onChange(e, el.title),
					}}
				/>
			))}
			<Button disabled={isDisabled} onClick={handleNewPass}>
				сменить пароль
			</Button>
		</>
	);
};

export default ChangePassword;
