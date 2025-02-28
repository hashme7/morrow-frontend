import * as Yup from "yup";

const reusableRules = {
  requiredString: (minLength: number, maxLength: number, fieldName: string) =>
    Yup.string()
      .trim()
      .min(
        minLength,
        `${fieldName} must be at least ${minLength} characters long.`
      )
      .max(maxLength, `${fieldName} must not exceed ${maxLength} characters.`)
      .required(`${fieldName} is required.`),

  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email.")
    .required("Email is required."),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters long.")
    .matches(/\d/, "Password must contain at least one number.")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character."
    )
    .required("Password is required."),
  columnName: Yup.string()
    .trim()
    .min(3, "Column name must be at least 3 characters long.")
    .max(50, "Column name must not exceed 50 characters.")
    .required("Column name is required."),
};

export const validationSchemas = {
  columnName: Yup.object({
    columnName: reusableRules.requiredString(3, 50, "Column name"),
  }),
};


export const validateField = async (
  schema: Yup.ObjectSchema<never>,
  values: Record<string, never>
): Promise<Record<string, string>> => {
  try {
    await schema.validate(values, { abortEarly: false });
    return {};
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      const errors: Record<string, string> = {};
      err.inner.forEach((error) => {
        if (error.path) errors[error.path] = error.message;
      });
      return errors;
    }
    return { general: "Validation failed." };
  }
};

const columnNameValidationSchema = Yup.object({
  name: reusableRules.columnName,
});

export const validateColumnName = async (name: string) => {
  try {
    await columnNameValidationSchema.validate({ name });
    return "";
  } catch (validationError) {
    if (validationError instanceof Yup.ValidationError) {
      return validationError.message;
    }
  }
};

export const NewTableSchema = Yup.object().shape({
  collectionName: Yup.string()
    .required("Collection name is required")
    .max(40, "Collection name should not be more than 40 characters")
    .min(2, "Collection name should be at least 2 characters"),
  fields: Yup.array()
    .of(
      Yup.object().shape({
        key: Yup.string()
          .required("Field name is required")
          .max(40, "Field name should not be more than 40 characters")
          .min(2, "Field name should be at least 2 characters"),
        type: Yup.string().required("Field type is required"),
      })
    )
    .required("At least one field is required"),
});


export const emailValidationSchema = Yup.object({
  email: reusableRules.email,
});