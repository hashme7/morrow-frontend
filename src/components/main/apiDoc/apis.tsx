import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Input,
  Tab,
  Tabs,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import HistoryList from "./HistoryList";
import { FaTrash } from "react-icons/fa";
import MonacoEditor from "@monaco-editor/react";
import api from "../../../utils/axios/Apis";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { getApis, saveApi } from "../../../store/slices/apiSlice";
import { toast } from "react-toastify";

const httpMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => ({
  label: method,
  value: method,
}));

const ApiTests: React.FC = () => {
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

  useEffect(() => {
    if (selectProject?.id) {
      dispatch(getApis({ projectId: selectProject.id }));
    }
  }, [selectProject]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="m-2">
        <HistoryList apis={apis} />
      </div>
      <div className="p-2 w-4/5 ">
        <div className="flex justify-between gap-1 m-1  sm:w-full">
          <Autocomplete
            defaultItems={httpMethods}
            color="secondary"
            size="sm"
            label="Method"
            className=" bg-zinc-950"
            selectedKey={selectMethod.value}
            onSelectionChange={handleSelectMethod}
          >
            {httpMethods.map((method) => (
              <AutocompleteItem key={method.value} value={method.value}>
                {method.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <input
            type="text"
            placeholder="Enter API Endpoint"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="rounded-xl bg-zinc-900 h-12 p-1"
          />
          <button
            onClick={handleSendRequest}
            className="bg-zinc-950 h-12 text-white px-4 py-2 rounded-xl ml-4"
          >
            Send
          </button>
        </div>

        <div className="m-1 w-full">
          <Tabs aria-label="Tab-option" size="sm" radius="full">
            <Tab key="QUERY_PARAMS" title="Query Params">
              <Card>
                <CardBody className="bg-zinc-950">
                  {params.map((param, i) => (
                    <div className="flex gap-1 m-1" key={i}>
                      <Input
                        className="w-1/6"
                        label="Key"
                        labelPlacement="inside"
                        value={param.key}
                        onChange={(e) => {
                          const newParams = [...params];
                          newParams[i].key = e.target.value;
                          setParams(newParams);
                        }}
                      />
                      <Input
                        className="w-5/6"
                        label="Value"
                        labelPlacement="inside"
                        value={param.value}
                        onChange={(e) => {
                          const newParams = [...params];
                          newParams[i].value = e.target.value;
                          setParams(newParams);
                        }}
                      />
                      <FaTrash
                        color="brown"
                        className="m-2 hover:cursor-pointer w-6 h-6"
                        onClick={() => {
                          const newParams = params.filter(
                            (_, index) => index !== i
                          );
                          setParams(newParams);
                        }}
                      />
                    </div>
                  ))}
                  <Button className="w-1/5 m-1" onPress={handleAddParams}>
                    Add
                  </Button>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="HEADERS" title="Headers">
              <Card>
                <CardBody>
                  {headers.map((header, i) => (
                    <div className="flex gap-1 m-1" key={i}>
                      <Input
                        className="w-1/6"
                        label="Key"
                        labelPlacement="inside"
                        value={header.key}
                        onChange={(e) => {
                          const newHeaders = [...headers];
                          newHeaders[i].key = e.target.value;
                          setHeaders(newHeaders);
                        }}
                      />
                      <Input
                        className="w-5/6"
                        label="Value"
                        labelPlacement="inside"
                        value={header.value}
                        onChange={(e) => {
                          const newHeaders = [...headers];
                          newHeaders[i].value = e.target.value;
                          setHeaders(newHeaders);
                        }}
                      />
                      <FaTrash
                        color="brown"
                        className="m-2 hover:cursor-pointer w-6 h-6"
                        onClick={() => {
                          const newHeaders = headers.filter(
                            (_, index) => index !== i
                          );
                          setHeaders(newHeaders);
                        }}
                      />
                    </div>
                  ))}
                  <Button className="w-1/5 m-1" onPress={handleAddHeaders}>
                    Add
                  </Button>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="JSON" title="Body">
              <Card>
                <CardBody>
                  <div className="flex flex-col">
                    <MonacoEditor
                      height="300px"
                      defaultLanguage="json"
                      value={json}
                      theme="vs-dark"
                      options={{
                        overviewRulerBorder: false,
                      }}
                      onChange={handleJsonEditor}
                    />
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>

        <div>
          <div className="flex justify-between">
            <div>
              <label className="block text-sm font-medium mb-2">Response</label>
            </div>
            <div className="flex gap-2">
              <label className="block text-sm font-medium mb-2">
                Status: <span>{status}</span>
              </label>
              <label className="block text-sm font-medium mb-2">
                Size: {size}
              </label>
              <label className="block text-sm font-medium mb-2">
                Time: <span>{time}ms</span>
              </label>
            </div>
          </div>
          <div className="rounded-xl p-5 w-full h-48 overflow-auto bg-zinc-950">
            <MonacoEditor
              height="300px"
              defaultLanguage="json"
              value={response}
              theme="vs-dark"
              options={{
                overviewRulerBorder: false,
              }}
              onChange={handleJsonEditor}
            />
          </div>
          <div>
            <Button className="mt-4" onPress={handleSaveRequest}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTests;
