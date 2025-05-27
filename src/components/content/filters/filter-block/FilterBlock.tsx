import { FC, memo } from 'react';

import Checkbox from '@/components/ui/checkbox/Checkbox';
import Range from '@/components/ui/range/Range';
import Select from '@/components/ui/select/Select';

import { IFilterBlock } from '@/types/props.types';

import { useCheckbox } from '@/hooks/useCheckbox';
import { useRange } from '@/hooks/useRange';
import { useSelect } from '@/hooks/useSelect';

import { updateUrlParams } from '@/utils/url';

import styles from './FilterBlock.module.scss';

const FilterBlock: FC<IFilterBlock> = memo(({ filter }) => {
	const { onChange, checkValueInUrl } = useCheckbox(filter, updateUrlParams);
	const { rangeBoundaries, sliderValues, handleRangeChange } = useRange({
		filter,
		updateUrlParams,
	});
	const handleClick = useSelect(updateUrlParams, filter);

	return (
		<div className={styles.wrapper_filterBlock}>
			<h2 className={styles.title}>{filter.caption}</h2>
			<div className={styles.line}></div>
			<div className={styles.block__filter}>
				{filter.type === 'number' && (
					<Range
						min={rangeBoundaries.min}
						max={rangeBoundaries.max}
						values={sliderValues}
						onChange={handleRangeChange}
						filter={filter}
						updateUrlParams={updateUrlParams}
					/>
				)}
				{filter.type === 'map' &&
					(filter.items || []).map(el => (
						<Checkbox
							key={el.item_id}
							onChange={e => onChange(e, el)}
							value={String(el.item_id)}
							checked={
								checkValueInUrl?.some(elem => elem === String(el.item_id)) ||
								false
							}
							label={el.item_name}
						/>
					))}
				{filter.type === 'list' && (
					<Select
						items={filter.items || []}
						handleClick={handleClick}
						queryName={filter.name || ''}
					/>
				)}
			</div>
		</div>
	);
});

export default FilterBlock;
