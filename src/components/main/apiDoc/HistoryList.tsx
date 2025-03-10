import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IApi } from "../../../types/api";

const HistoryList: React.FC<{ apis: IApi[] ,resetFields:()=>void}> = ({ apis,resetFields }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApi, setSelectedApi] = useState<IApi | null>(null);

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "text-green-500";
      case "POST":
        return "text-blue-500";
      case "PUT":
        return "text-yellow-500";
      case "DELETE":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const handleApiClick = (api: IApi) => {
    setSelectedApi(api);
    onOpen(); 
  };
  

  return (
    <>
      <Button
        className="w-full sm:w-64 bg-zinc-950 mb-1 rounded-xl h-10"
        endContent={<FaPlus />}
        onPress={resetFields}
      >
        New Request
      </Button>
      <div className="relative top-0 h-full sm:w-64 transition-width duration-300 rounded-xl shadow-lg bg-zinc-950">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Request History</h2>
          <ul className="space-y-2">
            {apis.length > 0 ? (
              apis.map((item, index) => (
                <li
                  key={index}
                  className="mb-2 rounded-xl bg-zinc-900 p-2 cursor-pointer hover:bg-zinc-800 transition"
                  onClick={() => handleApiClick(item)}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-medium ${getMethodColor(item.method)}`}
                    >
                      {item.method}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300 w-full overflow-hidden truncate break-all">
                    {item.url}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No request history available.</p>
            )}
          </ul>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="text-xl font-bold">API Result</ModalHeader>
          <ModalBody>
            {selectedApi ? (
              <div>
                <p className="text-gray-500">
                  <strong>Method:</strong> {selectedApi.method}
                </p>
                <p className="text-gray-500">
                  <strong>URL:</strong> {selectedApi.url}
                </p>
                <p className="text-gray-500">
                  <strong>Response:</strong>
                </p>
                <pre className="bg-gray-800 p-2 rounded-md text-white text-sm">
                  {JSON.stringify(
                    selectedApi.body == null ? "error" : selectedApi.body,
                    null,
                    2
                  )}
                </pre>
              </div>
            ) : (
              <p>No API selected.</p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default HistoryList;
