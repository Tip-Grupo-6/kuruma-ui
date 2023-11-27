import React, {useEffect, useRef} from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJpZWwyMDM5NSIsImEiOiJjbHBmd2xsZHYxaGRhMmlubDlzeTZpNnU4In0.9mKViLx9195hZJekzmitXQ';

export const Map = ({startLocation, endLocation}) => {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const zoom = 11


    useEffect(() => {
        if(startLocation && endLocation) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: getMidlineBetweenCoordinates(),
                zoom: zoom
            });


            map.current.on('load', () => {
                map.current.addSource('route', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [
                                convertToMapBoxLatLong(startLocation.latitude, startLocation.longitude),
                                convertToMapBoxLatLong(endLocation.latitude, endLocation.longitude)
                            ]
                        }
                    }
                });
                map.current.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#888',
                        'line-width': 8
                    }
                });

                new mapboxgl.Marker()
                    .setLngLat(convertToMapBoxLatLong(startLocation.latitude, startLocation.longitude))
                    .addTo(map.current);

                new mapboxgl.Marker()
                    .setLngLat(convertToMapBoxLatLong(endLocation.latitude, endLocation.longitude))
                    .addTo(map.current);
            });
        }

    }, [startLocation, endLocation]);

    const getMidlineBetweenCoordinates = () => {
        let latitude = startLocation.latitude + (endLocation.latitude - startLocation.latitude) * 0.5
        let longitude = startLocation.longitude + (endLocation.longitude - startLocation.longitude) * 0.5
        return convertToMapBoxLatLong(latitude, longitude)
    }

    const convertToMapBoxLatLong = (latitude, longitude) => {
        return [longitude, latitude]
    }


    return (
        <div>
            <div ref={mapContainer} style={{height: "400px"}} />
        </div>
    );
};