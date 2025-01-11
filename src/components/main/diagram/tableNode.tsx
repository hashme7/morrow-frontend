import { Handle, Node, Position } from "@xyflow/react";
import { tableState } from "../../../types/diagram";

interface DbCollectionNodeData extends Node<tableState> {
  data: tableState;
  resizing?: boolean;
  selected?: boolean;
  dragging?: boolean;
  focused?: boolean;
}

interface DbCollectionProps {
  data: DbCollectionNodeData;
}

function DbCollectionNode({ data }: DbCollectionProps) {
  if (!data?.data) {
    console.log("We are having trouble fetching data!");
    return (
      <div className="rounded-md gap-5 flex flex-col z-10 border-neutral-400 border-2 shadow-lg p-3">
        <h2 className="text-medium font-semibold">Collection not found</h2>
        <span className="text-xs font-semibold text-gray-500">
          Please try again later.
        </span>
      </div>
    );
  }

  return (
    <div className="rounded flex flex-col z-10 shadow-lg">
      <div className="flex gap-5 bg-black p-2 items-center justify-between rounded-md">
        <h2 className="text-xs font-semibold">{data.data.collectionName}</h2>
        <span className="text-xs font-semibold">collection</span>
      </div>
      <div className="bg-zinc-900">
        <ul className="space-y-0 ">
          {data.data.fields.map((field, index) => (
            <li key={index} className="relative">
              <Handle
                type="target"
                position={Position.Left}
                id={`${field.data}-target`}
              />
              <div className="flex items-center flex-row p-1 gap-5 rounded">
                <div className="w-full text-sm capitalize p-1 font-poppins">
                  {field.data}
                </div>
                <div className="p-1 text-sm">{field.type}</div>
              </div>
              <Handle
                type="source"
                position={Position.Right}
                id={`${field.data}-source`}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DbCollectionNode;
