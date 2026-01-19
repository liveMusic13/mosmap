'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, Suspense, createContext, useContext } from 'react';

interface MapContextType {
	mapId: string | null;
	loading: boolean;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

function MapProviderContent({ children }: { children: ReactNode }) {
	// Импортируем хук только здесь, внутри Suspense
	const { useMapId } = require('@/hooks/useMapId');
	const mapId = useMapId();

	return (
		<MapContext.Provider value={{ mapId, loading: false }}>
			{children}
		</MapContext.Provider>
	);
}

export function MapProvider({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	// Не используем MapContext на страницах где он не нужен
	if (pathname === '/_not-found' || pathname.startsWith('/404')) {
		return <>{children}</>;
	}

	return (
		<Suspense
			fallback={
				<MapContext.Provider value={{ mapId: null, loading: true }}>
					{children}
				</MapContext.Provider>
			}
		>
			<MapProviderContent>{children}</MapProviderContent>
		</Suspense>
	);
}

export function useMapContext(): MapContextType {
	const context = useContext(MapContext);
	if (context === undefined) {
		// Возвращаем дефолтные значения вместо ошибки
		return { mapId: null, loading: false };
	}
	return context;
}
