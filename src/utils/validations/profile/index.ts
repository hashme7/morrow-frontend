import * as Yup from "yup";

export const profileValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be 50 characters or less")
    .required("Full name is required"),
  publicName: Yup.string()
    .min(2, "Public name must be at least 2 characters")
    .max(30, "Public name must be 30 characters or less")
    .required("Public name is required"),
  basedIn: Yup.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must be 100 characters or less")
    .required("Location is required"),
  jobTitle: Yup.string()
    .min(2, "Job title must be at least 2 characters")
    .max(50, "Job title must be 50 characters or less")
    .required("Job title is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone must only contain numbers")
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must be 15 digits or less"),
});
