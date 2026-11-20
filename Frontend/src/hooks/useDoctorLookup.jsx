import { useEffect, useMemo, useState } from 'react';

import { getDoctor } from '../api/doctors';

const cache = new Map();

const useDoctorLookup = (doctorIds = []) => {
  const key = useMemo(
    () => [...new Set(doctorIds.filter(Boolean))].sort((a, b) => a - b).join(','),
    [doctorIds]
  );
  const [doctors, setDoctors] = useState(() => Object.fromEntries(cache));

  useEffect(() => {
    if (!key) return undefined;

    const missing = key
      .split(',')
      .map(Number)
      .filter((id) => !cache.has(id));
    if (missing.length === 0) {
      setDoctors(Object.fromEntries(cache));
      return undefined;
    }

    let active = true;
    Promise.allSettled(missing.map((id) => getDoctor(id))).then((results) => {
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          cache.set(result.value.id, result.value);
        }
      });
      if (active) setDoctors(Object.fromEntries(cache));
    });

    return () => {
      active = false;
    };
  }, [key]);

  return doctors;
};

export default useDoctorLookup;
