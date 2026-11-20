export const getProfilePath = (role) => {
  if (role === 'admin') return '/admin/profile';
  if (role === 'doctor') return '/doctor/profile';
  return '/profile';
};

export const getChangePasswordPath = (role) => {
  if (role === 'admin') return '/admin/profile/change-password';
  if (role === 'doctor') return '/doctor/profile/change-password';
  return '/change-password';
};
