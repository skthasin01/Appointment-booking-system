import { STATUS_OPTIONS } from '../../utils/constants';

const AppointmentStatusBadge = ({ status }) => {
  const option = STATUS_OPTIONS.find((item) => item.value === status);
  return (
    <span className={`badge badge-soft rounded-full ${option?.badge || 'badge-neutral'}`}>
      {option?.label || status}
    </span>
  );
};

export default AppointmentStatusBadge;
