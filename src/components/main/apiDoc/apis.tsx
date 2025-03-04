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
import React, { useEffect } from "react";
import HistoryList from "./HistoryList";
import { FaTrash } from "react-icons/fa";
import MonacoEditor from "@monaco-editor/react";
import { getApis } from "../../../store/slices/apiSlice";
import { useApiTest } from "../../../services/task-service/apiHooks/api";
import { useAppDispatch } from "../../../store/hooks/hooks";
import { httpMethods } from "../../../constants/httpMethods";
const ApiTests: React.FC = () => {
  const {
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
  } = useApiTest();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectProject?.id) {
      dispatch(getApis({ projectId: selectProject.id }));
    }
  }, [selectProject]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="m-2">
        <HistoryList apis={apis} resetFields={resetFields} />
      </div>
      <div className="p-2 sm:w-4/5 ">
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
            className="rounded-xl bg-zinc-900 h-12 p-1 w-40 sm:w-auto"
          />
          <button
            onClick={handleSendRequest}
            className="bg-zinc-950 h-12 text-white px-4 py-2 rounded-xl ml-4"
          >
            Send
          </button>
        </div>

        <div className="sm:m-1 w-full">
          <Tabs aria-label="Tab-option" size="sm" radius="full">
            <Tab key="QUERY_PARAMS" title="Query Params">
              <Card>
                <CardBody className="bg-zinc-950">
                  {params.map((param, i) => (
                    <div className="flex gap-1 m-2" key={i}>
                      <Input
                        className="w-1/6 h-3 sm:h-auto"
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
                        className="w-5/6 h-3  sm:h-auto"
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
                        className="m-2 hover:cursor-pointer  sm:w-6 sm:h-6"
                        onClick={() => {
                          const newParams = params.filter(
                            (_, index) => index !== i
                          );
                          setParams(newParams);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    className="w-1/5 m-2 p-2 bg-zinc-900 rounded-3xl "
                    onClick={handleAddParams}
                  >
                    Add
                  </button>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="HEADERS" title="Headers">
              <Card>
                <CardBody className="bg-zinc-950">
                  {headers.map((header, i) => (
                    <div className="flex gap-1 m-1 " key={i}>
                      <Input
                        className="w-1/6 h-3 sm:h-auto"
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
                        className="w-5/6 h-3 sm:h-auto"
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
                        className="m-2 hover:cursor-pointer  sm:w-6 sm:h-6"
                        onClick={() => {
                          const newHeaders = headers.filter(
                            (_, index) => index !== i
                          );
                          setHeaders(newHeaders);
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    className="w-1/5 m-2 p-2 bg-zinc-900 rounded-3xl"
                    onPress={handleAddHeaders}
                  >
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
