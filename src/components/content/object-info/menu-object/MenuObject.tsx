import Cookies from 'js-cookie';
import { LatLngExpression } from 'leaflet';
import { useSearchParams } from 'next/navigation';
import { CSSProperties, FC, memo } from 'react';

import Button from '@/components/ui/button/Button';

import {
	useCenterMapStore,
	useIdObjectInfoStore,
	usePopupStore,
	useToggleViewAreaStore,
} from '@/store/store';

import { useCheckWidth } from '@/hooks/useCheckWidth';
import { useGetDataMap } from '@/hooks/useGetDataMap';

import styles from './MenuObject.module.scss';
import { TOKEN, colors } from '@/app.constants';
import { arrMenuObject } from '@/data/menuObject.data';

const MenuObject: FC = memo(() => {
	const token = Cookies.get(TOKEN);
	const windowSize = useCheckWidth();
	const isMobile = windowSize <= 767;
	const isMobile_mini = windowSize <= 481;
	const searchParams = useSearchParams();
	//HELP: Преобразование searchParams в строку
	const queryString = new URLSearchParams(searchParams.toString()).toString();

	const idObjectInfo = useIdObjectInfoStore(store => store.idObjectInfo);
	const setCenterMap = useCenterMapStore(store => store.setCenterMap);
	const { isViewArea, setIsViewArea } = useToggleViewAreaStore(store => store);
	const { setIsPopup, setMessageInPopup } = usePopupStore(store => store);

	const { data } = useGetDataMap(queryString);

	const findTargetObject = data?.points.find(el => el.id === idObjectInfo); //HELP: Находим объект таргета

	const handleViewInMap = () => {
		//HELP: Изменяем центр карты, устанавливая центром координаты объекта таргета, тем самым находя его на карте
		if (findTargetObject && findTargetObject.crd)
			setCenterMap(findTargetObject?.crd as LatLngExpression);
	};

	const handleViewArea = () => setIsViewArea(!isViewArea);
	const onClick = (id: number) => {
		if (id === 0) {
			handleViewInMap();
			console.log('handleViewInMap');
		} else if (id === 1) {
			setMessageInPopup('Вы хотите удалить или переместить маркер?');
			setIsPopup(true);
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
						width: isMobile_mini
							? 'calc(64/360*100vw)'
							: isMobile
								? 'calc(64/480*100vw)'
								: 'calc(47/1920*100vw)',
						height: isMobile_mini
							? 'calc(42/360*100vw)'
							: isMobile
								? 'calc(42/480*100vw)'
								: 'calc(38/1920*100vw)',
						boxShadow: `0px 2px calc(15/${isMobile_mini ? 360 : isMobile ? 480 : 1920}*100vw) ${colors.grey_middle}`,
						backgroundColor: 'transparent',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
					}}
					onClick={() => onClick(el.id)}
					disabled={!token && el.id === 1}
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
