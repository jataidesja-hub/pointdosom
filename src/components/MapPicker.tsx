import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in React
// @ts-ignore
import iconUrl from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
// @ts-ignore
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

function LocationMarker({ lat, lng, onChange }: MapPickerProps) {
  const [position, setPosition] = useState({ lat, lng });
  
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, 16);
    },
  });

  useEffect(() => {
    if (lat !== position.lat || lng !== position.lng) {
      setPosition({ lat, lng });
      map.flyTo({ lat, lng }, 16);
    }
  }, [lat, lng, map]);

  return position.lat !== 0 ? (
    <Marker 
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos);
          onChange(pos.lat, pos.lng);
        },
      }}
    />
  ) : null;
}

export function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  // Garantir que são números para evitar travamentos no Leaflet
  const nLat = Number(lat) || 0;
  const nLng = Number(lng) || 0;
  
  const defaultCenter: [number, number] = nLat !== 0 ? [nLat, nLng] : [-23.5505, -46.6333]; // Defaults to SP if zero
  const defaultZoom = nLat !== 0 ? 16 : 12;

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 relative z-10 bg-zinc-100">
      <MapContainer center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <LocationMarker lat={nLat} lng={nLng} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
