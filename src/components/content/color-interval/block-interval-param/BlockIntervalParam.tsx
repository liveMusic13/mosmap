import { useSearchParams } from 'next/navigation';
import { FC, useEffect } from 'react';

import Select from '@/components/ui/select/Select';

import { IBlockIntervalParam } from '@/types/props.types';

import { useSelect } from '@/hooks/useSelect';

import { updateUrlParams } from '@/utils/url';

import styles from './BlockIntervalParam.module.scss';

const BlockIntervalParam: FC<IBlockIntervalParam> = ({
	title,
	options,
	targetValue,
	absoluteOptionsForSelect,
}) => {
	const searchParams = useSearchParams();
	const formatOptions = options.map(el => ({
		item_name: el.name,
		item_id: el.id,
	}));

	const handleClickSelect = useSelect(updateUrlParams, {
		id: 0,
		caption: '',
		name: title,
		type: '',
	});

	useEffect(() => {
		//HELP: Установка дефолтных значений в адресную строку
		const searchTargetValue = formatOptions.find(
			el => el.item_name === targetValue,
		);

		if (searchTargetValue) handleClickSelect(searchTargetValue);
	}, []);

	useEffect(() => {
		//HELP: Получение значений из query параметров
		const targetParams = searchParams.get(title);

		if (targetParams) {
			const isOptionValid = options.some(el => el.id === Number(targetParams));
			console.log('isOptionValid', isOptionValid, targetParams);
		}
	}, [searchParams.toString(), options, targetValue]);

	return (
		<div className={styles.wrapper_filterBlock}>
			<h2 className={styles.title}>{title}</h2>
			<div className={styles.block__filter}>
				<Select
					style={{ width: '100%' }}
					absoluteOptions={absoluteOptionsForSelect}
					items={formatOptions || []}
					handleClick={handleClickSelect}
					forInfo={{ isInfo: false, value: targetValue || '' }}
				/>
			</div>
		</div>
	);
};

export default BlockIntervalParam;
