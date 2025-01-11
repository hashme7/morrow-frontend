import { Input } from "@nextui-org/react";
import React, { FormEvent,  useState } from "react";

const CreateColumnForm:React.FC<{handleSubmit:(e:FormEvent<HTMLFormElement> ,statusName:string,selectedColor:string)=>void}> = ({handleSubmit}) => {
  const [statusName, setStatusName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#8B5CF6"); 
  const [customColors, setCustomColors] = useState<string[]>([]);

  const defaultColors = [
    "#8B5CF6",
    "#3B82F6",
    "#22C55E",
    "#FACC15",
    "#FB923C",
    "#EC4899",
    "#F472B6",
    "#D946EF",
    "#64748B",
    "#9CA3AF",
  ];

  const handleAddCustomColor = () => {
    const newColor = prompt("Enter a custom hex color (e.g., #ff5733):");
    if (newColor && /^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
      setCustomColors([...customColors, newColor]);
    } else {
      alert("Invalid color format!");
    }
  };

  return (
    <form
      onSubmit={(e:FormEvent<HTMLFormElement>)=>{handleSubmit(e,statusName,selectedColor)}}
      className="p-2 max-w-sm mx-auto rounded-lg shadow-md"
    >
      <div className="mb-4">
        <label
          htmlFor="statusName"
          className="block text-sm font-medium text-gray-300"
        >
          Status Name
        </label>
        <div className="flex align-middle">
          <Input
            type="text"
            id="statusName"
            value={statusName}
            variant="bordered"
            onChange={(e) => setStatusName(e.target.value)}
            placeholder="Enter name"
            className="m-auto p-1 no-focus-input text-white  focus:outline-none w-max-[5px] h-max-[35px]"
            required
          />
          <div className="m-auto">
            <button
              type="submit"
              className="w-max-[50px] h-max-[35px] bg-zinc-900 text-white py-2 px-4 rounded-md "
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {defaultColors.map((color) => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                selectedColor === color ? "border-white" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            ></div>
          ))}
          {customColors.map((color) => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                selectedColor === color ? "border-white" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
            ></div>
          ))}

          <button
            type="button"
            onClick={handleAddCustomColor}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 text-white text-lg border-2 border-dashed border-gray-500"
          >
            +
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateColumnForm;
