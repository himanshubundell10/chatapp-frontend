import { useInputValidation } from "6pp";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducer/misc";
import UserItem from "../shared/UserItem";

const NewGroup = () => {
  const groupName = useInputValidation("");
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  // const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { data, isError, error, isLoading } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const errors = [{ isError, error }];
  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group Name Is Required");
    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");
    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });
    // creating group
    closeHandler();
  };
  const { theme } = useSelector((state) => state.misc);

  return (
    <dialog
      open={isNewGroup}
      id="my_modal_5"
      className="modal modal-middle sm:modal-middle "
    >
      <div className="modal-box flex flex-col p-2">
        <h3
          className={`text-lg h-12 text-center font-extrabold ${
            theme === `light` && `text-black`
          }`}
        >
          New Group
        </h3>
        {/* group name show here */}
        <input
          value={groupName.value}
          onChange={groupName.changeHandler}
          className={`mt-2 bg-transparent w-full border-b-2 focus:outline-none focus:border-blue-500 p-1 ${
            theme === `light` && `text-black`
          }`}
          type="text"
          placeholder="Group Name"
        />

        <span
          className={`font-bold mt-2 h-12 ${theme === `light` && `text-black`}`}
        >
          Members
        </span>

        <ul className="scrollable max-h-96 pb-4">
          <li className="flex flex-col gap-4 mt-2 pr-2">
            {isLoading ? (
              <span className="loading loading-spinner text-primary text-center"></span>
            ) : (
              data?.friends?.map((i) => (
                <UserItem
                  user={i}
                  key={i._id}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(i._id)}
                />
              ))
            )}
          </li>
        </ul>

        <div className="flex gap-2 max-h-24">
          {/* if there is a button in form, it will close the modal */}
          <button
            onClick={closeHandler}
            className="flex h-12 items-center justify-center bg-red-600 pl-2 pr-2 min-h-12 rounded-md hover:bg-red-500"
          >
            Close
          </button>
          <button
            disabled={isLoadingNewGroup}
            onClick={submitHandler}
            className="flex h-12 items-center justify-center bg-[#007AFF] pl-2 pr-2 min-h-12 rounded-md hover:bg-[#3596FF]"
          >
            Create
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default NewGroup;
