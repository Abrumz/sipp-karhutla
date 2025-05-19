// components/maps/MapHotspot.tsx
import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY_HOTSPOT } from '@/config/keys';

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

const mapOptions = {
	streetViewControl: true,
	zoomControl: true,
	mapTypeControl: true,
	fullscreenControl: true,
	gestureHandling: 'cooperative',
	mapTypeId: 'hybrid',
	styles: [
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [{ visibility: "off" }]
		}
	],
	zoomControlOptions: {
		position: 9 // google.maps.ControlPosition.LEFT_TOP
	}
};

const Map: React.FC<MapProps> = (props) => {
	const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const [currentZoom, setCurrentZoom] = useState<number>(props.zoom);

	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: GOOGLE_MAPS_API_KEY_HOTSPOT,
		language: 'id',
		region: 'ID'
	});

	const getMarkerIcon = useCallback((conf: string) => {
		if (conf === 'low') {
			return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
		} else if (conf === 'medium') {
			return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
		} else {
			return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
		}
	}, []);

	const onLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map;
		setCurrentZoom(map.getZoom() || props.zoom);
		console.log('Map loaded successfully');
	}, [props.zoom]);

	const onZoomChanged = useCallback(() => {
		if (mapRef.current) {
			const newZoom = mapRef.current.getZoom() || props.zoom;
			setCurrentZoom(newZoom);
		}
	}, [props.zoom]);

	const onMarkerClick = useCallback((hotspot: HotspotData, position: { lat: number, lng: number }) => {
		setSelectedHotspot(hotspot);

		// Pan to the marker with a smooth animation
		if (mapRef.current) {
			mapRef.current.panTo(position);
		}

		console.log('Marker clicked:', hotspot);
	}, []);

	const onInfoWindowClose = useCallback(() => {
		setSelectedHotspot(null);
	}, []);

	const renderMarkers = useCallback(() => {
		if (!props.hotspots || props.hotspots.length === 0) {
			return null;
		}

		console.log(`Rendering ${props.hotspots.length} hotspot markers`);

		return props.hotspots.map((hotspot, index) => {
			try {
				// Convert lat/lon to numbers
				const lat = parseFloat(hotspot.lat);
				const lng = parseFloat(hotspot.lon);

				// Skip invalid coordinates
				if (isNaN(lat) || isNaN(lng)) {
					console.warn(`Invalid coordinates for hotspot ${index}:`, hotspot);
					return null;
				}

				return (
					<Marker
						key={`hotspot-${index}`}
						position={{ lat, lng }}
						icon={getMarkerIcon(hotspot.conf)}
						onClick={() => onMarkerClick(hotspot, { lat, lng })}
						zIndex={1000}
					/>
				);
			} catch (error) {
				console.error(`Error rendering marker ${index}:`, error);
				return null;
			}
		});
	}, [props.hotspots, getMarkerIcon, onMarkerClick]);

	const mapContainerStyle = {
		width: '100%',
		height: '100%',
		borderRadius: '8px',
		overflow: 'hidden',
		boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
	};

	if (!isLoaded) {
		return (
			<div className="flex items-center justify-center h-full bg-gray-50 rounded-xl">
				<div className="text-center">
					<div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
					<p className="mt-4 text-gray-600">Loading map...</p>
				</div>
			</div>
		);
	}

	return (
		<GoogleMap
			mapContainerStyle={mapContainerStyle}
			center={props.center}
			zoom={props.zoom}
			options={mapOptions}
			onLoad={onLoad}
			onZoomChanged={onZoomChanged}
		>
			{renderMarkers()}

			{selectedHotspot && (
				<InfoWindow
					position={{
						lat: parseFloat(selectedHotspot.lat),
						lng: parseFloat(selectedHotspot.lon)
					}}
					onCloseClick={onInfoWindowClose}
					options={{
						pixelOffset: new window.google.maps.Size(0, -35),
					}}
				>
					<div className="p-3 max-w-l">
						<h3 className="font-bold text-lg mb-2 text-red-600">Titik Panas</h3>

						<div className="bg-gray-50 p-3 rounded-lg mb-3">
							<div className="grid grid-cols-2 gap-2 text-l">
								<div className="text-gray-600">Satelit:</div>
								<div className="font-medium">{selectedHotspot.sat || '-'}</div>

								<div className="text-gray-600">Tanggal:</div>
								<div className="font-medium">{selectedHotspot.tanggal || '-'}</div>

								<div className="text-gray-600">Confidence:</div>
								<div className="font-medium">
									<span className={`inline-block px-2 py-1 rounded text-l text-white ${selectedHotspot.conf === 'high' ? 'bg-red-500' :
										selectedHotspot.conf === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
										}`}>
										{selectedHotspot.conf.toUpperCase()}
									</span>
								</div>
							</div>
						</div>

						{selectedHotspot.detail && (
							<div>
								<h4 className="font-semibold mb-2 text-gray-700">Lokasi</h4>
								<div className="text-l">
									{selectedHotspot.detail.desa && (
										<p><span className="text-gray-500">Desa:</span> {selectedHotspot.detail.desa}</p>
									)}
									{selectedHotspot.detail.kecamatan && (
										<p><span className="text-gray-500">Kecamatan:</span> {selectedHotspot.detail.kecamatan}</p>
									)}
									{selectedHotspot.detail['kota/kabupaten'] && (
										<p><span className="text-gray-500">Kabupaten:</span> {selectedHotspot.detail['kota/kabupaten']}</p>
									)}
									{selectedHotspot.detail.provinsi && (
										<p><span className="text-gray-500">Provinsi:</span> {selectedHotspot.detail.provinsi}</p>
									)}
									{selectedHotspot.detail.kawasan && (
										<p><span className="text-gray-500">Kawasan:</span> {selectedHotspot.detail.kawasan}</p>
									)}
								</div>
							</div>
						)}

						<div className="mt-3 text-l text-gray-400">
							Koordinat: {selectedHotspot.lat}, {selectedHotspot.lon}
						</div>
					</div>
				</InfoWindow>
			)}
		</GoogleMap>
	);
};

export default Map;