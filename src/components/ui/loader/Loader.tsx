import { CSSProperties, FC } from 'react';

import styles from './Loader.module.scss';
import { colors } from '@/app.constants';

const Loader: FC<{ width?: string; height?: string; style: CSSProperties }> = ({
	width,
	height,
	style,
}) => {
	return (
		<svg
			width={width}
			height={height}
			viewBox='0 0 50 50'
			className={styles.loader}
			style={style}
		>
			<circle
				cx='25'
				cy='25'
				r='20'
				fill='none'
				stroke={colors.green_light}
				strokeWidth='4'
				strokeDasharray='100'
				strokeDashoffset='50'
			>
				<animateTransform
					attributeName='transform'
					type='rotate'
					from='0 25 25'
					to='360 25 25'
					dur='3s'
					repeatCount='indefinite'
				/>
			</circle>
			<circle
				cx='25'
				cy='25'
				r='15'
				fill='none'
				stroke={colors.green}
				strokeWidth='4'
				strokeDasharray='75'
				strokeDashoffset='37.5'
			>
				<animateTransform
					attributeName='transform'
					type='rotate'
					from='360 25 25'
					to='0 25 25'
					dur='2s'
					repeatCount='indefinite'
				/>
			</circle>
			<circle
				cx='25'
				cy='25'
				r='10'
				fill='none'
				stroke={colors.green_middle}
				strokeWidth='4'
				strokeDasharray='50'
				strokeDashoffset='25'
			>
				<animateTransform
					attributeName='transform'
					type='rotate'
					from='0 25 25'
					to='360 25 25'
					dur='1.5s'
					repeatCount='indefinite'
				/>
			</circle>
		</svg>
	);
};

export default Loader;
