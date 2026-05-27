"use client";
import { useMemo } from 'react';
import Map, { Layer, Source, Marker } from 'react-map-gl/maplibre';
import circle from '@turf/circle';
import type { Feature, Polygon } from 'geojson';
import type { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MichiMap = () => {
  const position: [number, number] = [24.1426, -110.3128]; // La Paz, BCS

  const circleData: Feature<Polygon> = useMemo(() => {
    return circle(
      [position[1], position[0]],
      8,
      { units: 'kilometers', steps: 64 }
    );
  }, []);

  const mapStyle: StyleSpecification = {
    version: 8,
    sources: {
      'osm-raster-tiles': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    },
    layers: [{
      id: 'osm-layer',
      type: 'raster',
      source: 'osm-raster-tiles',
      minzoom: 0,
      maxzoom: 22,
    }],
  };

  return (
    <div className="w-full h-[400px] shadow-md overflow-hidden z-10 rounded-2xl">
      <Map
        initialViewState={{
          longitude: position[1],
          latitude: position[0],
          zoom: 11,
        }}
        mapStyle={mapStyle}
        style={{ width: '100%', height: '100%' }}
      >
        <Source type="geojson" data={circleData}>
          <Layer
            id="circle-fill"
            type="fill"
            paint={{
              'fill-color': '#16a34a',
              'fill-opacity': 0.15,
            }}
          />
          <Layer
            id="circle-border"
            type="line"
            paint={{
              'line-color': '#16a34a',
              'line-opacity': 0.6,
              'line-width': 2,
            }}
          />
        </Source>

        {/* Marker */}
        <Marker longitude={position[1]} latitude={position[0]} anchor="bottom">
          <div className="flex flex-col items-center">
            <div className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
              🐾 Michipaceños
            </div>
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-green-600" />
          </div>
        </Marker>
      </Map>
    </div>
  );
};

export default MichiMap;