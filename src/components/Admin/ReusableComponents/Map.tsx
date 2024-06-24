import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import map from '@app/constants/map';
import L, { Control, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FC, useEffect } from 'react';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

const Map: FC<any> = ({ field, value, handleChange }) => {
  const { search } = 'أدخل العنوان أو اسم المنطقة أو الإحداثيات';
  const { name = '' } = field;

  const customIcon = L.icon({
    iconUrl: '/Logo.png',
    iconSize: [32, 32],
  });

  const SearchControl = () => {
    const map = useMap();
    const { name = '' } = field;

    useEffect(() => {
      const customIcon = L.icon({
        iconUrl: '/Logo.png',
        iconSize: [32, 32],
      });

      const handleMapClick = (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        handleChange(name, [lat, lng]);
        map.setView([lat, lng]);
      };

      map.on('click', handleMapClick);

      const searchControl = GeoSearchControl({
        provider: new OpenStreetMapProvider(),
        style: 'bar',
        autoCompleteDelay: 250,
        searchLabel: 'أدخل العنوان أو اسم المنطقة أو الإحداثيات',
        position: 'topright',
        showPopup: true,
        showMarker: false,
        autoClose: true,
        animateZoom: true,
        keepResult: true,
        marker: { icon: customIcon, style: { width: '70px', height: '70px' } },
      });

      map.addControl(searchControl);

      return () => {
        map.off('click', handleMapClick);
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  };

  return (
    <MapContainer
      center={(value as LatLngExpression) ?? map.damascusPosition}
      zoom={13}
      scrollWheelZoom
      style={{ height: '350px', zIndex: 0 }}
      attributionControl={false}
    >
      <TileLayer attribution="" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <SearchControl />
      <Marker position={(value as LatLngExpression) ?? map.damascusPosition} icon={customIcon} />
    </MapContainer>
  );
};

export default Map;
