import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sampleUsers } from "../../constents/sampleData";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducer/misc";
import UserItem from "../shared/UserItem";

const AddMemberDialog = ({ chatId }) => {
  // const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const dispatch = useDispatch();

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );

  const { isLoading, data, error, isError } = useAvailableFriendsQuery(chatId);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", { members: selectedMembers, chatId });
    closeHandler();
  };

  useErrors([{ error, isError }]);

  return (
    <dialog open id="my_modal_5" className="modal modal-middle sm:modal-middle">
      <div className="modal-box">
        {sampleUsers.length > 0 && (
          <h3 className="font-bold text-lg text-black text-center">
            Add Member
          </h3>
        )}
        <div className="gap-4 flex flex-col mt-2">
          {isLoading ? (
            <span className="loading loading-spinner text-primary text-center"></span>
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <span className="text-center text-black">No Friends</span>
          )}
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={closeHandler}
            className="flex h-12 items-center justify-center bg-red-600 pl-2 pr-2 min-h-12 rounded-md hover:bg-red-500"
          >
            Close
          </button>
          <button
            className="flex h-12 items-center justify-center bg-blue-700 pl-2 pr-2 min-h-12 rounded-md hover:bg-blue-600"
            onClick={addMemberSubmitHandler}
            disabled={isLoadingAddMembers}
          >
            Submit Changes
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AddMemberDialog;
