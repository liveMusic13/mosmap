import { FC, useEffect } from 'react';

import Button from '@/components/ui/button/Button';
import Checkbox from '@/components/ui/checkbox/Checkbox';

import { useMapContext } from '@/providers/MapProvider';

import { IExportResponse } from '@/types/requestData.types';

import { useExport } from '@/hooks/useExport';
import { useImportExport } from '@/hooks/useImportExport';

import BlockParam from '../block-param/BlockParam';

import styles from './ExportOptions.module.scss';
import { API_URL } from '@/app.constants';

const dataEncoding = ['UTF-8', 'Windows-1251'];

const ExportOptions: FC = () => {
	const { mapId: map, loading } = useMapContext();

	const {
		separator,
		targetOption,
		nameFile,
		checkboxData,
		onCallbackInputName,
		onCallbackInput,
		onCallbackSelect,
		handleCheckboxClick,
	} = useImportExport();

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

	const handleExport = () => refetch();

	if (loading) {
		return <div>Loading map...</div>;
	}

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

			<Button onClick={handleExport}>Выгрузить</Button>
		</div>
	);
};

export default ExportOptions;
