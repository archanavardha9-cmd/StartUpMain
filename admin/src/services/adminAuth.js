export const getAdminAuthHeaders = () => {
  const token = sessionStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
