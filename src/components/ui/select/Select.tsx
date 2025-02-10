import Image from 'next/image';
import { FC, useState } from 'react';

import { ISelect } from '@/types/props.types';
import { IItemFilter } from '@/types/requestData.types';

import styles from './Select.module.scss';

const Select: FC<ISelect> = ({ items, handleClick }) => {
	const [target, setTarget] = useState<string>('Выберите значение');
	const [isOptions, setIsOptions] = useState<boolean>(false);

	const onClick = (el: IItemFilter) => {
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
				<div className={styles.options}>
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
