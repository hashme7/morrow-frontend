export const validateFields = (fields: {
  email: string;
  password: string;
  confirmPassword: string | undefined;
  userName?: string;
}) => {
  let errors: {
    email?: string;
    password?: string; 
    userName?: string;
    confirmPassword?: string;
  } = {};

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!fields.email || !emailRegex.test(fields.email)) {
    console.log("entered in emial validtion failed..")
    errors.email = "Please enter a valid email address.";
  }

  if (!fields.password || fields.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  } else if (!/[A-Z]/.test(fields.password)) {
    errors.password = "Password must contain at least one uppercase letter.";
  } else if (!/\d/.test(fields.password)) {
    errors.password = "Password must contain at least one number.";
  } else if (!/[!@#$%^&*]/.test(fields.password)) {
    console.log("password must contain special character")
    errors.password = "Password must contain at least one special character.";
  } 
  if (
    typeof fields.confirmPassword != "undefined" &&
    fields.confirmPassword != fields.password
  ) {
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
