import { useCallback, useEffect, useMemo, useState } from 'react';

import { getDoctor } from '../api/doctors';

const cache = new Map();

const useDoctorLookup = (doctorIds = []) => {
  const key = useMemo(
    () => [...new Set(doctorIds.filter(Boolean))].sort((a, b) => a - b).join(','),
    [doctorIds]
  );
  const [doctors, setDoctors] = useState(() => Object.fromEntries(cache));
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);
  const reload = useCallback(() => setRetry((value) => value + 1), []);

  useEffect(() => {
    if (!key) {
      setError(null);
      return undefined;
    }

    const missing = key
      .split(',')
      .map(Number)
      .filter((id) => !cache.has(id));
    if (missing.length === 0) {
      setDoctors(Object.fromEntries(cache));
      setError(null);
      return undefined;
    }

    let active = true;
    Promise.allSettled(missing.map((id) => getDoctor(id))).then((results) => {
      if (!active) return;

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          cache.set(result.value.id, result.value);
        }
      });
      setDoctors(Object.fromEntries(cache));
      setError(results.find((result) => result.status === 'rejected')?.reason || null);
    });

    return () => {
      active = false;
    };
  }, [key, retry]);

  return { doctors, error, reload };
};

export default useDoctorLookup;
