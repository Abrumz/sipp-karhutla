'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import L from 'leaflet';


interface HotspotData {
	lat: string;
	lon: string;
	conf: string;
	sat: string;
	tanggal: string;
	detail?: {
		tanggal: string;
		latitude: string;
		longitude: string;
		confidence: string;
		kawasan: string;
		desa: string;
		kecamatan: string;
		'kota/kabupaten': string;
		provinsi: string;
	};
}

interface MapProps {
	center: {
		lat: number;
		lng: number;
	};
	zoom: number;
	hotspots?: HotspotData[];
}

const MapLoading = () => (
	<div className="flex items-center justify-center h-full bg-gray-50 rounded-xl">
		<div className="text-center">
			<div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
			<p className="mt-4 text-black-600">Loading map...</p>
		</div>
	</div>
);

const LeafletMap = ({ center, zoom, hotspots }: MapProps) => {

	const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
	const [mapCenter, setMapCenter] = useState<[number, number]>([center.lat, center.lng]);
	const [currentZoom, setCurrentZoom] = useState<number>(zoom);
	const [activeBaseMap, setActiveBaseMap] = useState<string>("hybrid");
	const mapRef = useRef<any>(null);
	const markerRefs = useRef<any[]>([]);
	const mapContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		delete (L.Icon.Default.prototype as any)._getIconUrl;
		L.Icon.Default.mergeOptions({
			iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
			shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
			iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png'
		});
	}, [L]);

	useEffect(() => {
		if (typeof document !== 'undefined') {
			const handleFullScreenChange = () => {
				if (mapRef.current) {
					setTimeout(() => {
						mapRef.current.invalidateSize();
					}, 100);
				}
			};

			document.addEventListener('fullscreenchange', handleFullScreenChange);

			// Add styles for popups and markers to prevent positioning issues
			const style = document.createElement('style');
			style.innerHTML = `
                .leaflet-popup-content-wrapper {
                    max-height: 80vh;
                    overflow-y: auto;
                }
                .leaflet-popup {
                    margin-bottom: 0px;
                }
                .hotspot-popup .leaflet-popup-content {
                    margin: 8px;
                    padding: 0;
                }
                .custom-hotspot-marker {
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                }
                .leaflet-div-icon {
                    background: transparent;
                    border: none;
                }
                .nav-to-hotspot-btn {
                    display: block;
                    width: 100%;
                    padding: 8px 12px;
                    margin-top: 10px;
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .nav-to-hotspot-btn:hover {
                    background-color: #2563eb;
                }
            `;
			document.head.appendChild(style);

			return () => {
				document.removeEventListener('fullscreenchange', handleFullScreenChange);
				document.head.removeChild(style);
			};
		}
	}, []);

	// Track if this is first load or a marker click
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	const MapController = () => {
		const map = useMap();
		mapRef.current = map;

		useEffect(() => {
			map.on('zoom', () => {
				setCurrentZoom(map.getZoom());
			});

			// Set initial load to false after map is ready
			setIsInitialLoad(false);

			return () => {
				map.off('zoom');
			};
		}, [map]);

		return null;
	};

	const MapClickHandler = ({ onMapClick }: { onMapClick: () => void }) => {
		useMapEvent('click', onMapClick);
		return null;
	};

	const handleMarkerClick = useCallback((hotspot: HotspotData) => {
		// Just set the selected hotspot without automatically flying to it
		setSelectedHotspot(hotspot);
	}, []);

	const navigateToHotspot = useCallback((hotspot: HotspotData) => {
		// Parse coordinates
		const lat = parseFloat(hotspot.lat);
		const lng = parseFloat(hotspot.lon);

		// Ensure coordinates are valid
		if (!isNaN(lat) && !isNaN(lng) && mapRef.current) {
			// Limit the maximum zoom to avoid "Map data not available" issues
			const targetZoom = Math.min(17, Math.max(13, mapRef.current.getZoom()));

			// Apply a slight offset to the latitude for better popup positioning
			const offsetLat = lat - 0.0005;

			mapRef.current.setView([offsetLat, lng], targetZoom, {
				animate: true,
				duration: 1.2,
				easeLinearity: 0.25
			});
		}
	}, []);

	const handleMapClick = useCallback(() => {
		setSelectedHotspot(null);
	}, []);

	const zoomIn = () => {
		if (mapRef.current) {
			mapRef.current.setZoom(mapRef.current.getZoom() + 1);
		}
	};

	const zoomOut = () => {
		if (mapRef.current) {
			mapRef.current.setZoom(mapRef.current.getZoom() - 1);
		}
	};

	const resetMapView = () => {
		if (mapRef.current) {
			const initialCenter: [number, number] = [center.lat, center.lng];
			const initialZoom = zoom;

			mapRef.current.setView(initialCenter, initialZoom, {
				animate: true,
				duration: 1.2,
				easeLinearity: 0.25
			});

			setMapCenter(initialCenter);
			setCurrentZoom(initialZoom);
			setSelectedHotspot(null);
		}
	};

	const createHotspotIcon = useCallback((conf: string) => {
		let color = '';

		if (conf === 'low') {
			color = 'var(--bs-low)';
		} else if (conf === 'medium') {
			color = 'var(--bs-medium)';
		} else {
			color = 'var(--bs-high)';
		}

		return L.divIcon({
			className: 'custom-hotspot-marker',
			html: `<div style="
                background-color: ${color};
                width: 14px;
                height: 14px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 3px rgba(0,0,0,0.4);
            "></div>`,
			iconSize: [18, 18],
			iconAnchor: [9, 9],
			popupAnchor: [0, -9]
		});
	}, [L]);

	const tileLayerOptions = {
		street: {
			url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
			attribution: 'Map &copy; <a href="https://maps.google.com/">Google</a>',
			maxZoom: 20,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
			errorTileUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-grey.png'
		},
		hybrid: {
			url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
			attribution: 'Map &copy; <a href="https://maps.google.com/">Google</a>',
			maxZoom: 20,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
			errorTileUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-grey.png'
		},
		terrain: {
			url: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
			attribution: 'Map &copy; <a href="https://maps.google.com/">Google</a>',
			maxZoom: 20,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
			errorTileUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-grey.png'
		},
		esritopo: {
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
			attribution: 'Map &copy; <a href="https://arcgisonline.com/">Esri</a>',
			maxZoom: 18,
			errorTileUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-grey.png'
		},
		esrisatelite: {
			url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
			attribution: 'Map &copy; <a href="https://arcgisonline.com/">Esri</a>',
			maxZoom: 18,
			errorTileUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-grey.png'
		}
	};

	const referenceLayer = {
		url: 'https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
		attribution: ''
	};

	const changeBaseMap = (mapType: string) => {
		setActiveBaseMap(mapType);
	};

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			mapContainerRef.current?.requestFullscreen().catch(err => {
				console.error(`Error attempting to enable fullscreen: ${err.message}`);
			});
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}
	};

	const HotspotPopupContent = ({ hotspot }: { hotspot: HotspotData }) => {
		return (
			<div>
				<div className="p-3 max-w-l">
					<h3 className="font-bold text-lg mb-2 text-red-600">Titik Panas</h3>

					<div className="bg-gray-50 p-3 rounded-lg mb-3">
						<div className="grid grid-cols-2 gap-2 text-l">
							<div className="text-black-600">Satelit:</div>
							<div className="font-medium">{hotspot.sat || '-'}</div>

							<div className="text-black-600">Tanggal:</div>
							<div className="font-medium">{hotspot.tanggal || '-'}</div>

							<div className="text-black-600">Confidence:</div>
							<div className="font-medium">
								<span
									className="inline-block px-2 py-1 rounded text-l text-black"
									style={{
										backgroundColor:
											hotspot.conf === 'high'
												? 'var(--bs-high)'
												: hotspot.conf === 'medium'
													? 'var(--bs-medium)'
													: 'var(--bs-low)'
									}}
								>
									{hotspot.conf.toUpperCase()}
								</span>
							</div>
						</div>
					</div>

					{hotspot.detail && (
						<div>
							<h4 className="font-semibold mb-2 text-black-700">Lokasi</h4>
							<div className="text-l">
								{hotspot.detail.desa && (
									<p><span className="text-black-500">Desa:</span> {hotspot.detail.desa}</p>
								)}
								{hotspot.detail.kecamatan && (
									<p><span className="text-black-500">Kecamatan:</span> {hotspot.detail.kecamatan}</p>
								)}
								{hotspot.detail['kota/kabupaten'] && (
									<p><span className="text-black-500">Kabupaten:</span> {hotspot.detail['kota/kabupaten']}</p>
								)}
								{hotspot.detail.provinsi && (
									<p><span className="text-black-500">Provinsi:</span> {hotspot.detail.provinsi}</p>
								)}
								{hotspot.detail.kawasan && (
									<p><span className="text-black-500">Kawasan:</span> {hotspot.detail.kawasan}</p>
								)}
							</div>
						</div>
					)}

					<div className="mt-3 text-l text-black-400">
						Koordinat: {hotspot.lat}, {hotspot.lon}
					</div>
				</div>

				<button
					className="nav-to-hotspot-btn"
					onClick={(e) => {
						e.stopPropagation();
						navigateToHotspot(hotspot);
					}}
				>
					Perbesar ke titik ini
				</button>
			</div>
		);
	};

	return (
		<div
			ref={mapContainerRef}
			className="rounded-xl overflow-hidden relative shadow-lg mx-auto z-10"
			style={{
				height: '100%'
			}}
		>
			<MapContainer
				center={mapCenter}
				zoom={currentZoom}
				className="h-full w-full"
				zoomControl={false}
				preferCanvas={true}
				zoomSnap={0.25}
				zoomDelta={0.25}
				attributionControl={false}
				fadeAnimation={true}
				markerZoomAnimation={false}
				worldCopyJump={true}
			>
				<MapController />
				<MapClickHandler onMapClick={handleMapClick} />

				<TileLayer
					url={tileLayerOptions[activeBaseMap as keyof typeof tileLayerOptions].url}
					attribution={tileLayerOptions[activeBaseMap as keyof typeof tileLayerOptions].attribution}
					maxZoom={tileLayerOptions[activeBaseMap as keyof typeof tileLayerOptions].maxZoom}
					errorTileUrl={tileLayerOptions[activeBaseMap as keyof typeof tileLayerOptions].errorTileUrl}
					{...'subdomains' in tileLayerOptions[activeBaseMap as keyof typeof tileLayerOptions]
						? { subdomains: (tileLayerOptions[activeBaseMap as keyof typeof tileLayerOptions] as { subdomains: string[] }).subdomains }
						: {}}
				/>

				{activeBaseMap === 'esrisatelite' && (
					<TileLayer
						url={referenceLayer.url}
						attribution={referenceLayer.attribution}
					/>
				)}

				{hotspots?.map((hotspot, index) => {
					try {
						const lat = parseFloat(hotspot.lat);
						const lng = parseFloat(hotspot.lon);

						if (isNaN(lat) || isNaN(lng)) {
							return null;
						}

						return (
							<Marker
								key={`hotspot-${index}`}
								ref={(ref: any) => {
									if (ref) {
										markerRefs.current[index] = ref;
									}
								}}
								position={[lat, lng]}
								icon={createHotspotIcon(hotspot.conf)}
								eventHandlers={{
									click: (e: any) => {
										L.DomEvent.stopPropagation(e);
										handleMarkerClick(hotspot);
									}
								}}
								zIndexOffset={1000}
							/>
						);
					} catch (error) {
						return null;
					}
				})}

				{selectedHotspot && (
					<Popup
						position={[parseFloat(selectedHotspot.lat), parseFloat(selectedHotspot.lon)]}
						closeButton={true}
						autoPan={false}
						closeOnClick={false}
						closeOnEscapeKey={true}
						autoClose={false}
						offset={[0, -5]}
						className="hotspot-popup"
						eventHandlers={{
							remove: () => setSelectedHotspot(null)
						}}
					>
						<HotspotPopupContent hotspot={selectedHotspot} />
					</Popup>
				)}
			</MapContainer>

			<div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
				<button
					onClick={toggleFullscreen}
					className="bg-white w-8 h-8 flex items-center justify-center rounded-md shadow-md hover:bg-gray-100 transition-colors"
					aria-label="Toggle fullscreen"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
					</svg>
				</button>
			</div>

			<div className="absolute top-4 right-4 z-[1000]">
				<div className="bg-white rounded-md shadow-md p-2">
					<select
						className="form-select w-full text-sm"
						onChange={(e) => changeBaseMap(e.target.value)}
						value={activeBaseMap}
					>
						<option value="street">Google Streets</option>
						<option value="hybrid">Google Hybrid</option>
						<option value="terrain">Google Terrain</option>
						<option value="esritopo">Esri Topographic</option>
						<option value="esrisatelite">Esri Imagery</option>
					</select>
				</div>
			</div>

			<div className="absolute bottom-8 left-4 z-[1000]">
				<button
					onClick={resetMapView}
					className="bg-white w-8 h-8 flex items-center justify-center rounded-md shadow-md hover:bg-gray-100 transition-colors"
					aria-label="Reset map view"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
					</svg>
				</button>
			</div>

			<div className="absolute bottom-8 right-4 z-[1000] flex flex-col gap-2">
				<button
					onClick={zoomIn}
					className="bg-white w-8 h-8 flex items-center justify-center rounded-md shadow-md hover:bg-gray-100 transition-colors"
					aria-label="Zoom in"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
					</svg>
				</button>
				<button
					onClick={zoomOut}
					className="bg-white w-8 h-8 flex items-center justify-center rounded-md shadow-md hover:bg-gray-100 transition-colors"
					aria-label="Zoom out"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
					</svg>
				</button>
			</div>
		</div>
	);
};

const Map = dynamic(() => Promise.resolve(LeafletMap), {
	loading: () => <MapLoading />
});

export default Map;