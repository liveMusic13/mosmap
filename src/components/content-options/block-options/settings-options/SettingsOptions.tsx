import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Checkbox from '@/components/ui/checkbox/Checkbox';

import {
	IItemFilter,
	ISaveSettingsMapResponse,
} from '@/types/requestData.types';

import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useSaveEditingDataSettingsMap } from '@/hooks/useSaveEditingDataSettingsMap';
import { useSaveSettingsMap } from '@/hooks/useSaveSettingsMap';

import { renameKeys } from '@/utils/formatData';

import BlockParam from '../block-param/BlockParam';

import styles from './SettingsOptions.module.scss';
import ChangePassword from './change-password/ChangePassword';
import { arrayCheckboxName, arrayInputsName } from '@/data/settingsMap.data';

const SettingsOptions: FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');

	const { data, isSuccess } = useSaveSettingsMap();
	const {
		mutate,
		isSuccess: isSuccess_save,
		data: data_save,
	} = useSaveEditingDataSettingsMap();
	const { refetch } = useGetDataMap(map);

	const [formState, setFormState] = useState<{ [key: string]: string }>({
		'Название карты': '',
		'Описание карты': '',
		'Размер значков': '',
		'Радиус зоны в метрах для анализа местности:': '',
		tiles_id: '',
	});
	const [formStateCheck, setFormStateCheck] = useState<{
		[key: string]: boolean;
	}>({
		Кластеризация: false,
		'Автоматическое масштабирование значков': false,
		'Заменять значки на контуры домов': false,
		'Добавлять в карточку объекта анализ местности': false,
	});
	const [targetOption, setTargetOption] = useState<string>('');

	const findTargetSelect =
		(data as ISaveSettingsMapResponse)?.tiles_list.find(
			el => el.id === (data as ISaveSettingsMapResponse)?.tiles_id,
		)?.name || '';
	const optionsSelect = (data as ISaveSettingsMapResponse)?.tiles_list.map(
		el => el.name,
	);

	useEffect(() => {
		let inputStates;
		let checkboxState;

		if (data && isSuccess) {
			inputStates = {
				['Название карты']: (data as ISaveSettingsMapResponse).title,
				['Описание карты']: (data as ISaveSettingsMapResponse).descr,
				['Размер значков']: (data as ISaveSettingsMapResponse).iconsize,
				['Радиус зоны в метрах для анализа местности:']: (
					data as ISaveSettingsMapResponse
				).radius,
				['tiles_id']: (data as ISaveSettingsMapResponse).tiles_id,
			};

			checkboxState = {
				['Кластеризация']:
					(data as ISaveSettingsMapResponse).clastering === '0' ? false : true,
				['Автоматическое масштабирование значков']:
					(data as ISaveSettingsMapResponse).autosize === '0' ? false : true,
				['Заменять значки на контуры домов']:
					(data as ISaveSettingsMapResponse).showhouses === '0' ? false : true,
				['Добавлять в карточку объекта анализ местности']:
					(data as ISaveSettingsMapResponse).showanalytic === '0'
						? false
						: true,
			};
			setFormState(inputStates);
			setFormStateCheck(checkboxState);
		}
	}, [data]);

	useEffect(() => {
		if (isSuccess_save) {
			router.push(`/?map=${map}`);
			refetch();
		}
	}, [isSuccess_save, data_save]);

	const handleChangeCheckbox = (name: string) => {
		setFormStateCheck(prevState => ({
			...prevState,
			[name]: !prevState[name],
		}));
	};
	const onChangeInputs = (e: ChangeEvent<HTMLInputElement>, name: string) => {
		setFormState(prev => ({ ...prev, [name]: e.target.value }));
	};
	const onCallbackSelect = useCallback((el: IItemFilter | null) => {
		if (!el) return;
		setTargetOption(el.item_name);
	}, []);
	const handleSaveSettings = () => {
		const formatInputsValue: any = renameKeys(formState);
		const tiles_id = (data as ISaveSettingsMapResponse)?.tiles_list.find(
			el => el.name === targetOption,
		)?.id;
		const dataForRequest = {
			autosize: '',
			clastering: '',
			showhouses: '',
			showanalytic: '',
			...formatInputsValue,
			tiles_id: tiles_id,
			tiles_list: (data as ISaveSettingsMapResponse)?.tiles_list,
		};

		for (const checkbox in formStateCheck) {
			if (formStateCheck.hasOwnProperty(checkbox)) {
				switch (checkbox) {
					case 'Автоматическое масштабирование значков':
						dataForRequest.autosize = formStateCheck[checkbox] ? '1' : '0';
						break;
					case 'Кластеризация':
						dataForRequest.clastering = formStateCheck[checkbox] ? '1' : '0';
						break;
					case 'Заменять значки на контуры домов':
						dataForRequest.showhouses = formStateCheck[checkbox] ? '1' : '0';
						break;
					case 'Добавлять в карточку объекта анализ местности':
						dataForRequest.showanalytic = formStateCheck[checkbox] ? '1' : '0';
						break;
					default:
						break;
				}
			}
		}

		mutate({ map, data: dataForRequest });
	};

	return (
		<div className={styles.wrapper_settingsOptions}>
			{isSuccess && data && (
				<>
					{arrayInputsName.map((field, ind) => (
						<BlockParam
							key={ind}
							field='input'
							title={field}
							inputValue={formState[field]}
							functions={{ input: e => onChangeInputs(e, field) }}
						/>
					))}
					{arrayCheckboxName.map((checkbox, ind) => (
						<Checkbox
							key={ind}
							value=''
							onChange={() => handleChangeCheckbox(checkbox)}
							checked={formStateCheck[checkbox]}
							label={checkbox}
						/>
					))}
					<BlockParam
						field='input'
						title='Радиус зоны в метрах для анализа местности:'
						inputValue={
							formState['Радиус зоны в метрах для анализа местности:']
						}
						functions={{
							input: e =>
								onChangeInputs(
									e,
									'Радиус зоны в метрах для анализа местности:',
								),
						}}
					/>
					<ChangePassword />
					<BlockParam
						field='select'
						title='Вид карты'
						select={{
							optionsSelect: optionsSelect,
							targetValue: findTargetSelect,
						}}
						functions={{ select: onCallbackSelect }}
					/>
				</>
			)}
			<Button onClick={handleSaveSettings}>сохранить</Button>
		</div>
	);
};

export default SettingsOptions;
