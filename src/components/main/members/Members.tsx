import React, { useEffect, useCallback } from "react";
import Table from "./table";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import {
  getTeamMembers,
  updateRole,
} from "../../../store/slices/memberSlice";
import { RootState } from "../../../store/store";
import { IUser } from "../../../types/member";
import AddMembers from "./AddMembers";
import { membersColumns } from "../../../constants/data/data";
import { User } from "@nextui-org/react";
import { DropdownMenuComponent } from "../../Buttons/dropDown";
import { options } from "../../../constants/Buttons";

const Member: React.FC = () => {
  const dispatch = useAppDispatch();
  const { members, totalPages, currentPage, isLoading } = useAppSelector(
    (state: RootState) => state.members
  );
  const { selectProjectId,selectProject } = useAppSelector(
    (state: RootState) => state.project
  );

  const loadMoreUsers = useCallback(() => {
    if (!isLoading && currentPage < totalPages) {
      dispatch(
        getTeamMembers({
          projectId: String(selectProjectId),
          page: currentPage + 1,
        })
      );
    }
  }, [dispatch, currentPage, totalPages, isLoading]);

  useEffect(() => {
    dispatch(getTeamMembers({ projectId: String(selectProjectId), page: 1 }));
  }, [dispatch, selectProject]);

  const renderCell = (user: IUser, column: { name: string; uid: string }) => {
    switch (column.uid) {
      case "USERNAME":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.image }}
            description={user.email}
            name={user.username}
          >
            {user.email}
          </User>
        );
      case "ROLE":
        return (
          <p className="capitalize">
            {user.role}
          </p>
        );
      case "ACTION":
        return (
          <div>
            <DropdownMenuComponent
              options={options}
              selectedKey={user.role || ""}
              onSelectionChange={(key) => {
                if (selectProject) {
                  dispatch(updateRole({ userId: user._id.toString(), teamId: selectProject.id.toString(), role:key }))
                }
              }}
              buttonLabel={
                options.find((opt) => opt.key === user.role)?.label || "Select"
              }
            />
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div>
      <div className="bg-zinc-950">
        <Table
          data={members}
          columns={membersColumns}
          renderCell={renderCell}
          onLoadMore={loadMoreUsers}
          hasMore={currentPage < totalPages}
          isLoading={isLoading}
        />
      </div>
      <div className="">
        <AddMembers />
      </div>
    </div>
  );
};

export default Member;
