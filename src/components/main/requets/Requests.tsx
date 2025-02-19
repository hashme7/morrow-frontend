import React, { useEffect } from "react";
import Table from "../members/table";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { acceptRequest, getRequests } from "../../../store/slices/RequestsSlice";
import { IRequest } from "../../../types/requests";
import {requestColumns as columns} from '../../../constants/data/data';
import { Button } from "@nextui-org/react";

const Requests: React.FC = () => {
  const dispatch = useAppDispatch();
  const { requests, isLoading } = useAppSelector((state) => state.request);

  useEffect(() => {
      dispatch(getRequests())
  }, [dispatch]);

  const handleAccept = (requestId:string,teamId:string)=>{
      dispatch(acceptRequest({requestId,teamId}));
  }

  const renderCell = (request: IRequest, column: { uid: string }) => {
    switch (column.uid) {
      case "projectName":
        return <p>{request.name}</p>;
      case "note":
        return <p>{request.note}</p>;
      case "action":
        return (<div className="flex justify-start gap-4">
         <Button color="success" variant="shadow" onClick={()=>handleAccept(String(request._id),String(request.team_id))} >Accept</Button>
         <Button color="danger" variant="shadow">decline</Button>
        </div>);
      default:
        return null;
    }
  };

  if (requests.length === 0) {
    return (
      <div className="h-52 bg-zinc-900 ml-2 rounded-2xl p-4">
        <h2 className="my-auto mx-auto">No requests available.</h2>
      </div>
    );
  }

  return (
    <div className="h-fit bg-zinc-900 ml-2 rounded-2xl p-4">
      <h4 className="font-bold mb-4 text-white">Requests</h4>
      <Table
        data={requests}
        columns={columns}
        renderCell={renderCell}
        isLoading={isLoading}
        onLoadMore={function (): void {
          throw new Error("Function not implemented.");
        }}
        hasMore={false}
      />
    </div>
  );
};

export default Requests;
