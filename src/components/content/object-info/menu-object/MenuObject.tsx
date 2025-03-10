import { useSearchParams } from 'next/navigation';
import { CSSProperties, FC, memo, useEffect } from 'react';

import Button from '@/components/ui/button/Button';

import {
	useCenterMapStore,
	useIdObjectInfoStore,
	useToggleViewAreaStore,
} from '@/store/store';

import { useGetDataMap } from '@/hooks/useGetDataMap';
import { useSaveObject } from '@/hooks/useSaveObject';

import styles from './MenuObject.module.scss';
import { colors } from '@/app.constants';
import { arrMenuObject } from '@/data/menuObject.data';

const MenuObject: FC = memo(() => {
	const searchParams = useSearchParams();
	//HELP: Преобразование searchParams в строку
	const queryString = new URLSearchParams(searchParams.toString()).toString();

	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);
	const setCenterMap = useCenterMapStore(store => store.setCenterMap);
	const { isViewArea, setIsViewArea } = useToggleViewAreaStore(store => store);

	const { refetch: refetch_getDataMap, data } = useGetDataMap(queryString);
	const { mutate, isSuccess: isSuccess_save } = useSaveObject();

	const findTargetObject = data?.points.find(el => el.id === idObjectInfo); //HELP: Находим объект таргета

	useEffect(() => {
		if (isSuccess_save) {
			refetch_getDataMap();

			const timeoutId = setTimeout(() => {
				setCenterMap([55.7522, 37.6156]); //TODO: Почему-то центр перемещается в случайное место на карте после обновления данных о маркерах в refetch_getDataMap. Поэтому это временное решение пока не найду в чем проблема
			}, 700);
			return () => clearTimeout(timeoutId);
		}
	}, [isSuccess_save]);

	const handleViewInMap = () => {
		//HELP: Изменяем центр карты, устанавливая центром координаты объекта таргета, тем самым находя его на карте
		if (findTargetObject && findTargetObject.crd)
			setCenterMap(findTargetObject?.crd);
	};
	const handleSetNewCrd = () => {
		if (findTargetObject && findTargetObject.crd) {
			mutate({ ...findTargetObject, crd: [null, null] });
		}
	};
	const handleViewArea = () => setIsViewArea(!isViewArea);
	const onClick = (id: number) => {
		if (id === 0) {
			handleViewInMap();
			console.log('handleViewInMap');
		} else if (id === 1) {
			handleSetNewCrd();
		} else if (id === 2) {
			handleViewArea();
		}
	};

	const personActiveStyle = (id: number): CSSProperties | undefined => {
		if (id === 2) {
			return {
				color: isViewArea ? colors.red : colors.green,
			};
		} else {
			return { color: colors.green };
		}
	};

	return (
		<div className={styles.block__menu}>
			{arrMenuObject.map(el => (
				<Button
					key={el.id}
					style={{
						width: 'calc(47/1920*100vw)',
						height: 'calc(38/1920*100vw)',
						boxShadow: `0px 2px calc(15/1920*100vw) ${colors.grey_middle}`,
						backgroundColor: 'transparent',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
					}}
					onClick={() => onClick(el.id)}
				>
					<svg className={styles.icon_svg} style={personActiveStyle(el.id)}>
						<use xlinkHref={`/images/icons/sprite.svg#${el.src}`}></use>
					</svg>
					<p
						className={styles.hover__text}
						style={el.id > 2 ? { right: 0 } : { left: 0 }} //HELP: чтобы последних 2 элемента не скрывались за границами блока
					>
						{el.hover_text}
					</p>
				</Button>
			))}
		</div>
	);
});

export default MenuObject;
