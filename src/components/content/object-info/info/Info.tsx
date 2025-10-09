import Link from 'next/link';
import { FC, memo, useMemo } from 'react';

import { IInfo } from '@/types/props.types';

import styles from './Info.module.scss';

const Info: FC<IInfo> = memo(({ value_info }) => {
	const linkData = useMemo(() => {
		if (!value_info.value) return null;

		const value = String(value_info.value).trim();

		// Проверка на email
		if (value.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			return {
				href: `mailto:${value}`,
				display: value,
				isExternal: false,
			};
		}

		// Проверка на телефон
		if (/^[\d\s+()-]+$/.test(value) && value.replace(/\D/g, '').length >= 10) {
			return {
				href: `tel:${value.replace(/\s/g, '')}`,
				display: value,
				isExternal: false,
			};
		}

		// Проверка на URL
		if (
			value.match(/^(https?:\/\/)/) ||
			value.match(/^www\./) ||
			value.match(/\.[a-z]{2,}(\/|$)/i)
		) {
			const href = value.startsWith('http') ? value : `https://${value}`;
			return {
				href: href,
				display: value,
				isExternal: true,
			};
		}

		return null;
	}, [value_info.value]);

	return (
		<div className={styles.wrapper_info}>
			<h4 className={styles.title}>{value_info.label}</h4>
			{linkData ? (
				<p className={styles.description}>
					<Link
						href={linkData.href}
						{...(linkData.isExternal && {
							target: '_blank',
							rel: 'nofollow noopener noreferrer',
						})}
						className={styles.link}
					>
						{linkData.display}
					</Link>
				</p>
			) : (
				<p className={styles.description}>{value_info.value || 'Нет данных'}</p>
			)}
		</div>
	);
});

export default Info;
