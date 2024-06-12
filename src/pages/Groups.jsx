import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { MdAdd, MdDelete, MdOutlineDownloadDone } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AvatarCard from "../component/shared/AvatarCard";
import UserItem from "../component/shared/UserItem";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducer/misc";
import { hexToRgba70 } from "../utils/features";

// dynamic import
const ConfirmDeleteDialog = lazy(() =>
  import("../component/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../component/dialogs/AddMemberDialog")
);

const Groups = () => {
  const backgroundColor = hexToRgba70("#a81ddc1a");
  const [isEdit, setIsEdit] = useState(false);
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group");

  const navigateBack = () => {
    navigate("/");
  };
  // get my groups query
  const myGroups = useMyGroupsQuery("");
  const { isAddMember } = useSelector((state) => state.misc);

  // if !chatid then no auto fetch
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updation Group Name", { chatId, name: groupNameUpdatedValue });
  };

  const openDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };
  const deleteHandler = () => {
    deleteGroup("Deleting Group...", { chatId });
    closeConfirmDeleteHandler();
    navigateBack();
  };
  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  // removemember handler func
  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const errors = [
    { isError: myGroups.isError, error: myGroups.error },
    { isError: groupDetails.isError, error: groupDetails.error },
  ];

  useErrors(errors);

  useEffect(() => {
    if (groupDetails.data) {
      setGroupName(groupDetails.data.chat.name);
      setGroupNameUpdatedValue(groupDetails.data.chat.name);
      setMembers(groupDetails.data.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const GroupName = (
    <div className="flex items-center justify-center pt-5 space-x-3 ">
      {isEdit ? (
        <>
          <input
            type="text"
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            className="bg-transparent outline-none border-b-[1px] text-black font-bold text-xl border-black pt-2  placeholder-black focus:border-blue-500 cursor-pointer"
          />
          <button
            onClick={updateGroupName}
            disabled={isLoadingGroupName}
            className="text-xl filter invert"
          >
            <MdOutlineDownloadDone />
          </button>
        </>
      ) : (
        <>
          <span className="font-bold text-2xl text-black">{groupName}</span>
          <button className="filter invert" disabled={isLoadingGroupName} onClick={() => setIsEdit(true)}>
            <RiEdit2Fill />
          </button>
        </>
      )}
    </div>
  );

  const ButtonGroup = (
    <>
      <div className="flex gap-2 flex-row mt-4 p-0 sm:p-1 md:p-[1rem 4rem] ">
        <button
          onClick={openDeleteHandler}
          className="border-none bg-red-600 hover:bg-red-500 pl-2 pr-2 pt-1 pb-1 rounded-md hover:opacity-0.7 flex items-center"
        >
          <MdDelete />
          Delete Group
        </button>
        <button
          onClick={openAddMemberHandler}
          className="border-none pl-2 pr-2 pt-1 pb-1 rounded-md hover:opacity-0.7 flex items-center  bg-[#007AFF] hover:bg-[#3596FF]"
        >
          <MdAdd />
          Add Member
        </button>
      </div>
    </>
  );

  return myGroups.isLoading ? (
    <span className="loading loading-spinner text-primary"></span>
  ) : (
    <div className="flex w-full h-screen">
      {/* first div */}
      <div className="w-[30%]  hidden sm:block  backdrop-blur-2xl  overflow-y-auto scrollable border border-solid border-r-1 bg-[#007AFF]">
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </div>
      {/* second fiv */}
      <div className=" sm:w-[70%] w-full flex flex-col items-center relative  backdrop-blur-2xl">
        <button
          onClick={navigateBack}
          className="cursor-pointer duration-200 transform hover:-translate-x-1 hover:scale-125 active:scale-100 absolute top-2 left-2 text-2xl bg-black rounded-full hover:bg-blue-600"
          title="Go Back"
        >
          <IoMdArrowRoundBack />
        </button>

        {groupName && (
          <>
            {GroupName}

            <span className="m-4 self-start text-2xl font-semibold tracking-wide text-black">
              Members
            </span>

            <div className="max-w-[45rem] mx-auto self-start box-border w-full p-4 sm:p-4 md:p-[1rem 4rem] max-h-[50vh] overflow-y-auto scrollable space-y-4 shadow-lg">
              {/* members */}

              {isLoadingRemoveMember ? (
                <span className="loading loading-spinner text-primary"></span>
              ) : (
                members.map((i) => (
                  <UserItem
                    key={i._id}
                    isAdded
                    user={i}
                    handler={removeMemberHandler}
                  />
                ))
              )}
            </div>

            {ButtonGroup}
          </>
        )}
        {/* for add member */}
        {isAddMember && (
          <Suspense
            fallback={
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
            }
          >
            <AddMemberDialog chatId={chatId} />
          </Suspense>
        )}

        {/* for delete memeber  */}
        {confirmDeleteDialog && (
          <Suspense
            fallback={
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
            }
          >
            <ConfirmDeleteDialog
              deleteHandler={deleteHandler}
              handleClose={closeConfirmDeleteHandler}
            />
          </Suspense>
        )}

        {/* drawer start from here */}
        {window.innerWidth < 640 && (
          <div className="drawer ">
            <input id="my-drawer" type="checkbox" className="drawer-toggle " />
            <div className="drawer-content ">
              {/* Page content here */}
              <label
                htmlFor="my-drawer"
                className="drawer-button block sm:hidden top-2 text-2xl right-2 fixed hover:cursor-pointer filter invert "
              >
                <IoMenu />
              </label>
            </div>
            <div className="drawer-side   ">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay "
              ></label>
              <div
                // style={{ backgroundColor: backgroundColor }}
                className="menu  block sm:hidden  w-[50%]  h-full  border-none bg-[#007AFF] "
              >
                {/* Sidebar content here */}
                <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// group list
const GroupList = ({ w = "100%", myGroups = [], chatId }) => (
  <div className={`flex flex-col w-[${w}]  `}>
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem key={group._id} group={group} chatId={chatId} />
      ))
    ) : (
      <span className="text-center font-bold p-10 text-2xl tracking-wide">
        No Groups
      </span>
    )}
  </div>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  const sameSender = chatId===_id
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
      className="no-underline text-white  hover:bg-[#3596FF] rounded-md m-1"
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          backgroundColor: sameSender ? "#3596FF" : "unset",
          // color: sameSender ? "white" : "unset",
          position: "relative",
          padding: "1rem 0rem 1rem 1rem",
        }}
      >
        {/* avatar card */}
        <AvatarCard avatar={avatar} />

        <div className="flex flex-col ">
          <span className="text-white font-light">{name}</span>
        </div>
      </div>
    </Link>
  );
});

export default Groups;
