export const checkUserRole = (role: string) => {
  return role === 'admin' || role === 'editor';
};
