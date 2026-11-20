import { useState } from 'react';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

import CheckboxField from '../form/CheckboxField';
import SelectInput from '../form/SelectInput';
import TextInput from '../form/TextInput';
import { DEFAULT_SPECIALTIES } from '../../utils/constants';

const emptyFilters = {
  name: '',
  specialty: '',
  location: '',
  max_fee: '',
  is_available: false,
};

/**
 * Controlled by the parent through `initialValues` + `onSubmit`.
 * Remount it (via `key`) when the URL filters change from outside.
 */
const DoctorFilter = ({ initialValues, specialties = DEFAULT_SPECIALTIES, onSubmit }) => {
  const [form, setForm] = useState({ ...emptyFilters, ...initialValues });

  const update = (field) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  const handleReset = () => {
    setForm(emptyFilters);
    onSubmit(emptyFilters);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card border border-base-300 bg-base-100 shadow-sm"
    >
      <div className="card-body gap-4 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TextInput
            label="Doctor name"
            icon={FaSearch}
            value={form.name}
            onChange={update('name')}
            placeholder="e.g. Rahman"
          />
          <SelectInput
            label="Specialty"
            value={form.specialty}
            onChange={update('specialty')}
          >
            <option value="">All specialties</option>
            {specialties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectInput>
          <TextInput
            label="Location"
            icon={FaMapMarkerAlt}
            value={form.location}
            onChange={update('location')}
            placeholder="e.g. Dhaka"
          />
          <TextInput
            label="Max fee (৳)"
            type="number"
            min="0"
            value={form.max_fee}
            onChange={update('max_fee')}
            placeholder="Any"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CheckboxField
            checked={form.is_available}
            onChange={update('is_available')}
            label="Only show available doctors"
          />
          <div className="flex gap-2">
            <button type="button" onClick={handleReset} className="btn btn-ghost">
              Reset
            </button>
            <button type="submit" className="btn btn-primary">
              <FaSearch />
              Search
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DoctorFilter;
