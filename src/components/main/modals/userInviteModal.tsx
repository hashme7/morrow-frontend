import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { usersColumns } from "../../../constants/data/data";
import { IUser } from "../../../types/member";
import ReusableTable from "../members/table";
import ConfirmAction from "./ConfirmActionModal";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { sendRequest } from "../../../store/slices/RequestsSlice";

const AddMemberModal: React.FC<{
  isOpen: boolean;
  onOpenChange: () => void;
  users: IUser[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  note: string;
  handleNoteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  isOpen,
  onOpenChange,
  users,
  onLoadMore,
  hasMore,
  isLoading,
  handleNoteChange,
  note,
}) => {
  const dispatch = useAppDispatch();
  const {
    isOpen: disclosureIsOpen,
    onOpen: disclosureOnOpen,
    onOpenChange: disclosureOnOpenChange,
  } = useDisclosure();
  const { selectProject } = useAppSelector((state) => state.project);
  const [requested, setRequested] = useState(new Map());
  const [selectedUser, setSelectedUser] = useState<string>("");
  const handleConfirm = () => {
    if (selectedUser && selectProject?.id) {
      dispatch(
        sendRequest({
          projectId:selectProject?.id.toString(),
          userId: selectedUser,
          note: note,
        })
      );
      setRequested((prev) => {
        const updatedMap = new Map(prev);
        updatedMap.set(selectedUser, true);
        return updatedMap;
      });
    }
    disclosureOnOpenChange();
  };

  const handleCancel = () => {
    disclosureOnOpenChange();
  };

  const renderCell = (user: IUser, column: { name: string; uid: string }) =>
    ({
      USERNAME: (
        <div className="flex justify-start">
          <Avatar
            isBordered
            size="sm"
            src={user.image || "public/assets/images/homeBg.jpeg"}
          />
          <span className="m-1 ml-2">{user.username}</span>
        </div>
      ),
      EMAIL: <span>{user.email || "unknown"}</span>,
      ACTIONS: (
        <Button
          color={requested.get(user._id.toString()) ? "success" : "default"}
          variant="bordered"
          onPress={disclosureOnOpen}
          onClick={() => setSelectedUser(String(user._id))}
        >
          {requested.get(user._id.toString()) ? "Requested" : "Invite"}
        </Button>
      ),
    }[column.uid] || null);

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={() => console.log("closed")}
        onOpenChange={onOpenChange}
        size="5xl"
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Search User</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              label="Developers"
              placeholder="Find developers..."
              className="mb-4"
            />
            <ReusableTable
              data={users}
              columns={usersColumns}
              renderCell={renderCell}
              onLoadMore={onLoadMore}
              hasMore={hasMore}
              isLoading={isLoading}
            />
            <ConfirmAction
              handleNoteChange={handleNoteChange}
              note={note}
              isOpen={disclosureIsOpen}
              onCancel={handleCancel}
              onConfirm={handleConfirm}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddMemberModal;
