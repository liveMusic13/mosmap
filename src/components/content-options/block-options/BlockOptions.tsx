'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

import Button from '@/components/ui/button/Button';

import { IBlockOptions } from '@/types/props.types';

import styles from './BlockOptions.module.scss';
import ExportOptions from './export-options/ExportOptions';
import ImportDoneOptions from './import-done-options/ImportDoneOptions';
import ImportOptions from './import-options/ImportOptions';

//TODO: Доделать опции для импорта
const BlockOptions: FC<IBlockOptions> = () => {
	const pathname = usePathname();
	const router = useRouter();
	const title_text =
		pathname === '/import'
			? 'Отправка данных на сервер'
			: pathname === '/export'
				? 'Выгрузка данных'
				: pathname === '/import/done'
					? 'Настройка данных для загрузки на сервер'
					: '';

	console.log('pathname', pathname);

	const handleBack = () => router.back();

	return (
		<div className={styles.wrapper_options}>
			<div className={styles.block__title}>
				<h2 className={styles.title}>{title_text}</h2>
				<Button onClick={handleBack}>
					{pathname === '/import/done' ? 'Назад' : 'На карту'}
				</Button>
			</div>
			<div className={styles.line}></div>
			<div className={styles.block__content}>
				{pathname === '/import' && <ImportOptions />}
				{pathname === '/export' && <ExportOptions />}
				{pathname === '/import/done' && <ImportDoneOptions />}
			</div>
		</div>
	);
};

export default BlockOptions;
