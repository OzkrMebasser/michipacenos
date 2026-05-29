"use client";
import { useMemo } from "react";
import Map, { Layer, Source, Marker } from "react-map-gl/maplibre";
import circle from "@turf/circle";
import type { Feature, Polygon } from "geojson";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MichiMap = () => {
  const position: [number, number] = [24.1426, -110.3128]; // La Paz, BCS

  const circleData: Feature<Polygon> = useMemo(() => {
    return circle([position[1], position[0]], 8, {
      units: "kilometers",
      steps: 64,
    });
  }, []);

  const mapStyle: StyleSpecification = {
    version: 8,
    sources: {
      "osm-raster-tiles": {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    },
    layers: [
      {
        id: "osm-layer",
        type: "raster",
        source: "osm-raster-tiles",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };

  return (
    <div className="w-full h-[500px] shadow-md overflow-hidden z-10 bg-[#white] ">
      {/* Header */}
      <div className="text-left mt-12 bg-[white] px-4 mb-4">
        <h2 className="text-2xl lg:text-4xl  font-black text-[#0bbaf7] font-logo  ">
          Nuestra área de acción
          <img
            src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779947671/michipaceno-icono_1_ptlksg.png"
            alt="gatito como ayudar"
            className="inline-block w-9 h-9 ml-2 scale-x-[-1]"
          />
        </h2>
        <p className="text-gray-600 text-md font-semibold leading-relaxed">
          Nos enfocamos en rescatar michis en La Paz y sus alrededores.
        </p>
      </div>
      <Map
        initialViewState={{
          longitude: position[1],
          latitude: position[0],
          zoom: 11,
        }}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
      >
        <Source type="geojson" data={circleData}>
          <Layer
            id="circle-fill"
            type="fill"
            paint={{
              "fill-color": "#ff3ca5",
              "fill-opacity": 0.15,
            }}
          />
          <Layer
            id="circle-border"
            type="line"
            paint={{
              "line-color": "#ff3ca5",
              "line-opacity": 0.6,
              "line-width": 2,
            }}
          />
        </Source>

        {/* Marker */}
        <Marker longitude={position[1]} latitude={position[0]} anchor="bottom">
          <div className="flex flex-col items-center">
            <div className=" bg-white rounded-full border-3 border-white shadow-xl overflow-hidden ring-1 ring-pink-500">
              <img
                src="https://res.cloudinary.com/dmtehcd5t/image/upload/v1779428896/BACKGROUND_FORM_ux2tku.png"
                alt="gatito marcador"
                className="w-full h-8 object-cover"
              />
            </div>
            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-pink-500 -mt-px" />
          </div>
        </Marker>
      </Map>
    </div>
  );
};

export default MichiMap;
