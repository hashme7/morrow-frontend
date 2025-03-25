import * as Yup from "yup";
import moment from "moment";

export const projectCreateSchema = Yup.object({
  name: Yup.string().trim().required("Project name is required"),
  plannedStartDate: Yup.date()
    .required("Please select a planned start date.")
    .test(
      "data-test-startdate",
      "Start date must be a future date ",
      (value) => {
        const todaysDate = new Date();
        const startDate = moment(value, "MM/DD/YYYY").toDate();
        return todaysDate < startDate;
      }
    ),
  plannedEndDate: Yup.date()
    .required("Please select a planned end date.")
    .test(
      "date-test",
      "End date must be after the planned start date.",
      (value, context) => {
        if (!value || !context.parent.startDate) {
          return true;
        }
        const startDate = moment(
          context.parent.startDate,
          "MM/DD/YYYY"
        ).toDate();
        const endDate = moment(value, "MM/DD/YYYY").toDate();

        return endDate > startDate;
      }
    ),
  description: Yup.string()
    .trim()
    .required("Please provide a project description"),
});
