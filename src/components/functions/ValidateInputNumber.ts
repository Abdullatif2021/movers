export const validationInputNumber = (value: any) => {
  if (!Number(value) || Number.isNaN(Number(value))) {
    return false;
  }
  if (Number(value) < 0) {
    return false;
  }
  if (Number(value) >= 0) {
    return true;
  }
};
