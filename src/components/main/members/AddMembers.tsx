import React, { useCallback, useEffect, useState } from "react";
import { PlusIcon } from "../../../constants/icons/plusIcon/plusIcon";
import Avatar from "./Avatar";
import { useDisclosure } from "@nextui-org/react";
import AddMemberModal from "../modals/userInviteModal";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/hooks";
import { getAllUsers } from "../../../store/slices/memberSlice";

const AddMembers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users,  isLoading ,totalUserPage,currUserPage} = useAppSelector((state) => state.members);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [note, setNote] = useState("");

  const loadMore = useCallback(() => {
      dispatch(getAllUsers({ page: currUserPage+1}));
  }, [dispatch]);

  useEffect(()=>{
    loadMore()
  },[])
  const handleNoteChange = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
    const {value} = e.target;
    setNote(()=>value);
  },[]);

  useEffect(() => {
    if (!isLoading && totalUserPage > currUserPage) {
      loadMore();
    }
  }, [loadMore,currUserPage,totalUserPage]);
  return (
    <>
      <div className="bg-zinc-900 w-full rounded-lg mt-3">
        <div className="flex justify-between p-4">
          <h3 className="font-semibold text-xl">Add Member</h3>
          <PlusIcon onClick={onOpen} />
        </div>
        <div className="mt-2 font-medium">
          <p className="text-zinc-700 ml-5">Popular Developers</p>
          <div className="grid grid-cols-5 m-3">
            {users.map((user, i) =>{
              return (
                <Avatar key={i} name={user.username} src={user.image} />
              )
            } )}
          </div>
        </div>
        <AddMemberModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          users={users}
          onLoadMore={loadMore}
          hasMore={currUserPage <totalUserPage}
          isLoading={isLoading}
          note={note}
          handleNoteChange={handleNoteChange}
        />
      </div>
    </>
  );
};

export default AddMembers;
