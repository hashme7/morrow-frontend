import * as yup from "yup";

export const passwordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required")
});
