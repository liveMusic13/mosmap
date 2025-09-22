import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Checkbox from '@/components/ui/checkbox/Checkbox';

import {
	IItemFilter,
	ISaveSettingsMapResponse,
	TUrl,
} from '@/types/requestData.types';

import { useCheckUrl } from '@/hooks/useCheckUrl';
import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useSaveEditingDataSettingsMap } from '@/hooks/useSaveEditingDataSettingsMap';
import { useSaveSettingsMap } from '@/hooks/useSaveSettingsMap';

import { renameKeys } from '@/utils/formatData';
import { getMapId, getQueryString } from '@/utils/url';

import BlockParam from '../block-param/BlockParam';

import styles from './SettingsOptions.module.scss';
import ChangePassword from './change-password/ChangePassword';
import { arrayCheckboxName, arrayInputsName } from '@/data/settingsMap.data';

type Props = {
	onDirtyChange: (dirty: boolean) => void;
	provideSave: (fn: () => Promise<void>) => void;
};

const SettingsOptions: FC<Props> = ({ onDirtyChange, provideSave }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	// const map = Cookies.get(ACTUAL_MAP) || null;
	// const pathname = usePathname(); // "/map/renovation"
	const map = getMapId(searchParams); // работает с SEO URL

	// const seoUrl = pathname.startsWith('/map/')
	// 	? pathname.split('/map/')[1]
	// 	: null;

	// const queryString = searchParams.toString();

	// const resultQuery = seoUrl
	// 	? `?url=${seoUrl}&${queryString}`
	// 	: `?${queryString}`;

	// const queryString = new URLSearchParams(searchParams.toString()).toString();
	const queryString = getQueryString(searchParams); // включает map параметр

	const { data, isSuccess } = useSaveSettingsMap();
	const {
		mutate,
		mutateAsync,
		isSuccess: isSuccess_save,
		data: data_save,
	} = useSaveEditingDataSettingsMap();
	const { refetch } = useGetDataMap(queryString);

	const [formState, setFormState] = useState<{ [key: string]: string }>({
		'Название карты': '',
		'Описание карты': '',
		'Размер значков': '',
		'Радиус зоны в метрах для анализа местности:': '',
		tiles_id: '',
		'URL карты': '',
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
	const [isValidUrl, setIsValidUrl] = useState<TUrl>('standard');
	const [errorText, setErrorText] = useState<string>('');

	const {
		data: data_url,
		isSuccess: isSuccess_url,
		isError: isError_url,
	} = useCheckUrl(formState['URL карты']);

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
				['URL карты']: (data as ISaveSettingsMapResponse).url,
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
			onDirtyChange(false);
		}
	}, [data]);

	useEffect(() => {
		if (isSuccess_save) {
			router.push(`/?map=${map}`);
			refetch();
		}
	}, [isSuccess_save, data_save]);

	// Отслеживаем изменения результата проверки
	useEffect(() => {
		if (isSuccess_url && data_url) {
			const status =
				data_url.data.exists === 1
					? 'valid'
					: data_url.data.exists === 0 &&
						  formState['URL карты'] !== (data as ISaveSettingsMapResponse).url
						? 'invalid'
						: 'standard';
			setIsValidUrl(status);
		} else if (isError_url) {
			setIsValidUrl('invalid');
		}
	}, [isSuccess_url, data_url, isError_url]);

	const handleChangeCheckbox = (name: string) => {
		setFormStateCheck(prevState => ({
			...prevState,
			[name]: !prevState[name],
		}));
		onDirtyChange(true);
	};

	const validateUrlInput = (
		value: string,
	): { isValid: boolean; error: string } => {
		if (value.length > 250) {
			return { isValid: false, error: 'Слишком длинный URL' };
		}

		// Базовая валидация URL символов
		const urlPattern = /^[a-zA-Z0-9\-_\.\/:]*$/;
		if (value && !urlPattern.test(value)) {
			return { isValid: false, error: 'Недопустимые символы в URL' };
		}

		return { isValid: true, error: '' };
	};

	const onChangeInputs = (e: ChangeEvent<HTMLInputElement>, name: string) => {
		setFormState(prev => ({ ...prev, [name]: e.target.value }));
		onDirtyChange(true);
	};
	const onChangeInputsURL = async (
		e: ChangeEvent<HTMLInputElement>,
		name: string,
	) => {
		const value = e.target.value;
		const { isValid, error } = validateUrlInput(value);

		if (isValid) {
			setFormState(prev => ({ ...prev, [name]: e.target.value }));
			// Скрываем ошибку
			setIsValidUrl('standard');
		} else {
			// Показываем ошибку визуально
			setIsValidUrl('invalid');
			// Можно также показать текст ошибки
			console.log('Ошибка ввода:', error);
			setErrorText(error);
		}

		onDirtyChange(true);
	};

	const onCallbackSelect = useCallback((el: IItemFilter | null) => {
		if (!el) return;
		setTargetOption(el.item_name);
		onDirtyChange(true);
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

	useEffect(() => {
		provideSave(async () => {
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
							dataForRequest.showanalytic = formStateCheck[checkbox]
								? '1'
								: '0';
							break;
						default:
							break;
					}
				}
			}
			await mutateAsync({ map, data: dataForRequest });
			await refetch();
			// router.refresh();
			// router.push(`/?map=${map}`);
			onDirtyChange(false);
		});
	}, [
		formState,
		formStateCheck,
		map,
		mutateAsync,
		onDirtyChange,
		refetch,
		router,
	]);

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
							functions={{
								input: e => onChangeInputs(e, field),
							}}
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

					<BlockParam
						field='input'
						title={'URL карты'}
						inputValue={formState['URL карты']}
						inputErrorValid={errorText}
						functions={{ input: e => onChangeInputsURL(e, 'URL карты') }}
						forUrl={{
							url: isValidUrl,
							func: () => {
								setIsValidUrl('standard');
							},
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
