import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

import { ISelect } from '@/types/props.types';
import { IItemFilter } from '@/types/requestData.types';

import { useClearAllFiltersStore } from '@/store/store';

import styles from './Select.module.scss';

const Select: FC<ISelect> = ({
	items,
	handleClick,
	queryName,
	forInfo,
	absoluteOptions,
}) => {
	const searchParams = useSearchParams();
	const nameSelect = searchParams.get(queryName || '');
	const isClear = useClearAllFiltersStore(store => store.isClear);

	const [target, setTarget] = useState<string>('Выберите значение');
	const [isOptions, setIsOptions] = useState<boolean>(false);

	useEffect(() => {
		//HELP: При использовании селекта в компоненте информации об объекте, используем значение установленное в данных как дефолтное для установки его в компоненте. И ставим в зависимость значение value из пропса, чтобы при переключении объектов в таргете перерисовывался компонент селекта и устанавливал новое значение в таргет, если оно есть.
		if (forInfo) {
			setTarget(forInfo.value);
		}
	}, [forInfo?.value]);

	useEffect(() => {
		if (nameSelect) {
			//HELP: Для установки значения при копировании ссылки, если оно есть в адресной строке
			const value = items.find(el => Number(el.item_id) === Number(nameSelect));
			if (value) setTarget(value.item_name);
		}
	}, []);

	useEffect(() => {
		if (isClear) setTarget('Выберите значение');
	}, [isClear]);

	const onClick = (el: IItemFilter) => {
		console.log('in select', el);
		setTarget(el.item_name);
		handleClick(el);
		setIsOptions(false);
	};

	return (
		<div className={styles.wrapper_select}>
			<div
				className={styles.select}
				onClick={() => {
					setIsOptions(!isOptions);
				}}
			>
				<p className={styles.name}>{target}</p>
				<Image
					src='/images/icons/arrow_double.svg'
					alt='arrow'
					width={8}
					height={16}
					className={styles.image}
				/>
			</div>
			{isOptions && (
				<div
					className={
						absoluteOptions
							? `${styles.options} ${styles.absoluteOptions}`
							: `${styles.options}`
					}
				>
					{items.map(el => (
						<p
							key={el.item_id}
							className={styles.option}
							onClick={() => onClick(el)}
						>
							{el.item_name}
						</p>
					))}
				</div>
			)}
		</div>
	);
};

export default Select;
