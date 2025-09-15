'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, forwardRef, useImperativeHandle, useRef, useState } from 'react';

import BackgroundOpacity from '@/components/ui/background-opacity/BackgroundOpacity';
import Button from '@/components/ui/button/Button';
import Popup from '@/components/ui/popup/Popup';

import { IBlockOptions } from '@/types/props.types';

import { usePopupStore } from '@/store/store';

import styles from './BlockOptions.module.scss';
import DatabaseOptions from './database-options/DataBaseOptions';
import ExportOptions from './export-options/ExportOptions';
import ImportDoneOptions from './import-done-options/ImportDoneOptions';
import ImportOptions from './import-options/ImportOptions';
import SettingsOptions from './settings-options/SettingsOptions';

const BlockOptions: FC<IBlockOptions> = forwardRef((_, ref) => {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const map = searchParams.get('map');
	const router = useRouter();
	const title_text =
		pathname === '/import'
			? 'Отправка данных на сервер'
			: pathname === '/export'
				? 'Выгрузка данных'
				: pathname === '/import/done'
					? 'Настройка данных для загрузки на сервер'
					: pathname === '/settings-map'
						? 'Настройка карты'
						: pathname === '/settings-database'
							? 'Настройка базы данных'
							: '';

	const pendingActionRef = useRef<'back' | 'toSettings' | 'toDB' | null>(null);
	const isPopup = usePopupStore(store => store.isPopup);
	const setIsPopup = usePopupStore(store => store.setIsPopup);
	const setMessageInPopup = usePopupStore(store => store.setMessageInPopup);
	const messageInPopup = usePopupStore(store => store.messageInPopup);
	const [isDirty, setIsDirty] = useState(false);
	const [saveFn, setSaveFn] = useState<(() => Promise<void>) | null>(null);

	const attemptNavigateBack = () => {
		console.log('click');

		if (isDirty && saveFn) {
			pendingActionRef.current = 'back';
			setMessageInPopup(
				'У вас есть несохранённые изменения. Сохранить перед выходом?',
			);
			setIsPopup(true);
		} else {
			router.back();
		}
	};

	const attemptNavigateToSettings = () => {
		if (isDirty && saveFn) {
			pendingActionRef.current = 'toSettings';
			setMessageInPopup(
				'У вас есть несохранённые изменения. Сохранить перед выходом?',
			);
			setIsPopup(true);
		} else {
			router.push(`/settings-map?map=${map}`);
		}
	};

	const onConfirm = async () => {
		setIsPopup(false);
		if (saveFn) {
			await saveFn(); // сохраняем
		}

		// дальше смотрим, куда нам переходить
		if (pendingActionRef.current === 'back') {
			router.back();
		} else if (pendingActionRef.current === 'toSettings') {
			router.push(`/settings-map?map=${map}`);
		}

		pendingActionRef.current = null;
	};

	const onCancel = () => {
		setIsPopup(false);
		if (pendingActionRef.current === 'back') {
			router.back();
		} else if (pendingActionRef.current === 'toSettings') {
			router.push(`/settings-map?map=${map}`);
		} else if (pendingActionRef.current === 'toDB') {
			router.push(`/settings-database`);
		}
		pendingActionRef.current = null;
	};

	// 👇 Делаем метод доступным наружу
	useImperativeHandle(ref, () => ({
		attemptNavigateBack,
	}));

	return (
		<div className={styles.wrapper_options}>
			<div className={styles.block__title}>
				<h2 className={styles.title}>{title_text}</h2>
				<Button onClick={attemptNavigateBack}>
					{pathname === '/import/done' || pathname === '/settings-map'
						? 'Назад'
						: 'На карту'}
				</Button>
			</div>
			<div className={styles.line}></div>
			<div className={styles.block__content}>
				{pathname === '/import' && <ImportOptions />}
				{pathname === '/export' && <ExportOptions />}
				{pathname === '/import/done' && <ImportDoneOptions />}
				{pathname === '/settings-map' && (
					<SettingsOptions
						onDirtyChange={setIsDirty}
						provideSave={fn => setSaveFn(() => fn)}
					/>
				)}
				{pathname === '/settings-database' && (
					<DatabaseOptions
						onDirtyChange={setIsDirty}
						provideSave={fn => setSaveFn(() => fn)}
						onNavigateSettings={attemptNavigateToSettings}
					/>
				)}
			</div>
			{isPopup && (
				<>
					<BackgroundOpacity />
					<Popup
						message={messageInPopup}
						isConfirm={true}
						functions={{ confirm: onConfirm, cancel: onCancel }}
					/>
				</>
			)}
		</div>
	);
});

export default BlockOptions;
