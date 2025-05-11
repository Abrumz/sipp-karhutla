import React, { useState, useRef, useCallback, useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { apiV2URL } from '@/api';
import { GOOGLE_MAPS_API_KEY } from '@/config/keys';
import InfoWindowContent from './InfoWindowContent';
import { PatroliData, SpotData } from '@/interfaces';

interface MarkerPosition {
	position: {
		lat: number;
		lng: number;
	};
}

interface MapContainerProps {
	center: {
		lat: number;
		lng: number;
	};
	zoom: number;
	spots?: SpotData[];
	isLoggedin?: boolean;
}

const mapOptions = {
	streetViewControl: true,
	zoomControl: true,
	mapTypeControl: true,
	fullscreenControl: true,
	gestureHandling: 'cooperative',
	zoomControlOptions: {
		position: 9 // google.maps.ControlPosition.LEFT_TOP
	},
	styles: [
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [{ visibility: "off" }]
		}
	]
};

const MapContainer: React.FC<MapContainerProps> = ({ center, zoom, spots, isLoggedin }) => {
	const [showingInfoWindow, setShowingInfoWindow] = useState<boolean>(false);
	const [activeMarker, setActiveMarker] = useState<MarkerPosition | null>(null);
	const [selectedPlace, setSelectedPlace] = useState<{ patroli?: PatroliData }>({});
	const [currentZoom, setCurrentZoom] = useState<number>(zoom);
	const [mapCenter, setMapCenter] = useState(center);

	const mapRef = useRef<google.maps.Map | null>(null);

	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: GOOGLE_MAPS_API_KEY,
		language: 'id',
		region: 'ID'
	});

	const getCustomMarkerOptions = useCallback((spot: SpotData) => {
		return {
			url: spot.marker,
			anchor: new window.google.maps.Point(10, 34),
			labelOrigin: new window.google.maps.Point(10, -10)
		};
	}, []);

	const onMapLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map;
		setCurrentZoom(map.getZoom() || zoom);
	}, [zoom]);

	const onZoomChanged = useCallback(() => {
		if (mapRef.current) {
			const newZoom = mapRef.current.getZoom() || zoom;
			setCurrentZoom(newZoom);
		}
	}, [zoom]);

	const panToMarker = useCallback((position: { lat: number, lng: number }) => {
		if (mapRef.current) {
			const targetZoom = 15;

			setCurrentZoom(targetZoom);
			mapRef.current.panTo(position);

			setTimeout(() => {
				const startZoom = mapRef.current?.getZoom() || currentZoom;
				const zoomSteps = 10;
				const zoomIncrement = (targetZoom - startZoom) / zoomSteps;
				let step = 0;

				const smoothZoom = () => {
					if (!mapRef.current) return;

					step++;
					if (step <= zoomSteps) {
						const nextZoom = startZoom + (zoomIncrement * step);
						mapRef.current.setZoom(nextZoom);
						mapRef.current.panTo(position);
						setTimeout(smoothZoom, 50);
					}
				};

				if (startZoom !== targetZoom) {
					smoothZoom();
				}
			}, 100);
		}
	}, [currentZoom]);

	const onMarkerClick = useCallback((props: { patroli: PatroliData }, position: { lat: number, lng: number }): void => {
		setSelectedPlace(props);
		setActiveMarker({ position });
		setShowingInfoWindow(true);
		setMapCenter(position);
		panToMarker(position);
	}, [panToMarker]);

	const onMapClick = useCallback((): void => {
		if (showingInfoWindow) {
			setShowingInfoWindow(false);
			setActiveMarker(null);
		}
	}, [showingInfoWindow]);

	const onInfoWindowClose = useCallback((): void => {
		setShowingInfoWindow(false);
		setActiveMarker(null);
	}, []);

	const mapContainerStyle = useMemo(() => ({
		width: '100%',
		height: '75vh',
		borderRadius: '12px',
		overflow: 'hidden',
		boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
	}), []);

	if (loadError) return (
		<div className="flex items-center justify-center h-75vh bg-gray-100 rounded-xl">
			<div className="text-center p-8">
				<svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<h2 className="mt-4 text-xl font-semibold text-gray-700">Error loading maps</h2>
				<p className="mt-2 text-gray-500">Please check your internet connection and try again.</p>
			</div>
		</div>
	);

	if (!isLoaded) return (
		<div className="flex items-center justify-center h-75vh bg-gray-50 rounded-xl">
			<div className="text-center">
				<div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
				<p className="mt-4 text-gray-600">Loading map...</p>
			</div>
		</div>
	);

	return (
		<GoogleMap
			mapContainerStyle={mapContainerStyle}
			center={mapCenter}
			zoom={zoom}
			onClick={onMapClick}
			onLoad={onMapLoad}
			onZoomChanged={onZoomChanged}
			options={mapOptions}
		>
			{spots?.map((spot, i) => (
				<Marker
					key={i}
					position={{
						lat: parseFloat(spot.latitude),
						lng: parseFloat(spot.longitude)
					}}
					icon={getCustomMarkerOptions(spot)}
					onClick={() => {
						onMarkerClick(
							{ patroli: spot.patroli },
							{
								lat: parseFloat(spot.latitude),
								lng: parseFloat(spot.longitude)
							}
						);
					}}
					zIndex={1000}
				/>
			))}

			{showingInfoWindow && activeMarker && (
				<InfoWindow
					position={activeMarker.position}
					onCloseClick={onInfoWindowClose}
					options={{
						pixelOffset: new window.google.maps.Size(0, -35),
					}}
				>
					<InfoWindowContent
						patroli={selectedPlace.patroli}
						isLoggedin={isLoggedin}
						apiV2URL={apiV2URL}
					/>
				</InfoWindow>
			)}
		</GoogleMap>
	);
};

export default MapContainer;