import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';

import Button from '@/components/ui/button/Button';

import { IItemFilter } from '@/types/requestData.types';

import { useQueryKeysForGetCacheDataStore } from '@/store/store';

import { useImport } from '@/hooks/useImport';

import { truncateDescription } from '@/utils/editTexts';

import BlockParam from '../block-param/BlockParam';

import styles from './ImportOptions.module.scss';

const dataEncoding = ['Автоопределение', 'UTF-8', 'Windows-1251'];

const ImportOptions: FC = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');

	const setNewCache = useQueryKeysForGetCacheDataStore(
		store => store.setNewCache,
	);

	const [separator, setSeparator] = useState<string>(';');
	const [targetOption, setTargetOption] = useState<string>('UTF-8');
	const [nameFile, setNameFile] = useState<string>('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const { mutate, data, isSuccess } = useImport();

	useEffect(() => {
		if (isSuccess && data && data.status >= 200 && data.status < 300) {
			router.push(`${pathname}/done?map=${map}`);
		}
		console.log('data', data);
	}, [data]);

	const handleUpload = () => {
		if (map && selectedFile)
			mutate({ map, file: selectedFile, separator, encoding: targetOption });
		setNewCache({ separator, encoding: targetOption });
	};
	const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
		const file = target.files;
		if (file) {
			setSelectedFile(file[0]);
			setNameFile(file[0].name);
		}
	};
	const onCallbackSelect = useCallback((el: IItemFilter) => {
		setTargetOption(el.item_name);
	}, []);
	const onCallbackInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setSeparator(e.target.value),
		[],
	);

	return (
		<div className={styles.block__importOptions}>
			<div className={styles.block__addFile}>
				<input
					type='file'
					className={styles.input__file}
					onChange={handleFileChange}
				/>
				<Button>выбрать файл</Button>
				<p className={styles.name__file}>{truncateDescription(nameFile, 29)}</p>
			</div>
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
			<div className={styles.line}></div>
			<Button onClick={handleUpload}>Загрузить</Button>
		</div>
	);
};

export default ImportOptions;
