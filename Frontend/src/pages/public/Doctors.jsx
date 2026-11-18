import { FaSearch, FaSlidersH } from 'react-icons/fa';
import { useSearchParams } from 'react-router';

import PageHeader from '../../components/common/PageHeader';
import DoctorCard from '../../components/doctor/DoctorCard';
import SelectInput from '../../components/form/SelectInput';
import TextInput from '../../components/form/TextInput';
import {
  cities,
  doctors,
  searchDoctors,
  specialties,
} from '../../data/doctors';

const sortOptions = [
  { value: 'rating', label: 'Top rated' },
  { value: 'fee-low', label: 'Lowest cost' },
  { value: 'fee-high', label: 'Highest cost' },
  { value: 'experience', label: 'Most experienced' },
];

const Doctors = () => {
  const [params, setParams] = useSearchParams();

  const specialty = params.get('specialty') || '';
  const city = params.get('city') || '';
  const query = params.get('q') || '';
  const sort = params.get('sort') || 'rating';

  const results = searchDoctors({ specialty, city, query, sort });

  const update = (key, value) => {
    const next = new URLSearchParams(params);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setParams(next, { replace: true });
  };

  const clearAll = () => setParams({}, { replace: true });

  const hasFilters = Boolean(specialty || city || query || params.get('sort'));

  return (
    <div>
      <section className="border-b border-base-300 bg-base-200">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
          <PageHeader
            eyebrow="Find doctors"
            title="Browse verified doctors"
            description="Filter by specialty and city, compare visit costs, and book the slot that fits your day."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body gap-4 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-base-content/50">
              <FaSlidersH />
              Filters
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SelectInput
                label="Specialty"
                value={specialty}
                onChange={(event) => update('specialty', event.target.value)}
              >
                <option value="">All specialties</option>
                {specialties.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectInput>

              <SelectInput
                label="City"
                value={city}
                onChange={(event) => update('city', event.target.value)}
              >
                <option value="">All cities</option>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectInput>

              <TextInput
                label="Search"
                type="search"
                icon={FaSearch}
                value={query}
                onChange={(event) => update('q', event.target.value)}
                placeholder="Doctor, specialty, area"
              />

              <SelectInput
                label="Sort by"
                value={sort}
                onChange={(event) => update('sort', event.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectInput>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-300 pt-4">
              <p className="text-sm text-base-content/60">
                <span className="font-semibold text-base-content">
                  {results.length}
                </span>{' '}
                of {doctors.length} doctors
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="btn btn-ghost btn-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="card mt-8 border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body items-center gap-3 p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-xl text-base-content/40">
                <FaSearch />
              </span>
              <h2 className="text-lg font-semibold text-base-content">
                No doctors match these filters
              </h2>
              <p className="max-w-md text-sm text-base-content/60">
                Try a different specialty or city, or clear the filters to see
                every doctor on AppointEase.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="btn btn-primary btn-sm mt-2"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {results.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Doctors;
