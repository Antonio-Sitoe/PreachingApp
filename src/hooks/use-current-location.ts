import type { StudentLocation } from '@/database/actions';
import { checkPermission } from '@/utils/permissions';
import * as Location from 'expo-location';
import * as React from 'react';

function formatAddress(place: Location.LocationGeocodedAddress | undefined): string | null {
  if (!place) return null;
  const area = place.district ?? place.street ?? place.name;
  const parts = [area, place.city ?? place.subregion].filter(Boolean);
  return parts.length > 0 ? [...new Set(parts)].join(', ') : null;
}

export async function readLocation(): Promise<StudentLocation | null> {
  if ((await checkPermission('location')) !== 'granted') return null;
  const { coords } = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const places = await Location.reverseGeocodeAsync(coords).catch(() => []);
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    address: formatAddress(places[0]),
  };
}

/** A posição actual, lida sempre que `enabled` passa a verdadeiro. Fica `null` sem permissão. */
export function useCurrentLocation(enabled: boolean) {
  const [location, setLocation] = React.useState<StudentLocation | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) return;
    let active = true;
    setLocation(null);
    setLoading(true);
    readLocation()
      .catch(() => null)
      .then((result) => {
        if (!active) return;
        setLocation(result);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [enabled]);

  return { location, loading };
}
