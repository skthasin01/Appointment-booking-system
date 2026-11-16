const positions = {
  left: 'left-4',
  right: 'right-4',
};

const InputIcon = ({ icon: Icon, position = 'left' }) => {
  if (!Icon) {
    return null;
  }

  return (
    <Icon
      className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 text-base-content/40 ${positions[position]}`}
    />
  );
};

export default InputIcon;
