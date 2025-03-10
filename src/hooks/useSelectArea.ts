import { useMapLayersStore } from '@/store/store';

export const useSelectArea = () => {
	const { setIndexTargetPolygon, addPolygon, deletePolygon } =
		useMapLayersStore(store => store);

	const _onCreated = (e: any) => {
		console.log(e);

		const { layerType, layer } = e;
		if (layerType === 'polygon') {
			const { _leaflet_id } = layer;

			layer.on('click', () => setIndexTargetPolygon(_leaflet_id));

			addPolygon({ id: _leaflet_id, latLngs: layer.getLatLngs()[0] });
		}
	};
	const _onDeleted = (e: any) => {
		console.log(e);

		const {
			layers: { _layers },
		} = e;

		Object.values(_layers).map(({ _leaflet_id }: any) =>
			deletePolygon(_leaflet_id),
		);
	};

	return {
		_onCreated,
		_onDeleted,
	};
};
