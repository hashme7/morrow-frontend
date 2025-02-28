import * as Yup from "yup";
import moment from "moment";

export const projectCreateSchema = Yup.object({
  name: Yup.string().trim().required("Project name is required"),
  plannedStartDate: Yup.date()
    .required("Start date is required")
    .test(
      "data-test-startdate",
      "Please select a date after today. ",
      (value) => {
        const todaysDate = new Date();
        const startDate = moment(value, "MM/DD/YYYY").toDate();
        return todaysDate < startDate;
      }
    ),
  plannedEndDate: Yup.date()
    .required("Complete date is required")
    .test(
      "date-test",
      "Complete date must be after start date",
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
  description: Yup.string().trim().required("Description is required"),
});
