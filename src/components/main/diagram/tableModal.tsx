import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { dataTypes } from "../../../constants/data/data";
import { tableState } from "../../../types/diagram";

const TableModal: React.FC<{
  isOpen: boolean;
  onOpenChange: () => void;
  handleAddTable: (table: tableState) => void;
}> = ({ isOpen, onOpenChange,handleAddTable }) => {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([{ data: "", type: "" }]);

  const handleAddColumn = () => {
    setColumns([...columns, { data: "", type: "" }]);
  };

  const handleRemoveColumn = (index: number) => {
    const updatedColumns = [...columns];
    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);
  };

  const handleChange = (
    index: number,
    field: "data" | "type",
    value: string
  ) => {
    const updatedColumns = [...columns];
    updatedColumns[index][field] = value;
    setColumns(updatedColumns);
  };

  const handleSubmit = () => {
    if (!tableName.trim()) {
      alert("Table name is required!");
      return;
    }

    if (columns.some((col) => !col.data.trim() || !col.type.trim())) {
      alert("All columns must have data and type!");
      return;
    }

    console.log("Table Name:", tableName);
    console.log("Columns:", columns);
    handleAddTable({collectionName:tableName,fields:columns})
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="font-bold text-2xl">New Table</h2>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  {/* Table Name Input */}
                  <Input
                    size="sm"
                    label="Table Name"
                    className="h-8"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                  />

                  {/* Columns */}
                  <div>
                    <h1 className="font-medium mb-2">Columns</h1>
                    {columns.map((column, index) => (
                      <div key={index} className="flex items-center gap-3 mb-2">
                        <Input
                          label="Data"
                          size="sm"
                          className="flex-grow"
                          value={column.data}
                          onChange={(e) =>
                            handleChange(index, "data", e.target.value)
                          }
                        />
                        <Autocomplete
                          defaultItems={dataTypes}
                          size="sm"
                          label="Type"
                          className="w-36"
                          onInputChange={(value) =>
                            handleChange(index, "type", value)
                          }
                        >
                          {dataTypes.map((type) => (
                            <AutocompleteItem key={type.value}>
                              {type.label}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                        <FaTrash
                          color="brown"
                          className="cursor-pointer"
                          onClick={() => handleRemoveColumn(index)}
                        />
                      </div>
                    ))}
                    <Button
                      size="sm"
                      className="mt-2 rounded-lg bg-zinc-800"
                      onPress={handleAddColumn}
                    >
                      Add Column
                    </Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  className="bg-zinc-800 text-sm font-medium"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-zinc-800 text-sm font-medium"
                  onPress={handleSubmit}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default TableModal;
