'use client';

import { ReactNode, createContext, useContext } from 'react';

import { useMapId } from '@/hooks/useMapId';

interface MapContextType {
	mapId: string | null;
	loading: boolean;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
	const mapId = useMapId();

	return (
		<MapContext.Provider value={{ mapId, loading: false }}>
			{children}
		</MapContext.Provider>
	);
}

export function useMapContext(): MapContextType {
	const context = useContext(MapContext);
	if (context === undefined) {
		throw new Error('useMapContext must be used within a MapProvider');
	}
	return context;
}
