'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AlertTriangle, MapPin } from 'lucide-react';
import { SectionRuntimeState, TrainRuntimeState } from '@/modules/simulation/simulation.types';

interface OperationalMapProps {
  onSelectFeature?: (featureProps: Record<string, any>) => void;
  simulationSections?: Record<string, SectionRuntimeState>;
  simulationTrains?: Record<string, TrainRuntimeState>;
}

export const OperationalMap: React.FC<OperationalMapProps> = ({
  onSelectFeature,
  simulationSections,
  simulationTrains,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const geojsonDataRef = useRef<any>(null);
  const onSelectFeatureRef = useRef(onSelectFeature);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Keep callback reference updated without triggering map re-initialization
  useEffect(() => {
    onSelectFeatureRef.current = onSelectFeature;
  }, [onSelectFeature]);

  // Initialize MapLibre GL instance EXACTLY ONCE on mount
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'carto-dark': {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              ],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            },
          },
          layers: [
            {
              id: 'carto-dark-layer',
              type: 'raster',
              source: 'carto-dark',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [78.9629, 23.5937], // Center on India
        zoom: 4.8,
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');

      map.on('load', async () => {
        if (!isMounted) return;

        try {
          const response = await fetch('/data/indian_railways_corridors.geojson');
          if (!response.ok) {
            throw new Error(`Failed to load GeoJSON data: ${response.statusText}`);
          }
          const geojsonData = await response.json();
          if (!isMounted) return;

          geojsonDataRef.current = geojsonData;

          if (!map.getSource('railway-network')) {
            map.addSource('railway-network', {
              type: 'geojson',
              data: geojsonData,
            });
          }

          // Corridor Lines Layer
          if (!map.getLayer('corridor-lines')) {
            map.addLayer({
              id: 'corridor-lines',
              type: 'line',
              source: 'railway-network',
              filter: ['==', '$type', 'LineString'],
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': [
                  'case',
                  ['>=', ['get', 'saturationRatio'], 0.9],
                  '#ef4444', // Red (Critical)
                  ['>=', ['get', 'saturationRatio'], 0.7],
                  '#f59e0b', // Amber (Warning)
                  '#3b82f6', // Blue (Normal)
                ],
                'line-width': 4,
                'line-opacity': 0.85,
              },
            });
          }

          // Station Points Layer
          if (!map.getLayer('station-points')) {
            map.addLayer({
              id: 'station-points',
              type: 'circle',
              source: 'railway-network',
              filter: ['==', '$type', 'Point'],
              paint: {
                'circle-radius': 7,
                'circle-color': '#10b981',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#0b1626',
              },
            });
          }

          // Click interactions on stations
          map.on('click', 'station-points', (e) => {
            if (!e.features || e.features.length === 0) return;
            const props = e.features[0].properties;
            const coords = (e.features[0].geometry as any).coordinates.slice();

            new maplibregl.Popup()
              .setLngLat(coords)
              .setHTML(
                `<div style="font-family: sans-serif; font-size: 13px;">
                  <strong style="color: #60a5fa;">${props.name} (${props.code})</strong><br/>
                  <span style="color: #94a3b8;">Railway Zone: ${props.zone}</span><br/>
                  <span style="color: #94a3b8;">Platform Tracks: ${props.tracks}</span>
                </div>`
              )
              .addTo(map);

            onSelectFeatureRef.current?.(props);
          });

          // Click interactions on corridors
          map.on('click', 'corridor-lines', (e) => {
            if (!e.features || e.features.length === 0) return;
            const props = e.features[0].properties;
            onSelectFeatureRef.current?.(props);
          });

          map.on('mouseenter', 'station-points', () => {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'station-points', () => {
            map.getCanvas().style.cursor = '';
          });

          if (isMounted) {
            setMapLoaded(true);
          }
        } catch (err: any) {
          console.error('Error loading GeoJSON corridors:', err);
          if (isMounted) setMapError('Failed to load railway GeoJSON layer.');
        }
      });

      map.on('error', (e) => {
        console.warn('MapLibre GL map warning/error:', e);
      });

      mapRef.current = map;
    } catch (err: any) {
      console.error('MapLibre GL init error:', err);
      setMapError('MapLibre GL failed to initialize map renderer.');
    }

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Strictly empty dependency array: Map initializes once per mount

  // Synchronize live simulation section states onto GeoJSON map source without recreating map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !simulationSections || !geojsonDataRef.current) return;

    try {
      const map = mapRef.current;
      if (!map.loaded() || !map.getSource('railway-network')) return;

      const source = map.getSource('railway-network') as maplibregl.GeoJSONSource | undefined;
      if (!source) return;

      const updatedFeatures = geojsonDataRef.current.features.map((feature: any) => {
        if (feature.geometry.type === 'LineString') {
          const secId = feature.properties?.id;
          if (secId && simulationSections[secId]) {
            return {
              ...feature,
              properties: {
                ...feature.properties,
                saturationRatio: simulationSections[secId].saturationRatio,
                activeTrains: simulationSections[secId].activeTrainCount,
              },
            };
          }
        }
        return feature;
      });

      const updatedGeoJSON = {
        ...geojsonDataRef.current,
        features: updatedFeatures,
      };

      source.setData(updatedGeoJSON);
    } catch (err) {
      console.warn('Could not update map GeoJSON source with simulation state:', err);
    }
  }, [mapLoaded, simulationSections]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-darker)',
      }}
    >
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Map Header Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(11, 22, 38, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--text-primary)',
          pointerEvents: 'none',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <MapPin size={16} style={{ color: 'var(--color-primary-light)' }} />
        <span>
          Indian Railways Network Engine — <strong>MapLibre GL</strong>
        </span>
      </div>

      {/* Map Legend Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          backgroundColor: 'rgba(11, 22, 38, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
          Track Saturation Index ($V/C$)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: '#3b82f6', borderRadius: '1px' }} /> &lt; 0.70 Normal
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: '#f59e0b', borderRadius: '1px' }} /> 0.70-0.89 Moderate
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: '#ef4444', borderRadius: '1px' }} /> &ge; 0.90 Saturation
          </span>
        </div>
      </div>

      {/* Graceful Tile Error Fallback State */}
      {mapError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(7, 17, 31, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <AlertTriangle size={36} style={{ color: 'var(--color-warning)' }} />
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Map Tiles Unavailable (Fallback Mode Active)
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px' }}>
            {mapError}. The operational dashboard and database telemetry remain 100% functional offline.
          </p>
        </div>
      )}
    </div>
  );
};
