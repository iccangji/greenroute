'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})


type mapViewProps = {
    coordinates: [number, number];
}

function ChangeView({ coordinates }: mapViewProps) {
    const map = useMap();

    useEffect(() => {
        if (map) {
            map.setView([coordinates[0], coordinates[1]], 14); // zoom = 14
        }
    }, [coordinates, map]);

    return null;
}

export default function MapView({ coordinates }: mapViewProps) {
    const position: [number, number] = coordinates; // Koordinat awal

    return (
        <div className="w-full h-[400px]">
            <MapContainer center={position} zoom={14} scrollWheelZoom className="w-full h-full">
                <ChangeView coordinates={coordinates} />
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={customIcon}>
                    <Popup>
                        Lokasi awal
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};