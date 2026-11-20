import { useMemo, useState } from 'react';
import { FaSearch, FaSyncAlt } from 'react-icons/fa';

import Loading from '../../components/common/Loading';
import AppointmentTable from '../../components/appointments/AppointmentTable';
import { STATUS_OPTIONS } from '../../utils/constants';
import SelectInput from '../../components/form/SelectInput';
import TextInput from '../../components/form/TextInput';
import useAdminAppointments from '../../hooks/useAdminAppointments';

const AdminAppointments = () => {
  const { appointments, usersById, doctorsById, loading, error, reload, updateStatus } =
    useAdminAppointments();

  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return appointments.filter((item) => {
      if (status && item.status !== status) return false;
      if (date && item.appointment_date !== date) return false;
      if (term) {
        const patient = usersById[item.patient_id];
        const doctor = doctorsById[item.doctor_id];
        const haystack = [patient?.name, patient?.email, doctor?.name, `#${item.id}`]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
  }, [appointments, status, date, search, usersById, doctorsById]);

  return (
    <div className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-base-content">Appointments</h1>
            <p className="text-sm text-base-content/60">
              Review every booking and update its status.
            </p>
          </div>
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="btn btn-ghost btn-sm"
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextInput
            label="Search"
            icon={FaSearch}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Patient, doctor or #id"
          />
          <SelectInput
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
          <TextInput
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        {loading ? (
          <Loading className="min-h-[30vh]" />
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-error">{error}</p>
            <button type="button" onClick={reload} className="btn btn-ghost btn-sm">
              Try again
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-base-content/60">
              Showing {filtered.length} of {appointments.length}
            </p>
            <AppointmentTable
              appointments={filtered}
              usersById={usersById}
              doctorsById={doctorsById}
              onStatusChange={updateStatus}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;
