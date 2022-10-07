export const ErrorMessages = {
  required_error: "Este campo es requerido",
  min: (minChars: number) =>
    minChars > 1
      ? `Este campo debe tener al menos ${minChars} caracteres`
      : "Este campo es requerido",
};
