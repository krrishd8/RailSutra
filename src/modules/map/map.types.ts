export interface StationFeature {
  id: string;
  code: string;
  name: string;
  zone: string;
  tracks: number;
  coordinates: [number, number]; // [lng, lat]
}

export interface CorridorFeature {
  id: string;
  code: string;
  name: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  saturationRatio: number;
  trackCount: number;
  coordinates: [number, number][]; // LineString coords
}
