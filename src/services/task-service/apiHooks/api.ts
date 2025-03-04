import { useState } from "react";
import api from "../../../utils/axios/Apis";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { toast } from "react-toastify";
import { httpMethods } from "../../../constants/httpMethods";
import { saveApi } from "../../../store/slices/apiSlice";

export const useApiTest = () => {
  const dispatch = useAppDispatch();
  const { apis } = useAppSelector((state) => state.api);
  const [endpoint, setEndpoint] = useState("");
  const [selectMethod, setSelectMethod] = useState<{
    label: string;
    value: string;
  }>({ label: "GET", value: "GET" });
  const [status, setStatus] = useState("");
  const [time, setTime] = useState(0);
  const [size, setSize] = useState(0);
  const [response, setResponse] = useState("");
  const [params, setParams] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [json, setJson] = useState<string>("");
  const { selectProject } = useAppSelector((state) => state.project);

  const handleAddParams = () => {
    setParams([...params, { key: "", value: "" }]);
  };

  const handleAddHeaders = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleJsonEditor = (value: string | undefined) => {
    setJson(value || "");
  };
  const resetFields = () => {
    setEndpoint("");
    setSelectMethod({ label: "GET", value: "GET" });
    setStatus("");
    setTime(0);
    setSize(0);
    setResponse("");
    setParams([{ key: "", value: "" }]);
    setHeaders([{ key: "", value: "" }]);
    setJson("");
  };

  const handleSelectMethod = (selectedValue: any) => {
    const selectedOption = httpMethods.find(
      (method) => method.value === selectedValue
    );
    setSelectMethod(selectedOption || { label: "GET", value: "GET" });
  };
  const handleSendRequest = async () => {
    try {
      if (selectProject) {
        const targetDetails = {
          projectId: selectProject.id,
          url: endpoint,
          method: selectMethod.value,
          headers: headers,
          queryparams: params,
          body: json ? JSON.parse(json) : undefined,
        };
        const { data } = await api.post("/task/api-test", targetDetails);
        setStatus(data.status);
        setTime(data.time);
        setSize(data.size);
        setResponse(data.body);
      }
    } catch (error: any) {
      setResponse(`Error: ${error.response?.data || error.message}`);
    }
  };
  const handleSaveRequest = async () => {
    try {
      if (selectProject) {
        const targetDetails = {
          projectId: selectProject.id,
          url: endpoint,
          method: selectMethod.value,
          body: json ? JSON.parse(json) : undefined,
          response: response,
        };
        dispatch(saveApi(targetDetails));
        toast.success("api saved", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.log(error, "eror");
      toast.success("api is already there");
      throw error;
    }
  };
  return {
    handleSaveRequest,
    handleSendRequest,
    handleSelectMethod,
    resetFields,
    handleAddParams,
    handleJsonEditor,
    handleAddHeaders,
    setEndpoint,
    setParams,
    setHeaders,
    size,
    time,
    status,
    apis,
    selectMethod,
    endpoint,
    selectProject,
    params,
    headers,
    json,
    response,
  };
};
