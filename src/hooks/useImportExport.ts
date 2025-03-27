import { ChangeEvent, useCallback, useState } from 'react';

import { IExportCheckboxData } from '@/types/localState.types';
import { IItemFilter } from '@/types/requestData.types';

export const useImportExport = () => {
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

	const onCallbackInputName = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setNameFile(e.target.value),
		[],
	);
	const handleCheckboxClick = (el: IExportCheckboxData) => {
		setCheckboxData(prevData =>
			prevData.map(item =>
				item.id === el.id ? { ...item, isCheck: !item.isCheck } : item,
			),
		);
	};

	//HELP: Для импорта
	const [nameFileImport, setNameFileImport] = useState<string>('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
		const file = target.files;
		if (file) {
			setSelectedFile(file[0]);
			setNameFileImport(file[0].name);
		}
	};
	const onCallbackSelect = useCallback((el: IItemFilter) => {
		setTargetOption(el.item_name);
	}, []);
	const onCallbackInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => setSeparator(e.target.value),
		[],
	);

	return {
		handleFileChange,
		onCallbackSelect,
		onCallbackInput,
		nameFileImport,
		setNameFileImport,
		selectedFile,
		onCallbackInputName,
		separator,
		targetOption,
		nameFile,
		checkboxData,
		handleCheckboxClick,
	};
};
