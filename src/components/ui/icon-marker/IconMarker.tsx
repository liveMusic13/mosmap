import { FC } from 'react';

import { IIconMarker } from '@/types/props.types';

const IconMarker: FC<IIconMarker> = ({ mark, size }) => {
	return (
		<svg
			style={{
				width: `${size[0]}px`,
				height: `${size[1]}px`,
				color: `${mark.color ? mark.color : ''}`,
			}}
		>
			<use xlinkHref={`/images/icons/sprite.svg#${mark.icon}`}></use>
		</svg>
	);
};

export default IconMarker;
