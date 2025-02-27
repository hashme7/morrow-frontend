export const validatePasswords = (fields: {
  password: string;
  confirmPassword: string;
  newPassword: string;
}) => {
  const errors: {
    password?: string;
    confirmPassword?: string;
    newPassword?: string;
  } = {};
  if (!fields.password || fields.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  } else if (!/[A-Z]/.test(fields.password)) {
    errors.password = "Password must contain at least one uppercase letter.";
  } else if (!/\d/.test(fields.password)) {
    errors.password = "Password must contain at least one number.";
  } else if (!/[!@#$%^&*]/.test(fields.password)) {
    console.log("password must contain special character");
    errors.password = "Password must contain at least one special character.";
  }

  if (!fields.newPassword || fields.newPassword.length < 6) {
    errors.newPassword = "new password must be at least 6 characters.";
  } else if (!/[A-Z]/.test(fields.newPassword)) {
    errors.newPassword =
      "new assword must contain at least one uppercase letter.";
  } else if (!/\d/.test(fields.newPassword)) {
    errors.newPassword = "new password must contain at least one number.";
  } else if (!/[!@#$%^&*]/.test(fields.newPassword)) {
    console.log("new password must contain special character");
    errors.newPassword =
      "new password must contain at least one special character.";
  }

  if (
    typeof fields.confirmPassword != "undefined" &&
    fields.confirmPassword != fields.password
  ) {
    errors.confirmPassword =
      "Password and confirm password should not be different";
  }
  return errors;
};
