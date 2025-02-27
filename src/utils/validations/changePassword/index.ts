import * as yup from "yup";

export const passwordSchema = yup.object().shape({
  currentPassword: yup.string()
    .min(6, "Password must be at least 6 characters long.")
    .matches(/\d/, "Password must contain at least one number.")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character."
    )
    .required("Password is required."),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .matches(/\d/, "Password must contain at least one number.")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character."
    )
    .required("Password is required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required")
});
