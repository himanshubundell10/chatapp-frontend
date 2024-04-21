import { Menu, Stack } from "@mui/material";
import React, { useEffect } from "react";
import { IoExit } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";
import { setIsDeleteMenu } from "../../redux/reducer/misc";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const nevigate = useNavigate();
  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );
  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };
  const [deleteChat, _, deleteChatData] = useAsyncMutation(
    useDeleteChatMutation
  );
  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

  const leaveGroupHandler = () => {
    closeHandler();
    leaveGroup("Leaving Group...", { chatId: selectedDeleteChat.chatId });
  };

  const deleteChatHandler = () => {
    closeHandler();
    deleteChat("Deleting Chat...", { chatId: selectedDeleteChat.chatId });
  };
  useEffect(() => {
    if (deleteChatData || leaveGroupData) nevigate("/");
  }, [deleteChatData, leaveGroupData]);
  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "center", horizontal: "center" }}
    >
      <Stack
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer",
          color: "black",
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        gap={"0.5rem"}
        onClick={
          selectedDeleteChat.groupChat ? leaveGroupHandler : deleteChatHandler
        }
      >
        {selectedDeleteChat.groupChat ? (
          <>
            <IoExit className="filter invert" />
            Leave Group
          </>
        ) : (
          <>
            <MdDelete className="filter invert" />
            Delete Chat
          </>
        )}
      </Stack>
    </Menu>
  );
};

export default DeleteChatMenu;
