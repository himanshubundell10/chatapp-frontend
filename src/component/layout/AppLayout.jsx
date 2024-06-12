import { Drawer } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constents/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducer/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducer/misc";
import { getSocket } from "../../socket";
import { getOrSaveFromStorage, hexToRgba70 } from "../../utils/features";
import Navbar from "../Navbar";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import MiniLoader from "../MiniLoader";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const isMediumScreen = window.innerWidth >= 750;
    const isSmallScreen = window.innerWidth >= 650;
    const hideFirstDiv = !isSmallScreen;
    const hideThirdDiv = !isMediumScreen;

    const gridStyle = {
      display: "grid",
      gridTemplateColumns: hideThirdDiv
        ? hideFirstDiv
          ? "100%"
          : "25% 75%"
        : "25% 50% 25%",
      height: "calc(100vh - 3rem)",
    };

    useEffect(() => {
      window.onresize = () => {
        window.location.reload();
      };
    }, [isMediumScreen, isSmallScreen]);

    const backgroundColor = hexToRgba70("#0000FF");

    // main code start here

    // chat id come from params
    // getmy chat api hit and fetch chat list data
    const { data, isLoading, isError, error, refetch } = useMyChatsQuery("");
    useErrors([{ isError, error }]);
    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);
    const params = useParams();
    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);
    const dispatch = useDispatch();
    const socket = getSocket();
    const nevigate = useNavigate();
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      e.preventDefault();
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const newMessagesAlertHandler = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );
    // new req notification handler - no data is send while emmiting check in backend sendfriendreq
    const newRequestListner = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListner = useCallback(() => {
      refetch();
      nevigate("/");
    }, [refetch, nevigate]);

    const onlineUsersListner = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessagesAlertHandler,
      [NEW_REQUEST]: newRequestListner,
      [REFETCH_CHATS]: refetchListner,
      [ONLINE_USERS]: onlineUsersListner,
    };

    useSocketEvents(socket, eventHandlers);

    // theme render
    const { theme } = useSelector((state) => state.misc);

    useEffect(() => {
      localStorage.setItem("theme", theme);
      const localTheme = localStorage.getItem("theme");
      document.querySelector("html").setAttribute("data-theme", localTheme);
    }, [theme]);

    return (
      <>
        {/* Navbar */}
        <Navbar />
        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {/* chat drawer */}
        {isLoading ? (
          // <MiniLoader />
          ""
        ) : (
          <Drawer
            open={isMobile}
            onClose={() => dispatch(setIsMobile(false))}
            sx={{ border: "none" }}
          >
            <div
              // style={{ backgroundColor: backgroundColor }}
              className="w-full h-screen  scrollable border-r-2 bg-[#007AFF] "
            >
              <ChatList
                w="70vw"
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            </div>
          </Drawer>
        )}

        <div style={gridStyle}>
          {/* Chatlist component */}

          <div className="hidden sm:block scrollable h-full border border-solid border-r-1 border-slate-300 border-t-0 border-l-0 bg-[#007AFF]">
            {isLoading ? (
              <MiniLoader />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </div>
          {/* Main component */}
          <div
            className={`backdrop-blur-2xl border border-solid border-r-1 border-l-0 border-t-0 border-slate-300 `}
          >
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </div>
          {/* Profile component */}
          <div className="md:block hidden backdrop-blur-2xl border-none bg-white">
            <Profile user={user} />
          </div>
        </div>
      </>
    );
  };
};

export default AppLayout;
