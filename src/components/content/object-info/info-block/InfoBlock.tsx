import { FC } from 'react';

import Select from '@/components/ui/select/Select';

import { IInfoBlock } from '@/types/props.types';

import styles from './InfoBlock.module.scss';

const InfoBlock: FC<IInfoBlock> = ({ onCallbackForSelect, filter, value }) => {
	return (
		<div className={styles.wrapper_infoBlock}>
			<h2 className={styles.title}>{filter?.caption}</h2>
			<div className={styles.block__filter}>
				<Select
					items={filter?.items || []}
					handleClick={onCallbackForSelect}
					forInfo={{ isInfo: true, value: value.toString() }}
				/>
			</div>
		</div>
	);
};

export default InfoBlock;
