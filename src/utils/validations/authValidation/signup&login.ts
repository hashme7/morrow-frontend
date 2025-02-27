export const validateFields = (fields: {
  email: string;
  password: string;
  confirmPassword: string | undefined;
  userName?: string;
}) => {
  const errors: {
    email?: string;
    password?: string;
    userName?: string;
    confirmPassword?: string;
  } = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!fields.email || !emailRegex.test(fields.email)) {
    errors.email = "Please enter a valid email.";
  }

  if (!fields.password || fields.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  } else if (!/[A-Z]/.test(fields.password)) {
    errors.password = "Password must contain at least one uppercase letter.";
  } else if (!/\d/.test(fields.password)) {
    errors.password = "Password must contain at least one number.";
  } else if (!/[!@#$%^&*]/.test(fields.password)) {
    errors.password = "Password must contain at least one special character.";
  }
  if (
    typeof fields.confirmPassword != "undefined" &&
    fields.confirmPassword != fields.password
  ) {
    console.log("entered");
    errors.confirmPassword =
      "Password and confirm password should not be different";
  }

  if (
    typeof fields.userName !== "undefined" &&
    fields.userName.trim().length < 3
  ) {
    errors.userName = "Username must be at least 3 characters long. ";
  }

  return errors;
};
