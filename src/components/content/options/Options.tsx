import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';
import { CSSProperties, FC, useCallback } from 'react';

import Button from '@/components/ui/button/Button';
import Line from '@/components/ui/line/Line';

import {
	useActiveAddObjectStore,
	useColorsIntervalStore,
	useFiltersStore,
	useIdObjectInfoStore,
	useListOfObjectsStore,
} from '@/store/store';

import { useCheckWidth } from '@/hooks/useCheckWidth';

import { srcStandard } from '@/utils/pathSvg';

import styles from './Options.module.scss';
import { TOKEN, colors } from '@/app.constants';
import { settingsArr, standardArr } from '@/data/options.data';

const Options: FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;

	const { isColorIntervalMobile, setIsColorIntervalMobile, isColorInterval } =
		useColorsIntervalStore(store => store);
	const isListOfObjects = useListOfObjectsStore(store => store.isListOfObjects);
	const isFilters = useFiltersStore(store => store.isFilters);
	const setIdObjectInfo = useIdObjectInfoStore(store => store.setIdObjectInfo);
	const { isActiveAddObject, setIsActiveAddObject } = useActiveAddObjectStore(
		store => store,
	);

	const token = Cookies.get(TOKEN);

	const onClick = useCallback(
		(id: number) => {
			if (id === 0) {
				router.push(`/import?map=${map}`);
			} else if (id === 1) {
				router.push(`/export?map=${map}`);
			} else if (id === 2) {
				if (windowSize <= 767) {
					router.push(`/mobile-filters/filters/?map=${map}`);
				} else {
					useFiltersStore.setState(state => {
						if (!state.isFilters) {
							setIsActiveAddObject(false);
						}
						return {
							isFilters: !state.isFilters,
						};
					});
				}
			} else if (id === 3) {
				if (windowSize <= 767) {
					router.push(`/mobile-filters/list-of-objects/?map=${map}`);
				} else {
					useListOfObjectsStore.setState(state => ({
						isListOfObjects: !state.isListOfObjects,
					}));
				}
			} else if (id === 4) {
				if (token) {
					useActiveAddObjectStore.setState(state => ({
						isActiveAddObject: !state.isActiveAddObject,
					}));
					setIdObjectInfo(0);
				} else {
					router.push('/auth');
				}
			} else if (id === 7) {
				if (isMobile) {
					//HELP: В мобильной версии проверяем, если закраска включена, то нажатие на иконку выключит. А если выключена закраска, то сразу перекинет на страницу где отобразятся настройки закраски
					if (isColorIntervalMobile) {
						setIsColorIntervalMobile(false);
					} else {
						router.push(`/mobile-filters/color-interval?map=${map}`);
					}
				} else {
					useColorsIntervalStore.setState(state => ({
						isColorInterval: !state.isColorInterval,
					}));
				}
			}
		},
		[isMobile, isColorInterval, isColorIntervalMobile],
	);
	const handleClick = useCallback((id: number) => {
		if (id === 5) {
			router.push(`/settings-database?map=${map}`);
		}
	}, []);

	const personActiveStyle = (id: number): CSSProperties | undefined => {
		if (id === 4) {
			return {
				color: isActiveAddObject ? colors.red : colors.green,
			};
		} else if (id === 7) {
			return {
				color:
					isColorInterval || isColorIntervalMobile ? colors.red : colors.green,
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
						onClick={() => handleClick(opt.id)}
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
