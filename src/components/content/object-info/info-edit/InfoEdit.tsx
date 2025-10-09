// import { ChangeEvent, FC } from 'react';
// import { IInfoEdit } from '@/types/props.types';
// import styles from './InfoEdit.module.scss';
// const InfoEdit: FC<IInfoEdit> = ({ value_info, callback }) => {
// 	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
// 		callback({ label: value_info.label, value: e.target.value });
// 	};
// 	return (
// 		<div className={styles.wrapper_infoEdit}>
// 			<h4 className={styles.title}>{value_info.label}</h4>
// 			<input
// 				type='text'
// 				className={styles.description}
// 				value={value_info.value || ''}
// 				onChange={onChange}
// 			/>
// 		</div>
// 	);
// };
// export default InfoEdit;
import Link from 'next/link';
import { ChangeEvent, FC, useMemo } from 'react';

import { IInfoEdit } from '@/types/props.types';

import styles from './InfoEdit.module.scss';

const InfoEdit: FC<IInfoEdit> = ({ value_info, callback }) => {
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		callback({ label: value_info.label, value: e.target.value });
	};

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
		<div className={styles.wrapper_infoEdit}>
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
				<input
					type='text'
					className={styles.description}
					value={value_info.value || ''}
					onChange={onChange}
				/>
			)}
		</div>
	);
};

export default InfoEdit;
