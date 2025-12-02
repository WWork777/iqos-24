export const getStableProductBaseId = (
  id?: string | number,
  ref?: string | number,
  name?: string
): string => {
  if (id) return id.toString();
  if (ref) return ref.toString();
  if (name) return name.trim().toLowerCase().replace(/\s+/g, "-");
  return Math.random().toString(36).substring(2, 10);
};
