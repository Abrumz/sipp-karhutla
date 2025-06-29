'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { apiV2URL } from '@/api';
import InfoWindowContent from './InfoWindowContent';
import { TileLayer, Marker, Popup, useMap, useMapEvent, MapContainer } from 'react-leaflet';
import L from 'leaflet';

interface MapContainerProps {
	center: {
		lat: number;
		lng: number;
	};
	zoom: number;
	spots: any[];
	isLoggedin: boolean;
	spotToFocus: any | null;
	showInfoWindow?: boolean;
	patroliData?: any;
	onCloseInfoWindow?: () => void;
}

const MapLoading = () => (
	<div className="flex items-center justify-center bg-gray-50 rounded-xl h-full">
		<div className="text-center">
			<div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
			<p className="mt-4 text-black-600">Loading map...</p>
		</div>
	</div>
);

const LeafletMap = ({
	center,
	zoom,
	spots,
	isLoggedin,
	spotToFocus,
	showInfoWindow = false,
	patroliData = null,
	onCloseInfoWindow
}: MapContainerProps) => {
	const [selectedSpot, setSelectedSpot] = useState<any | null>(null);
	const [mapCenter, setMapCenter] = useState<[number, number]>([center.lat, center.lng]);
	const [currentZoom, setCurrentZoom] = useState<number>(zoom);
	const [activeBaseMap, setActiveBaseMap] = useState<string>("street");
	const mapRef = useRef<any>(null);
	const markerRefs = useRef<{ [key: string]: any }>({});
	const mapContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
			shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
			iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png'
		});
	}, []);

	useEffect(() => {
		if (typeof document !== 'undefined') {
			const handleFullScreenChange = () => {
				if (mapRef.current) {
					setTimeout(() => mapRef.current.invalidateSize(), 100);
				}
			};
			document.addEventListener('fullscreenchange', handleFullScreenChange);
			const style = document.createElement('style');
			style.innerHTML = `
				.leaflet-popup-content-wrapper { max-height: 80vh; overflow-y: auto; }
				.leaflet-popup { margin-bottom: 0px; }
				.spot-popup .leaflet-popup-content { margin: 8px; padding: 0; }
				.custom-marker { display: block !important; }
				.leaflet-div-icon { background: transparent !important; border: none !important; }
				.leaflet-marker-icon { margin-left: 0 !important; margin-top: 0 !important; }
				.nav-to-marker-btn {
					display: block; width: 100%; padding: 8px 12px; margin-top: 10px;
					background-color: #3b82f6; color: white; border: none; border-radius: 4px;
					font-weight: 500; cursor: pointer; transition: background-color 0.2s;
				}
				.nav-to-marker-btn:hover { background-color: #2563eb; }
			`;
			document.head.appendChild(style);
			return () => {
				document.removeEventListener('fullscreenchange', handleFullScreenChange);
				if (document.head.contains(style)) {
					document.head.removeChild(style);
				}
			};
		}
	}, []);

	const navigateToMarker = useCallback((spot: any) => {
		const lat = parseFloat(spot.latitude || spot.lat);
		const lng = parseFloat(spot.longitude || spot.lon);
		if (!isNaN(lat) && !isNaN(lng) && mapRef.current) {
			const targetZoom = Math.max(15, mapRef.current.getZoom());
			const offsetLat = lat - 0.0005;
			mapRef.current.setView([offsetLat, lng], targetZoom, {
				animate: true, duration: 1.2, easeLinearity: 0.25
			});
		}
	}, []);

	useEffect(() => {
		if (spotToFocus && mapRef.current) {
			navigateToMarker(spotToFocus);
			setSelectedSpot(spotToFocus);
		}
	}, [spotToFocus, navigateToMarker]);

	useEffect(() => {
		if (showInfoWindow && patroliData) {
			setSelectedSpot(patroliData);
			if (patroliData.latitude && patroliData.longitude) {
				navigateToMarker(patroliData);
			}
		}
	}, [showInfoWindow, patroliData, navigateToMarker]);

	const MapController = () => {
		const map = useMap();
		mapRef.current = map;
		useEffect(() => {
			map.on('zoom', () => setCurrentZoom(map.getZoom()));
			return () => { map.off('zoom'); };
		}, [map]);
		return null;
	};

	const MapClickHandler = ({ onMapClick }: { onMapClick: () => void }) => {
		useMapEvent('click', onMapClick);
		return null;
	};

	const handleMarkerClick = useCallback((spot: any) => {
		setSelectedSpot(spot);
	}, []);

	const handleMapClick = useCallback(() => {
		setSelectedSpot(null);
		if (onCloseInfoWindow) {
			onCloseInfoWindow();
		}
	}, [onCloseInfoWindow]);

	const zoomIn = () => mapRef.current?.zoomIn();
	const zoomOut = () => mapRef.current?.zoomOut();

	const resetMapView = () => {
		if (mapRef.current) {
			mapRef.current.setView([center.lat, center.lng], zoom, { animate: true, duration: 1.2 });
			setSelectedSpot(null);
		}
	};

	const createCustomIcon = useCallback((spot: any) => {
		let color = '';
		const kategori = spot.patroli?.kategori_patroli || spot.kategori || '';

		if (kategori.indexOf("Mandiri") >= 0) color = 'var(--bg-mandiri)';
		else if (kategori.indexOf("Rutin") >= 0) color = 'var(--bg-rutin)';
		else if (kategori.indexOf("Terpadu") >= 0) color = 'var(--bg-terpadu)';
		else if (kategori.indexOf("Pemadaman") >= 0) color = 'var(--bg-pemadaman)';
		else color = 'var(--bs-primary)';

		return L.divIcon({
			className: 'custom-marker',
			html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 3rem 3rem 0; transform: rotate(45deg); border: 1px solid white; box-shadow: 0 0 3px rgba(0,0,0,0.4);"></div>`,
			iconSize: [20, 20],
			iconAnchor: [0, 0],
			popupAnchor: [10, -10]
		});
	}, []);

	const tileLayerOptions = {
		street: { url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', attribution: '© Google', maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] },
		hybrid: { url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', attribution: '© Google', maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] },
		terrain: { url: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', attribution: '© Google', maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] },
		esritopo: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', attribution: '© Esri', maxZoom: 20 },
		esrisatelite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '© Esri', maxZoom: 20 }
	};

	const referenceLayer = {
		url: 'https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
		attribution: ''
	};

	const changeBaseMap = (mapType: string) => setActiveBaseMap(mapType);
	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			mapContainerRef.current?.requestFullscreen().catch(err => console.error(`Error: ${err.message}`));
		} else {
			if (document.exitFullscreen) document.exitFullscreen();
		}
	};

	const CustomPopupContent = ({ spot }: { spot: any }) => (
		<div>
			<InfoWindowContent
				patroli={spot.patroli || spot}
				isLoggedin={isLoggedin}
				apiV2URL={apiV2URL}
				onClose={() => {
					setSelectedSpot(null);
					if (onCloseInfoWindow) {
						onCloseInfoWindow();
					}
				}}
			/>
			{(spot.latitude || spot.lat) && (spot.longitude || spot.lon) && (
				<button
					className="nav-to-marker-btn"
					onClick={(e) => {
						e.stopPropagation();
						navigateToMarker(spot);
					}}
				>
					Perbesar ke titik ini
				</button>
			)}
		</div>
	);

	const renderPopup = () => {
		if (!selectedSpot) return null;

		const lat = parseFloat(selectedSpot.latitude || selectedSpot.lat);
		const lng = parseFloat(selectedSpot.longitude || selectedSpot.lon);

		if (!isNaN(lat) && !isNaN(lng)) {
			return (
				<Popup
					position={[lat, lng]}
					closeButton={true}
					autoPan={false}
					closeOnClick={false}
					closeOnEscapeKey={true}
					autoClose={false}
					offset={[0, -5]}
					className="spot-popup"
					eventHandlers={{
						remove: () => {
							setSelectedSpot(null);
							if (onCloseInfoWindow) {
								onCloseInfoWindow();
							}
						}
					}}
				>
					<CustomPopupContent spot={selectedSpot} />
				</Popup>
			);
		}

		return (
			<Popup
				position={mapCenter}
				closeButton={true}
				autoPan={false}
				closeOnClick={false}
				closeOnEscapeKey={true}
				autoClose={false}
				offset={[0, -5]}
				className="spot-popup"
				eventHandlers={{
					remove: () => {
						setSelectedSpot(null);
						if (onCloseInfoWindow) {
							onCloseInfoWindow();
						}
					}
				}}
			>
				<CustomPopupContent spot={selectedSpot} />
			</Popup>
		);
	};

	return (
		<div ref={mapContainerRef} className="rounded-xl overflow-hidden relative shadow-lg mx-auto z-10 h-full">
			<MapContainer center={mapCenter} zoom={currentZoom} className="h-full w-full" zoomControl={false} attributionControl={false}>
				<MapController />
				<MapClickHandler onMapClick={handleMapClick} />
				<TileLayer
					url={tileLayerOptions[activeBaseMap as keyof typeof tileLayerOptions].url}
					attribution={tileLayerOptions[activeBaseMap as keyof typeof tileLayerOptions].attribution}
					maxZoom={tileLayerOptions[activeBaseMap as keyof typeof tileLayerOptions].maxZoom}
					subdomains={(tileLayerOptions[activeBaseMap as keyof typeof tileLayerOptions] as any).subdomains}
				/>
				{activeBaseMap.includes('satelite') && <TileLayer url={referenceLayer.url} attribution={referenceLayer.attribution} />}

				{spots?.map((spot, index) => {
					const lat = parseFloat(spot.latitude || spot.lat);
					const lng = parseFloat(spot.longitude || spot.lon);
					if (isNaN(lat) || isNaN(lng)) return null;
					const markerKey = `${lat}-${lng}-${index}`;
					return (
						<Marker
							key={markerKey}
							ref={(ref) => { if (ref) markerRefs.current[markerKey] = ref; }}
							position={[lat, lng]}
							icon={createCustomIcon(spot)}
							eventHandlers={{
								click: (e) => {
									L.DomEvent.stopPropagation(e);
									handleMarkerClick(spot);
								}
							}}
						/>
					);
				})}

				{renderPopup()}
			</MapContainer>
			<div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
				<button onClick={toggleFullscreen} className="bg-white w-8 h-8 flex items-center justify-center rounded-md shadow-md hover:bg-gray-100 transition-colors" aria-label="Toggle fullscreen">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>
				</button>
			</div>
			<div className="absolute top-4 right-4 z-[1000]">
				<div className="bg-white rounded-md shadow-md p-2">
					<select className="form-select w-full text-sm" onChange={(e) => changeBaseMap(e.target.value)} value={activeBaseMap}>
						<option value="street">Google Streets</option>
						<option value="hybrid">Google Hybrid</option>
						<option value="terrain">Google Terrain</option>
						<option value="esritopo">Esri Topographic</option>
						<option value="esrisatelite">Esri Imagery</option>
					</select>
				</div>
			</div>
			<div className="absolute bottom-8 left-4 z-[1000]">
				<button onClick={resetMapView} className="bg-white w-8 h-8 flex items-center justify-center rounded-md shadow-md hover:bg-gray-100 transition-colors" aria-label="Reset map view">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
				</button>
			</div>
			<div className="absolute bottom-8 right-4 z-[1000] flex flex-col gap-2">
				<button onClick={zoomIn} className="bg-white w-8 h-8 flex items-center justify-center rounded-md shadow-md hover:bg-gray-100 transition-colors" aria-label="Zoom in">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
				</button>
				<button onClick={zoomOut} className="bg-white w-8 h-8 flex items-center justify-center rounded-md shadow-md hover:bg-gray-100 transition-colors" aria-label="Zoom out">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
				</button>
			</div>
		</div>
	);
};

const MapPatroliContainer = dynamic(() => Promise.resolve(LeafletMap), {
	ssr: false,
	loading: () => <MapLoading />
});

export default MapPatroliContainer;
