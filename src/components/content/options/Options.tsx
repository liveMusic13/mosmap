'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CSSProperties, FC, useCallback } from 'react';

import Button from '@/components/ui/button/Button';
import Line from '@/components/ui/line/Line';

import {
	useColorsIntervalStore,
	// useFiltersStore,
	useIdObjectInfoStore,
	useListOfObjectsStore,
	useViewStore,
} from '@/store/store';

import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useGetDataMap } from '@/hooks/useGetDataMap';

import { checkMapAccess } from '@/utils/jwtTokenDecoder';
import { srcStandard } from '@/utils/pathSvg';
import { getQueryString } from '@/utils/url';

import styles from './Options.module.scss';
import { colors } from '@/app.constants';
import { settingsArr, standardArr } from '@/data/options.data';

const Options: FC = () => {
	// const map = Cookies.get(ACTUAL_MAP);

	const router = useRouter();
	const searchParams = useSearchParams();
	// //HELP: Преобразование searchParams в строку
	// const queryString = new URLSearchParams(searchParams.toString()).toString();

	// const resultQuery = map ? `?map=${map}${queryString}` : queryString;
	// const pathname = usePathname(); // "/map/renovation"
	// const searchParams = useSearchParams();
	const queryString = getQueryString(searchParams); // включает map параметр

	// const seoUrl = pathname.startsWith('/map/')
	// 	? pathname.split('/map/')[1]
	// 	: null;

	// const queryString = searchParams.toString();

	// const resultQuery = seoUrl
	// 	? `?url=${seoUrl}&${queryString}`
	// 	: `?${queryString}`;

	const { data: dataMap } = useGetDataMap(queryString);

	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;

	const { isColorIntervalMobile, setIsColorIntervalMobile, isColorInterval } =
		useColorsIntervalStore(store => store);
	const isListOfObjects = useListOfObjectsStore(store => store.isListOfObjects);
	// const isFilters = useFiltersStore(store => store.isFilters);
	const view = useViewStore(store => store.view);
	const openView = useViewStore(store => store.openView);
	const closeView = useViewStore(store => store.closeView);

	const setIdObjectInfo = useIdObjectInfoStore(store => store.setIdObjectInfo);

	// const token = Cookies.get(TOKEN);
	// const token = hasMapAccess(Number(map));
	// Number(map)
	const token = checkMapAccess(dataMap?.map || null).hasMapAccess;

	const onClick = useCallback(
		(id: number) => {
			if (id === 0) {
				if (token) {
					router.push(`/import?${queryString}`);
				} else {
					router.push(`/auth`);
				}
			} else if (id === 1) {
				if (token) {
					router.push(`/export?${queryString}`);
				} else {
					router.push(`/auth`);
				}
			} else if (id === 2) {
				if (windowSize <= 767) {
					router.push(`/mobile-filters/filters/?${queryString}`);
				} else {
					// useFiltersStore.setState(state => {
					// 	if (!state.isFilters) {
					// 		setIsActiveAddObject(false);
					// 	}
					// 	return {
					// 		isFilters: !state.isFilters,
					// 	};
					// });
					if (view === 'filters') {
						closeView();
					} else {
						openView('filters');
					}
				}
			} else if (id === 3) {
				if (windowSize <= 767) {
					router.push(`/mobile-filters/list-of-objects/?${queryString}`);
				} else {
					useListOfObjectsStore.setState(state => ({
						isListOfObjects: !state.isListOfObjects,
					}));
				}
			} else if (id === 4) {
				if (token) {
					// useActiveAddObjectStore.setState(state => ({
					// 	isActiveAddObject: !state.isActiveAddObject,
					// }));
					if (view === 'addObject') {
						closeView();
					} else {
						openView('addObject');
					}
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
						router.push(`/mobile-filters/color-interval?${queryString}`);
					}
				} else {
					useColorsIntervalStore.setState(state => ({
						isColorInterval: !state.isColorInterval,
					}));
				}
			}
		},
		[isMobile, isColorInterval, isColorIntervalMobile, view],
	);
	const handleClick = useCallback((id: number) => {
		// if (token) {
		if (id === 5) {
			router.push(`/settings-database?${queryString}`);
		}
		// } else {
		// router.push(`/auth`);
		// }
	}, []);

	const personActiveStyle = (id: number): CSSProperties | undefined => {
		if (id === 4) {
			return {
				color: view === 'addObject' ? colors.red : colors.green,
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
				{standardArr.map(opt => {
					const isDisabled =
						((opt.id === 0 || opt.id === 1) && !token) ||
						(opt.id === 4 && (!token || view !== 'objectInfo'));

					return (
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
							disabled={isDisabled}
						>
							<svg
								className={styles.icon_svg}
								style={personActiveStyle(opt.id)}
							>
								<use
									xlinkHref={srcStandard(
										opt,
										isListOfObjects,
										view === 'filters',
									)}
								></use>
							</svg>
							<p className={styles.hover__text} style={{ left: 0 }}>
								{opt.hover_text}
							</p>
						</Button>
					);
				})}
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
						disabled={!token}
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
