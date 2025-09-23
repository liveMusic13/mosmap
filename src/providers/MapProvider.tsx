// 'use client';

// import { ReactNode, Suspense, createContext, useContext } from 'react';

// import { useMapId } from '@/hooks/useMapId';

// interface MapContextType {
// 	mapId: string | null;
// 	loading: boolean;
// }

// const MapContext = createContext<MapContextType | undefined>(undefined);

// export function MapProvider({ children }: { children: ReactNode }) {
// 	const mapId = useMapId();

// 	return (
// 		<Suspense fallback={null}>
// 			<MapContext.Provider value={{ mapId, loading: false }}>
// 				{children}
// 			</MapContext.Provider>
// 		</Suspense>
// 	);
// }

// export function useMapContext(): MapContextType {
// 	const context = useContext(MapContext);
// 	if (context === undefined) {
// 		throw new Error('useMapContext must be used within a MapProvider');
// 	}
// 	return context;
// }

'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, Suspense, createContext, useContext } from 'react';

// 'use client';

// import { ReactNode, Suspense, createContext, useContext } from 'react';

// import { useMapId } from '@/hooks/useMapId';

// interface MapContextType {
// 	mapId: string | null;
// 	loading: boolean;
// }

// const MapContext = createContext<MapContextType | undefined>(undefined);

// export function MapProvider({ children }: { children: ReactNode }) {
// 	const mapId = useMapId();

// 	return (
// 		<Suspense fallback={null}>
// 			<MapContext.Provider value={{ mapId, loading: false }}>
// 				{children}
// 			</MapContext.Provider>
// 		</Suspense>
// 	);
// }

// export function useMapContext(): MapContextType {
// 	const context = useContext(MapContext);
// 	if (context === undefined) {
// 		throw new Error('useMapContext must be used within a MapProvider');
// 	}
// 	return context;
// }

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
