// import Link from 'next/link';
// import { FC, memo } from 'react';
// import { IInfoZone } from '@/types/props.types';
// import styles from './InfoZone.module.scss';
// const InfoZone: FC<IInfoZone> = memo(({ value_info }) => {
// 	console.log('value_info', value_info);
// 	return (
// 		<div className={styles.wrapper_info}>
// 			<h4 className={styles.title}>{value_info.name}</h4>
// 			{value_info.href ? (
// 				<p className={styles.description}>
// 					<Link
// 						href={value_info.href}
// 						target='_blank'
// 						rel='nofollow'
// 						className={styles.link}
// 					>
// 						{value_info.value}
// 					</Link>
// 				</p>
// 			) : (
// 				<p className={styles.description}>{value_info.value || 'Нет данных'}</p>
// 			)}
// 		</div>
// 	);
// });
// export default InfoZone;
import Link from 'next/link';
import { FC, memo, useMemo } from 'react';

import { IInfoZone } from '@/types/props.types';

import styles from './InfoZone.module.scss';

const InfoZone: FC<IInfoZone> = memo(({ value_info }) => {
	const linkData = useMemo(() => {
		if (!value_info.href) return null;

		const href = value_info.href.trim();

		// Проверка на email
		if (href.includes('@') || href.toLowerCase().startsWith('mailto:')) {
			return {
				href: href.startsWith('mailto:') ? href : `mailto:${href}`,
				isExternal: false,
			};
		}

		// Проверка на телефон
		if (/^[\d\s+()-]+$/.test(href) || href.toLowerCase().startsWith('tel:')) {
			return {
				href: href.startsWith('tel:') ? href : `tel:${href.replace(/\s/g, '')}`,
				isExternal: false,
			};
		}

		// Обычная ссылка
		return {
			href: href,
			isExternal: true,
		};
	}, [value_info.href]);

	return (
		<div className={styles.wrapper_info}>
			<h4 className={styles.title}>{value_info.name}</h4>
			{linkData ? (
				<p className={styles.description}>
					<Link
						href={linkData.href}
						{...(linkData.isExternal && {
							target: '_blank',
							rel: 'nofollow',
						})}
						className={styles.link}
					>
						{value_info.value}
					</Link>
				</p>
			) : (
				<p className={styles.description}>{value_info.value || 'Нет данных'}</p>
			)}
		</div>
	);
});

export default InfoZone;
