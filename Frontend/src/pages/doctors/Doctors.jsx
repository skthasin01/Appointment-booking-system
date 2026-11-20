import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { getDoctors } from '../../api/doctors';
import PageHeader from '../../components/common/PageHeader';
import DoctorFilter from '../../components/doctors/DoctorFilter';
import { DEFAULT_SPECIALTIES } from '../../utils/constants';
import DoctorList from '../../components/doctors/DoctorList';
import getErrorMessage from '../../utils/getErrorMessage';

const FILTER_KEYS = ['name', 'specialty', 'location', 'max_fee'];

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const paramsKey = searchParams.toString();

  // URL is the source of truth for the active filters
  const filters = useMemo(() => {
    const params = new URLSearchParams(paramsKey);
    const values = {};
    FILTER_KEYS.forEach((key) => {
      values[key] = params.get(key) || '';
    });
    values.is_available = params.get('is_available') === 'true';
    return values;
  }, [paramsKey]);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDoctors({
        ...filters,
        is_available: filters.is_available ? true : undefined,
      });
      setDoctors(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load doctors.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const handleFilter = (values) => {
    const next = new URLSearchParams();
    FILTER_KEYS.forEach((key) => {
      const value = String(values[key] ?? '').trim();
      if (value) next.set(key, value);
    });
    if (values.is_available) next.set('is_available', 'true');
    setSearchParams(next);
  };

  // Keep the list of specialties in sync with what the API actually returns
  const specialties = useMemo(() => {
    const set = new Set(DEFAULT_SPECIALTIES);
    doctors.forEach((doctor) => doctor.specialty && set.add(doctor.specialty));
    if (filters.specialty) set.add(filters.specialty);
    return [...set].sort();
  }, [doctors, filters.specialty]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
      <PageHeader
        eyebrow="Find a doctor"
        title="Browse our doctors"
        description="Search by name, specialty, location or fee and book a time that suits you."
      />

      <div className="mt-10">
        <DoctorFilter
          key={paramsKey}
          initialValues={filters}
          specialties={specialties}
          onSubmit={handleFilter}
        />
      </div>

      {!loading && !error && (
        <p className="mt-6 text-sm text-base-content/60">
          {doctors.length} doctor{doctors.length === 1 ? '' : 's'} found
        </p>
      )}

      <div className="mt-4">
        <DoctorList
          doctors={doctors}
          loading={loading}
          error={error}
          onRetry={loadDoctors}
        />
      </div>
    </section>
  );
};

export default Doctors;
