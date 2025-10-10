import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useMemo } from 'react';
import { MapLayer } from '@/types';

const DEFAULT_LAYERS: MapLayer[] = [
  { id: 'earthquakes', name: 'Earthquakes', enabled: true, type: 'earthquakes' },
  { id: 'volcanoes', name: 'Volcanoes', enabled: false, type: 'volcanoes' },
  { id: 'plates', name: 'Plate Boundaries', enabled: false, type: 'plates' },
  { id: 'nuclear', name: 'Nuclear Plants', enabled: false, type: 'nuclear' },
  { id: 'heatmap', name: 'Heatmap', enabled: false, type: 'heatmap' },
];

export const [MapLayersProvider, useMapLayers] = createContextHook(() => {
  const [layers, setLayers] = useState<MapLayer[]>(DEFAULT_LAYERS);
  const [magnitudeFilter, setMagnitudeFilter] = useState<number | null>(null);

  const toggleLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
    ));
  }, []);

  const setMagnitudeFilterValue = useCallback((magnitude: number | null) => {
    setMagnitudeFilter(magnitude);
  }, []);

  return useMemo(
    () => ({
      layers,
      magnitudeFilter,
      toggleLayer,
      setMagnitudeFilterValue,
    }),
    [layers, magnitudeFilter, toggleLayer, setMagnitudeFilterValue]
  );
});