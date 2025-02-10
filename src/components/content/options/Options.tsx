import { FC, useCallback } from 'react';

import Button from '@/components/ui/button/Button';
import Line from '@/components/ui/line/Line';

import { useFiltersStore, useListOfObjectsStore } from '@/store/store';

import { srcStandard } from '@/utils/pathSvg';

import styles from './Options.module.scss';
import { colors } from '@/app.constants';
import { settingsArr, standardArr } from '@/data/options.data';

const Options: FC = () => {
	const isListOfObjects = useListOfObjectsStore(store => store.isListOfObjects);
	const isFilters = useFiltersStore(store => store.isFilters);

	const onClick = useCallback((id: number) => {
		if (id === 2) {
			useFiltersStore.setState(state => ({
				isFilters: !state.isFilters,
			}));
		} else if (id === 3) {
			useListOfObjectsStore.setState(state => ({
				isListOfObjects: !state.isListOfObjects,
			}));
		}
	}, []);

	return (
		<div className={styles.block__options}>
			<div className={styles.one}>
				{standardArr.map(opt => (
					<Button
						key={opt.id}
						style={{
							width: 'calc(39/1920*100vw)',
							height: 'calc(39/1920*100vw)',
							border: `1px solid ${colors.grey_middle}`,
							backgroundColor: 'transparent',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'relative',
						}}
						onClick={() => onClick(opt.id)}
					>
						<svg className={styles.icon_svg} style={{ color: colors.green }}>
							<use
								xlinkHref={srcStandard(opt, isListOfObjects, isFilters)}
							></use>
						</svg>
						<p className={styles.hover__text} style={{ left: 0 }}>
							{opt.hover_text}
						</p>
					</Button>
				))}
				<Line
					style={{
						backgroundColor: colors.grey_lines,
						marginLeft: 'calc(3/1920*100vw)',
						marginRight: 'calc(2/1920*100vw)',
					}}
				/>
				<Line style={{ backgroundColor: colors.grey_lines }} />
			</div>
			<div className={styles.two}>
				<Line style={{ backgroundColor: colors.grey_lines }} />
				<Line
					style={{
						backgroundColor: colors.grey_lines,
						marginLeft: 'calc(2/1920*100vw)',
						marginRight: 'calc(3/1920*100vw)',
					}}
				/>
				{settingsArr.map(opt => (
					<Button
						key={opt.id}
						style={{
							width: 'calc(39/1920*100vw)',
							height: 'calc(39/1920*100vw)',
							border: `1px solid ${colors.grey_middle}`,
							backgroundColor: 'transparent',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'relative',
						}}
					>
						<svg className={styles.icon_svg} style={{ color: colors.green }}>
							<use
								xlinkHref={
									`/images/icons/sprite.svg#${opt.src_active}`
									// isViewAllObjects && but.id === 7 ? but.src_active : but.src
								}
							></use>
						</svg>
						<p className={styles.hover__text} style={{ right: 0 }}>
							{opt.hover_text}
						</p>
					</Button>
				))}
			</div>
		</div>
	);
};

export default Options;
