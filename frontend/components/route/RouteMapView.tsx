'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L, { LatLngBounds } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Cookies from 'js-cookie';
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

type MapViewProps = {
    coordinates: [number, number][];
};

function FitMapToBounds({ bounds }: { bounds: LatLngBounds }) {
    const map = useMap();

    useEffect(() => {
        if (map && bounds.isValid()) {
            map.fitBounds(bounds, { padding: [30, 30] });
        }
    }, [bounds, map]);

    return null;
}
export default function RouteMapView({ coordinates }: MapViewProps) {
    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
    const [bounds, setBounds] = useState<LatLngBounds | null>(null);

    useEffect(() => {
        if (coordinates.length < 2) return;
        const fetchRoute = async () => {
            try {
                const token = Cookies.get('token');

                const tpaData = await axios.get('/tpa', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
                    method: 'POST',
                    headers: {
                        'Authorization': process.env.NEXT_PUBLIC_ORS_API_KEY || '',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        coordinates: coordinates.map(([lat, lon]) => [lon, lat]), // ORS needs [lon, lat]
                    }),
                });

                const data = await response.json();
                const geometry = data.features[0].geometry.coordinates;
                const latlngs: [number, number][] = geometry.map(([lon, lat]: number[]) => [lat, lon]);

                setRouteCoords(latlngs);
                setBounds(L.latLngBounds(latlngs));
            } catch (error) {
                console.error('Gagal memuat rute dari ORS:', error);
            }
        };

        fetchRoute();
    }, [coordinates]);

    const center = coordinates[0];

    return (
        <div className="w-full h-[400px]">
            <MapContainer center={center} zoom={12} scrollWheelZoom className="w-full h-full">
                {bounds && <FitMapToBounds bounds={bounds} />}

                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {coordinates.map((pos, idx) => (
                    <Marker key={idx} position={pos} icon={customIcon}>
                        <Popup>
                            Titik {idx === 0 ? 'awal' : idx === coordinates.length - 1 ? 'akhir' : `ke-${idx + 1}`}
                        </Popup>
                    </Marker>
                ))}

                {routeCoords.length > 0 && (
                    <Polyline positions={routeCoords} pathOptions={{ color: 'green', weight: 4 }} />
                )}
            </MapContainer>
        </div>
    );
};