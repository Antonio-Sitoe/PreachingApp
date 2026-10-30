import type { StudentLocation } from '@/database/actions';
import { checkPermission, requestPermission } from '@/utils/permissions';
import * as Location from 'expo-location';
import * as React from 'react';

function formatAddress(place: Location.LocationGeocodedAddress | undefined): string | null {
  if (!place) return null;
  const area = place.district ?? place.street ?? place.name;
  const parts = [area, place.city ?? place.subregion].filter(Boolean);
  return parts.length > 0 ? [...new Set(parts)].join(', ') : null;
}

/**
 * A precisão Balanced usa a localização por rede da Google; sem ela (recusada, ou só GPS)
 * falha. Nesse caso usa a última posição conhecida ou pede ao GPS.
 */
async function readPosition(): Promise<Location.LocationObject> {
  try {
    return await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  } catch {
    const last = await Location.getLastKnownPositionAsync({ maxAge: 5 * 60 * 1000 });
    if (last) return last;
    return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  }
}

export async function readLocation(): Promise<StudentLocation | null> {
  if ((await checkPermission('location')) !== 'granted') return null;
  const { coords } = await readPosition();
  const places = await Location.reverseGeocodeAsync(coords).catch(() => []);
  return {
    latitude: coords.latitude,
    longitude: coords.longitude,
    address: formatAddress(places[0]),
  };
}

/**
 * Para um toque do utilizador: pede a permissão se faltar e lê a posição.
 * Devolve `'blocked'` quando a permissão só se dá nas definições do telemóvel.
 */
export async function requestLocation(): Promise<StudentLocation | 'blocked' | null> {
  const status = await requestPermission('location');
  if (status === 'blocked') return 'blocked';
  if (status !== 'granted') return null;
  return readLocation();
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
