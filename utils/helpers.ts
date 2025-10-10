import { Earthquake } from '@/types';
import { calculateDistance } from '@/services/api';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const filterEarthquakes = (
  earthquakes: Earthquake[],
  filters: {
    minMagnitude?: number;
    maxMagnitude?: number;
    minDepth?: number;
    maxDepth?: number;
    maxDistance?: number;
    userLocation?: { latitude: number; longitude: number };
    significantOnly?: boolean;
  }
): Earthquake[] => {
  return earthquakes.filter((eq) => {
    if (filters.minMagnitude !== undefined && eq.magnitude < filters.minMagnitude) {
      return false;
    }

    if (filters.maxMagnitude !== undefined && eq.magnitude > filters.maxMagnitude) {
      return false;
    }

    if (filters.minDepth !== undefined && eq.depth < filters.minDepth) {
      return false;
    }

    if (filters.maxDepth !== undefined && eq.depth > filters.maxDepth) {
      return false;
    }

    if (filters.significantOnly && eq.sig < 600) {
      return false;
    }

    if (filters.maxDistance !== undefined && filters.userLocation) {
      const distance = calculateDistance(
        filters.userLocation.latitude,
        filters.userLocation.longitude,
        eq.latitude,
        eq.longitude
      );
      if (distance > filters.maxDistance) {
        return false;
      }
    }

    return true;
  });
};

export const sortEarthquakes = (
  earthquakes: Earthquake[],
  field: 'time' | 'magnitude' | 'distance' | 'depth',
  direction: 'asc' | 'desc',
  userLocation?: { latitude: number; longitude: number }
): Earthquake[] => {
  const sorted = [...earthquakes].sort((a, b) => {
    let aValue: number;
    let bValue: number;

    switch (field) {
      case 'time':
        aValue = a.time;
        bValue = b.time;
        break;
      case 'magnitude':
        aValue = a.magnitude;
        bValue = b.magnitude;
        break;
      case 'depth':
        aValue = a.depth;
        bValue = b.depth;
        break;
      case 'distance':
        if (!userLocation) return 0;
        aValue = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          a.latitude,
          a.longitude
        );
        bValue = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          b.latitude,
          b.longitude
        );
        break;
      default:
        return 0;
    }

    return direction === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return sorted;
};

export const getDamageDescription = (magnitude: number, mmi?: number): string => {
  if (mmi) {
    if (mmi <= 2) return 'Not felt or barely felt';
    if (mmi <= 4) return 'Felt indoors, minor shaking';
    if (mmi <= 6) return 'Felt by all, slight damage possible';
    if (mmi <= 8) return 'Moderate to considerable damage';
    if (mmi <= 10) return 'Severe to extreme damage';
  }

  if (magnitude < 3) return 'Usually not felt, no damage';
  if (magnitude < 4) return 'Often felt, rarely causes damage';
  if (magnitude < 5) return 'Noticeable shaking, minor damage to buildings';
  if (magnitude < 6) return 'Can cause damage to poorly constructed buildings';
  if (magnitude < 7) return 'Can cause considerable damage in populated areas';
  if (magnitude < 8) return 'Major earthquake, serious damage over large areas';
  return 'Great earthquake, can cause catastrophic damage';
};

export const getQuickSafetyTip = (magnitude: number, tsunami: boolean): string => {
  if (tsunami) {
    return 'TSUNAMI WARNING: Move to higher ground immediately if near coast!';
  }

  if (magnitude >= 6) {
    return 'Major quake: Check for injuries, gas leaks, and structural damage. Expect aftershocks.';
  }

  if (magnitude >= 5) {
    return 'Moderate quake: Check for damage, be prepared for aftershocks. Drop, Cover, Hold On if shaking continues.';
  }

  return 'Minor quake: Stay calm. If shaking occurs, Drop, Cover, and Hold On.';
};

export const isInQuietHours = (
  quietHoursStart?: string,
  quietHoursEnd?: string
): boolean => {
  if (!quietHoursStart || !quietHoursEnd) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  const [startHour, startMinute] = quietHoursStart.split(':').map(Number);
  const [endHour, endMinute] = quietHoursEnd.split(':').map(Number);
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  if (startTime <= endTime) {
    return currentTime >= startTime && currentTime < endTime;
  } else {
    return currentTime >= startTime || currentTime < endTime;
  }
};
