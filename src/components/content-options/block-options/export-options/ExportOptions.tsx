import { useSearchParams } from 'next/navigation';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';

import Button from '@/components/ui/button/Button';
import Checkbox from '@/components/ui/checkbox/Checkbox';

import { IExportCheckboxData } from '@/types/localState.types';
import { IExportResponse, IItemFilter } from '@/types/requestData.types';

import { useExport } from '@/hooks/useExport';

import BlockParam from '../block-param/BlockParam';

import styles from './ExportOptions.module.scss';
import { API_URL } from '@/app.constants';

const dataEncoding = ['UTF-8', 'Windows-1251'];
//TODO: Сделать хук для импорта и экспорта со всеми функциями и состояниями
const ExportOptions: FC = () => {
	const searchParams = useSearchParams();
	const map = searchParams.get('map');

	const [separator, setSeparator] = useState<string>(';');
	const [targetOption, setTargetOption] = useState<string>('UTF-8');
	const [nameFile, setNameFile] = useState<string>('test.csv');
	const [checkboxData, setCheckboxData] = useState<IExportCheckboxData[]>([
		{
			id: 1,
			name: 'Добавить координаты',
			isCheck: false,
		},
		{
			id: 2,
			name: 'Добавить ID дома',
			isCheck: false,
		},
	]);

	const dataForRequest = {
		separator: separator,
		encoding: targetOption,
		uploadfile: nameFile,
		house_id: checkboxData[1].isCheck,
		addCoordinate: checkboxData[0].isCheck,
	};

	const { refetch, isSuccess, data } = useExport(map || 0, dataForRequest);

	useEffect(() => {
		if (isSuccess && data) {
			if ((data as IExportResponse).OK) {
				const modifiedLink = (data as IExportResponse).filename.slice(2);
				window.open(`${API_URL}${modifiedLink}`, '_blank');
			}
		}
	}, [data]);

	const onCallbackInputName = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setNameFile(e.target.value),
		[],
	);
	const onCallbackSelect = useCallback((el: IItemFilter) => {
		setTargetOption(el.item_name);
	}, []);
	const onCallbackInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setSeparator(e.target.value),
		[],
	);
	const handleCheckboxClick = (el: IExportCheckboxData) => {
		setCheckboxData(prevData =>
			prevData.map(item =>
				item.id === el.id ? { ...item, isCheck: !item.isCheck } : item,
			),
		);
	};
	const handleExport = () => refetch();

	return (
		<div className={styles.block__exportOptions}>
			<BlockParam
				field='input'
				title='Имя файла'
				inputValue={nameFile}
				functions={{ input: onCallbackInputName }}
			/>
			<div className={styles.line}></div>
			<div className={styles.block__otherFields}>
				<BlockParam
					field='input'
					title='Разделитель :'
					inputValue={separator}
					functions={{ input: onCallbackInput }}
				/>
				<BlockParam
					field='select'
					title='Кодировка'
					select={{ optionsSelect: dataEncoding, targetValue: targetOption }}
					functions={{ select: onCallbackSelect }}
				/>
			</div>
			{checkboxData.map(el => (
				<Checkbox
					key={el.id}
					value=''
					onChange={() => handleCheckboxClick(el)}
					checked={el.isCheck}
					label={el.name}
				/>
			))}
			<div className={styles.line}></div>

			<Button onClick={handleExport}>Загрузить</Button>
		</div>
	);
};

export default ExportOptions;
