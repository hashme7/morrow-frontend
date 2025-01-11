import React from "react";
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Modal,
  Input,
  Textarea,
  DatePicker,
} from "@nextui-org/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { projectCreateSchema } from "../../../utils/validations/project";
import { useAppDispatch } from "../../../store/hooks/hooks";
import { createProject, getProjects } from "../../../store/slices/projectSlice";
import extractIdFromToken from "../../../utils/decodeToken";

interface PModalProps {
  isOpen: boolean;
  onClose: () => void;
  showNotification: (message: string) => void; // New prop
}

const PModal: React.FC<PModalProps> = ({
  isOpen,
  onClose,
  showNotification,
}) => {
  const initialValues = {
    name: "",
    plannedStartDate: null,
    plannedEndDate: null,
    description: "",
  };

  const dispatch = useAppDispatch();

  const onSubmit = async (values: typeof initialValues) => {
    await dispatch(createProject(values));
    showNotification("Project creation successfully completed.");
    onClose();
    const userId = extractIdFromToken();
    if (userId) {
      setTimeout(() => {
        dispatch(getProjects(userId));
      }, 600);
    }
  };

  return (
    <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Create Project
        </ModalHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={projectCreateSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              <ModalBody>
                <div className="flex-col flex-wrap md:flex-nowrap gap-4">
                  <Field
                    name="name"
                    as={Input}
                    type="text"
                    label="Project Name"
                    helperText={<ErrorMessage name="name" />}
                    isInvalid={!!errors.name && touched.name}
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm">{errors.name}</div>
                  )}
                </div>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                  <div className="w-1/2">
                    <DatePicker
                      name="plannedStartDate"
                      label="Start date"
                      className="max-w-[284px]"
                      onChange={(date) =>
                        setFieldValue("plannedStartDate", date)
                      }
                    />
                    {errors.plannedStartDate && touched.plannedStartDate && (
                      <div className="text-red-500 text-sm">
                        {errors.plannedStartDate}
                      </div>
                    )}
                  </div>
                  <div className="w-1/2">
                    <DatePicker
                      name="plannedEndDate"
                      label="Complete date"
                      className="max-w-[284px]"
                      onChange={(date) => setFieldValue("plannedEndDate", date)}
                    />
                    {errors.plannedEndDate && touched.plannedEndDate && (
                      <div className="text-red-500 text-sm">
                        {errors.plannedEndDate}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-col w-full flex-wrap md:flex-nowrap ">
                  <Field
                    name="description"
                    as={Textarea}
                    label="Description"
                    placeholder="Enter your description"
                    className="max-w-xs w-full"
                    helperText={<ErrorMessage name="description" />}
                    isInvalid={!!errors.description && touched.description}
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 text-sm">
                      {errors.description}
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="default" type="submit">
                  Create
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default PModal;
