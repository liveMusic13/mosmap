import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useCallback, useEffect, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Checkbox from '@/components/ui/checkbox/Checkbox';
import Popup from '@/components/ui/popup/Popup';

import { IImportDoneResponse, IItemFilter } from '@/types/requestData.types';

import { useImportResponseStore } from '@/store/store';

import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useImportDone } from '@/hooks/useImportDone';

import { convertImportDoneField } from '@/utils/formatData';
import { getMapId, getQueryString } from '@/utils/url';

import BlockParam from '../block-param/BlockParam';

import styles from './ImportDoneOptions.module.scss';
import { colors } from '@/app.constants';

const ImportDoneOptions: FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const map = getMapId(searchParams); // работает с SEO URL
	// const map = Cookies.get(ACTUAL_MAP) || null;

	// //HELP: Преобразование searchParams в строку
	// const queryString = new URLSearchParams(searchParams.toString()).toString();
	const queryString = getQueryString(searchParams); // включает map параметр

	// const resultQuery = map ? `?map=${map}${queryString}` : queryString;

	// const pathname = usePathname(); // "/map/renovation"

	// const seoUrl = pathname.startsWith('/map/')
	// 	? pathname.split('/map/')[1]
	// 	: null;

	// const queryString = searchParams.toString();

	// const resultQuery = seoUrl
	// 	? `?url=${seoUrl}&${queryString}`
	// 	: `?${queryString}`;

	const {
		encoding,
		file_field,
		list_field,
		separator,
		text_field,
		uploadfile,
	} = useImportResponseStore(store => store);
	const data_import = {
		encoding,
		file_field,
		list_field,
		separator,
		text_field,
		uploadfile,
	};

	const { refetch } = useGetDataMap(queryString);
	const { mutate, isPending, isSuccess, data } = useImportDone();
	const [htmlString, setHtmlString] = useState<string>('');

	useEffect(() => {
		if (isSuccess && data) {
			setHtmlString(`  <p><span style={color: ${colors.green_light}}>Добавлено строк: </span>${(data?.data as IImportDoneResponse).add_rows}</p>
          <p><span style={color: ${colors.green_light}}>Прочитано строк: </span>${(data?.data as IImportDoneResponse).read_rows}</p>
          <p><span style={color: ${colors.green_light}}>Изменено строк: </span>${(data?.data as IImportDoneResponse).update_rows}</p>`);
		}
	}, [data]);

	const [targetOptions, setTargetOptions] = useState<{
		[key: string]: { value: string; type: 'text' | 'list' };
	}>({});
	const [isCheckbox, setIsCheckbox] = useState<boolean>(false);

	useEffect(() => {
		//HELP: Устанавливаем дефолтные значения в targetOptions чтобы он не был пустым, если пользователь не будет вручную устанавливать все значения в селектах и чекбоксе
		const fields = { ...data_import.text_field, ...data_import.list_field };
		const defaultOptions: {
			[key: string]: { value: string; type: 'text' | 'list' };
		} = {};

		// Устанавливаем значение по умолчанию для text и list полей
		Object.keys(data_import.text_field || {}).forEach(key => {
			defaultOptions[key] = { value: 'Не загружать', type: 'text' };
		});

		Object.keys(data_import.list_field || {}).forEach(key => {
			defaultOptions[key] = { value: 'Не загружать', type: 'list' };
		});

		// Устанавливаем значение по умолчанию для координат и идентификаторов
		defaultOptions['dataId'] = { value: 'Нет', type: 'text' };
		defaultOptions['Широта'] = { value: 'Нет', type: 'text' };
		defaultOptions['Долгота'] = { value: 'Нет', type: 'text' };
		defaultOptions['ID дома mosmap'] = { value: 'Нет', type: 'text' };

		setTargetOptions(defaultOptions); // Устанавливаем начальные состояния
	}, []);

	const dataId = ['Нет', ...Object.values(data_import.text_field || {})];

	const handleCheckboxClick = () => {
		setIsCheckbox(!isCheckbox);
	};
	const onClickSend = useCallback(() => {
		let requestBody = convertImportDoneField(
			targetOptions,
			data_import.file_field,
			dataId,
		);

		//HELP: Добавляем поле erasebase, если чекбокс активен
		if (isCheckbox) {
			requestBody = { ...requestBody, erasebase: 'on' };
		}

		if (map)
			mutate({ map, option: { encoding, separator, uploadfile }, requestBody });
	}, [targetOptions, data_import, dataId]);
	const closePopup = () => {
		refetch();
		router.push(`/?map=${map}`);
	};

	const renderFields = () => {
		const fields: { [key: string]: string } = {
			...data_import.list_field,
			...data_import.text_field,
		}; //HELP: Объединяем объекты
		const data = ['Не загружать', ...(data_import.file_field || [])];

		return Object.keys(fields).map((key, ind) => {
			const value = fields[key]; //HELP: Получаем значение по ключу
			return (
				<BlockParam
					key={ind}
					select={{ optionsSelect: data, targetValue: data[0] }}
					functions={{
						select: (el: IItemFilter | null) => {
							if (!el) return;
							setTargetOptions(prev => ({
								...prev,
								[key]: {
									value: el.item_name,
									type: key in data_import.text_field ? 'text' : 'list',
								},
							}));
						},
					}}
					title={value}
					field='select'
					absoluteOptionsForSelect={true}
				/>
			);
		});
	};
	const renderCoordinate = () => {
		const fields = ['Широта', 'Долгота', 'ID дома mosmap'];
		const data = ['Нет', ...(data_import.file_field || [])];

		return fields.map((key, ind) => {
			return (
				<BlockParam
					key={ind}
					select={{ optionsSelect: data, targetValue: data[0] }}
					functions={{
						select: (el: IItemFilter | null) => {
							if (!el) return;

							setTargetOptions(prev => ({
								...prev,
								[key]: {
									value: el.item_name,
									type: key in data_import.text_field ? 'text' : 'list',
								},
							}));
						},
					}}
					title={key}
					field='select'
					absoluteOptionsForSelect={true}
				/>
			);
		});
	};
	const renderDataId = () => {
		return (
			<BlockParam
				select={{
					optionsSelect: dataId,
					targetValue: dataId[0],
				}}
				functions={{
					select: (el: IItemFilter | null) => {
						if (!el) return;

						setTargetOptions(prev => ({
							...prev,
							['dataId']: {
								value: el.item_name,
								type: 'text',
							},
						}));
					},
				}}
				title={'Идентификатор'}
				field='select'
				absoluteOptionsForSelect={true}
			/>
		);
	};

	return (
		<div className={styles.wrapper_importDoneOptions}>
			{isSuccess && (
				<Popup
					isHtmlMessage={true}
					message={htmlString}
					functions={{ onClick: closePopup }}
				/>
			)}
			<div className={styles.block__select}>{renderFields()}</div>
			<div className={styles.line}></div>
			<div className={styles.block__id}>
				{renderDataId()}
				<Checkbox
					value=''
					onChange={handleCheckboxClick}
					checked={isCheckbox}
					label='Очистить список перед загрузкой.'
				/>
			</div>
			<div className={styles.line}></div>
			<div className={styles.block__select}>{renderCoordinate()}</div>
			<div className={styles.line}></div>

			<Button onClick={onClickSend}>отправить</Button>
		</div>
	);
};

export default ImportDoneOptions;
