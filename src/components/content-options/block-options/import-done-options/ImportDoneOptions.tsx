import { FC } from 'react';

import Select from '@/components/ui/select/Select';

import { IImportResponse } from '@/types/requestData.types';

import { useImport } from '@/hooks/useImport';

import styles from './ImportDoneOptions.module.scss';

const ImportDoneOptions: FC = () => {
	const { mutate, data: data_import, isSuccess } = useImport();

	console.log(data_import);

	const renderFields = () => {
		const fields: { [key: string]: string } = {
			...(data_import as IImportResponse).list_field,
			...(data_import as IImportResponse).text_field,
		}; // Объединяем объекты
		const data = [
			'Не загружать',
			...((data_import as IImportResponse).file_field || []),
		];

		console.log('fields', fields);

		return Object.keys(fields).map(key => {
			const value = fields[key]; // Получаем значение по ключу
			return (
				<Select
					key={key}
					forInfo={{ isInfo: true, value: data[0] }}
					items={[]}
					handleClick={() => {}}
				/>
			);
		});
	};

	return (
		<div className={styles.wrapper_importDoneOptions}>
			<div className={styles.block__field}>{isSuccess && renderFields()}</div>
			<div className={styles.block__fid}></div>
			<div className={styles.block__coordinate}></div>
		</div>
	);
};

export default ImportDoneOptions;
