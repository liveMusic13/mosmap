import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';

import Loader from '@/components/ui/loader/Loader';
import RangeInterval from '@/components/ui/range-interval/RangeInterval';

import {
	IColorIntervalResponse,
	IIntervalObject,
} from '@/types/requestData.types';

import { useSuccessSaveColorsIntervalStore } from '@/store/store';

import { useGetColorInterval } from '@/hooks/useGetColorInterval';
import { useGetColorMap } from '@/hooks/useGetColorMap';

import styles from './ColorInterval.module.scss';
import BlockIntervalParam from './block-interval-param/BlockIntervalParam';

const ColorInterval: FC = () => {
	const searchParams = useSearchParams();
	const map = searchParams.get('map');

	const { data, isLoading, isSuccess } = useGetColorInterval(map);

	const [isValidTargetValues, setIsValidTargetValues] =
		useState<boolean>(false);
	const [isViewFieldSelect, setIsViewFieldSelect] = useState<boolean>(true);
	const [isViewInputsInterval, setIsViewInputsInterval] =
		useState<boolean>(true);
	const [intervalsObject, setIntervalsObject] =
		useState<IIntervalObject | null>(null);
	const [queryParams, setQueryParams] = useState({
		sloi: '',
		mode: '',
		field_id: '',
	});

	const ranges_color_map = useSuccessSaveColorsIntervalStore(
		store => store.ranges_color_map,
	);

	const { isLoading: isLoading_color_map } = useGetColorMap(
		map,
		queryParams.sloi,
		queryParams.mode,
		queryParams.field_id,
		ranges_color_map,
	);

	useEffect(() => {
		//HELP: Получение значений из query параметров
		if (isSuccess) {
			const sloiValue = searchParams.get('Слой карты');
			const modeValue = searchParams.get('Способ раскраски');
			const numFieldValue = searchParams.get('Числовое поле');

			if (sloiValue && modeValue && numFieldValue) {
				setQueryParams({
					sloi: sloiValue,
					mode: modeValue,
					field_id: numFieldValue,
				});
				//HELP: Проверка совпадения с id в соответствующих массивах
				const isSloiValid = (data as IColorIntervalResponse).sloi_fields?.some(
					field => field.id === Number(sloiValue),
				);
				const isModeValid = (data as IColorIntervalResponse).mode_list?.some(
					mode => mode.id === Number(modeValue),
				);
				const isNumFieldValid = (
					data as IColorIntervalResponse
				).num_fields?.some(field => field.id === Number(numFieldValue));

				if (isSloiValid && isModeValid && isNumFieldValid) {
					setIsValidTargetValues(true);
				} else {
					setIsValidTargetValues(false);
				}

				//HELP:Здесь проверяем будет ли виден 3 селект
				const isViewSelect = Number(modeValue) === 0;
				if (isViewSelect) {
					setIsViewFieldSelect(false);
				} else {
					setIsViewFieldSelect(true);
				}
				//HELP:Здесь проверяем будут ли видны инпуты
				const isViewInputs = Number(modeValue) === 1 || Number(modeValue) === 3;
				if (isViewInputs) {
					setIsViewInputsInterval(false);
				} else {
					setIsViewInputsInterval(true);
				}

				//HELP: Ищем есть ли объект с интервалами для выбранных настроек в селекте. Если есть добавляем его в стейт
				const objectTargetInData = (
					data as IColorIntervalResponse
				).intervals.find(
					el =>
						el.field_id === Number(numFieldValue) &&
						el.sloi === Number(sloiValue) &&
						el.type === Number(modeValue),
				);
				if (objectTargetInData) {
					setIntervalsObject(objectTargetInData);
				}
			}
		}
	}, [searchParams.toString(), data, isSuccess]);

	return (
		<div className={styles.wrapper_colorInterval}>
			<div className={styles.block__title}>
				<h2 className={styles.title}>Закрасить районы</h2>
			</div>
			<div className={styles.block__content}>
				{isLoading && (
					<Loader
						style={{
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}
					/>
				)}
				{isSuccess && (
					<>
						<BlockIntervalParam
							title='Слой карты'
							absoluteOptionsForSelect={false}
							// targetValue={
							// 	(data as IColorIntervalResponse).sloi_fields.find(
							// 		el =>
							// 			Number(el.id) ===
							// 			Number((data as IColorIntervalResponse).current_sloi),
							// 	)?.name || (data as IColorIntervalResponse).sloi_fields[0].name
							// }
							targetValue={
								(data as IColorIntervalResponse)?.sloi_fields.find(
									el =>
										Number(el.id) ===
										Number((data as IColorIntervalResponse)?.current_sloi),
								)?.name || 'Выберите значение'
							}
							options={(data as IColorIntervalResponse)?.sloi_fields || []}
						/>
						<BlockIntervalParam
							title='Способ раскраски'
							absoluteOptionsForSelect={false}
							// targetValue={
							// 	(data as IColorIntervalResponse).mode_list.find(
							// 		el =>
							// 			Number(el.id) ===
							// 			Number((data as IColorIntervalResponse).current_mode),
							// 	)?.name || (data as IColorIntervalResponse).mode_list[0].name
							// }
							targetValue={
								(data as IColorIntervalResponse)?.mode_list.find(
									el =>
										Number(el.id) ===
										Number((data as IColorIntervalResponse)?.current_mode),
								)?.name || 'Выберите значение'
							}
							options={(data as IColorIntervalResponse)?.mode_list || []}
						/>
						{isViewFieldSelect && (
							<BlockIntervalParam
								title='Числовое поле'
								absoluteOptionsForSelect={false}
								// targetValue={
								// 	(data as IColorIntervalResponse).num_fields.find(
								// 		el =>
								// 			Number(el.id) ===
								// 			Number((data as IColorIntervalResponse).current_field),
								// 	)?.name || (data as IColorIntervalResponse).num_fields[0].name
								// }
								targetValue={
									(data as IColorIntervalResponse)?.num_fields.find(
										el =>
											Number(el.id) ===
											Number((data as IColorIntervalResponse)?.current_field),
									)?.name || 'Выберите значение'
								}
								options={(data as IColorIntervalResponse)?.num_fields || []}
							/>
						)}
						{isValidTargetValues && intervalsObject && (
							<RangeInterval
								intervalsObject={intervalsObject}
								isViewInputsInterval={isViewInputsInterval}
								isViewFieldSelect={isViewFieldSelect}
							/>
						)}
					</>
				)}
				{isLoading_color_map && (
					<Loader
						style={{
							width: 'calc(50/1920*100vw)',
							height: 'calc(50/1920*100vw)',
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default ColorInterval;
