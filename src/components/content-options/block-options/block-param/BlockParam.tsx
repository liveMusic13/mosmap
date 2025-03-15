import { FC } from 'react';

import Input from '@/components/ui/input/Input';
import Select from '@/components/ui/select/Select';

import { IBlockParam } from '@/types/props.types';

import styles from './BlockParam.module.scss';
import { colors } from '@/app.constants';

const BlockParam: FC<IBlockParam> = ({
	field,
	title,
	select,
	functions,
	inputValue,
	absoluteOptionsForSelect,
}) => {
	const formatOptions = select?.optionsSelect?.map((el, ind) => ({
		item_name: el,
		item_id: ind,
	}));

	return (
		<div className={styles.wrapper_filterBlock}>
			<h2 className={styles.title}>{title}</h2>
			<div className={styles.block__filter}>
				{field === 'select' && functions?.select && (
					<Select
						absoluteOptions={absoluteOptionsForSelect}
						items={formatOptions || []}
						handleClick={functions.select}
						forInfo={{ isInfo: true, value: select?.targetValue || '' }}
					/>
				)}
				{field === 'input' && functions?.input && (
					<Input
						type='text'
						value={inputValue || ''}
						onChange={functions.input}
						style={{
							width: 'calc(300/1920*100vw)',
							height: 'calc(40/1920*100vw)',
							backgroundColor: colors.white,
						}}
						styleInput={{ height: '100%', fontSize: '1rem' }}
					/>
				)}
			</div>
		</div>
	);
};

export default BlockParam;
