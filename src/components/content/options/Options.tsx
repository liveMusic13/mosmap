import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { CSSProperties, FC, useCallback } from 'react';

import Button from '@/components/ui/button/Button';
import Line from '@/components/ui/line/Line';

import {
	useActiveAddObjectStore,
	useFiltersStore,
	useIdObjectInfoStore,
	useListOfObjectsStore,
	useObjectInfoStore,
} from '@/store/store';

import { srcStandard } from '@/utils/pathSvg';

import styles from './Options.module.scss';
import { TOKEN, colors } from '@/app.constants';
import { settingsArr, standardArr } from '@/data/options.data';

const Options: FC = () => {
	const router = useRouter();

	const isListOfObjects = useListOfObjectsStore(store => store.isListOfObjects);
	const { isFilters, setIsFilters } = useFiltersStore(store => store);
	const setIdObjectInfo = useIdObjectInfoStore(store => store.setIdObjectInfo);
	const setIsObjectInfo = useObjectInfoStore(store => store.setIsObjectInfo);
	const { isActiveAddObject, setIsActiveAddObject } = useActiveAddObjectStore(
		store => store,
	);

	const token = Cookies.get(TOKEN);

	const onClick = useCallback((id: number) => {
		if (id === 2) {
			useFiltersStore.setState(state => {
				if (!state.isFilters) {
					setIsActiveAddObject(false);
				}
				return {
					isFilters: !state.isFilters,
				};
			});
		} else if (id === 3) {
			useListOfObjectsStore.setState(state => ({
				isListOfObjects: !state.isListOfObjects,
			}));
		} else if (id === 4) {
			if (token) {
				useActiveAddObjectStore.setState(state => ({
					isActiveAddObject: !state.isActiveAddObject,
				}));
				setIdObjectInfo(0);
			} else {
				router.push('/auth');
			}
			// useFiltersStore.setState(state => ({
			// 	isFilters: !state.isFilters,
			// }));
		}
	}, []);

	const personActiveStyle = (id: number): CSSProperties | undefined => {
		if (id === 4) {
			return {
				color: isActiveAddObject ? colors.red : colors.green,
			};
		} else {
			return { color: colors.green };
		}
	};

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
						<svg className={styles.icon_svg} style={personActiveStyle(opt.id)}>
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
								xlinkHref={`/images/icons/sprite.svg#${opt.src_active}`}
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
