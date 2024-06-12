import { useInfiniteScrollTop } from "6pp";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { RiAttachment2 } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TypingLoader } from "../component/Loader";
import FileMenu from "../component/dialogs/FileMenu";
import AppLayout from "../component/layout/AppLayout";
import MessageComponent from "../component/shared/MessageComponent";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constents/events";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { removeNewMessagesAlert } from "../redux/reducer/chat";
import { setIsFileMenu } from "../redux/reducer/misc";
import { getSocket } from "../socket";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const nevigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [iAmTyping, setIAmTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  // skip means if not having chat id then this fun is not call-get message details pi call
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  // get my message api call
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
  // console.log(chatDetails)
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  // create error for passing cutom custome useErrors hook
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!iAmTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIAmTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIAmTyping(false);
    }, [1000]);
  };

  // form submit handler
  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;
    // emmiting message to the serever
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const newMessagesListner = useCallback(
    (data) => {
      // adding condition to check right chatid is open
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );
  useEffect(() => {
    if (chatDetails.isError) return nevigate("/");
  }, [chatDetails.isError]);

  const startTypingListner = useCallback(
    (data) => {
      // adding condition to check right chatid is open
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );
  const stopTypingListner = useCallback(
    (data) => {
      // adding condition to check right chatid is open
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListner = useCallback(
    ({ data }) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          name: "Admin",
          _id: Math.floor(Math.random * 828828882),
        },
        chat: chatId,
        createdAt: new Date().toString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandlers = {
    [ALERT]: alertListner,
    [NEW_MESSAGE]: newMessagesListner,
    [START_TYPING]: startTypingListner,
    [STOP_TYPING]: stopTypingListner,
  };

  useSocketEvents(socket, eventHandlers);
  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default form submission behavior
      submitHandler(e);
    }
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessage("");
      setMessages([]);
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behaviour: `smooth` });
  }, [messages]);

  return chatDetails.isLoading ? (
    <span className="loading loading-spinner text-primary"></span>
  ) : (
    <>
      {/* chat container */}
      <div
        className="flex flex-col p-1 gap-1 h-[86%] overflow-x-hidden overflow-y-auto  scrollable bg-[#F4F4F5]"
        style={{ maxHeight: "calc(100% - 3rem)" }}
      >
        <div ref={containerRef} className="scrollable">
          {/* message render */}
          {/* {!oldMessagesChunk.isLoading &&
            oldMessagesChunk.data?.messages?.map((i) => (
              <MessageComponent key={i._id} message={i} user={user} />
            ))} */}
          {allMessages?.map((i) => (
            <MessageComponent key={i._id} message={i} user={user} />
          ))}
          <div ref={bottomRef} style={{ float: "left", clear: "both" }} />
        </div>
        {userTyping && <TypingLoader />}
      </div>

      <form
        onSubmit={submitHandler}
        className={`w-full p-1 h-[14%] flex flex-col justify-center bg-[#F4F4F5]`}
        style={{ position: "relative" }}
      >
        <div className="flex justify-center items-center gap-1 border-solid border-slate-300 border-[1px]  rounded-xl p-2">
          <button onClick={handleFileOpen} className={`text-xl text-[#007AFF]`}>
            <svg
              stroke="currentColor"
              fill="#007AFF"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.8287 7.7574L9.1718 13.4143C8.78127 13.8048 8.78127 14.4379 9.1718 14.8285C9.56232 15.219 10.1955 15.219 10.586 14.8285L16.2429 9.17161C17.4144 8.00004 17.4144 6.10055 16.2429 4.92897C15.0713 3.7574 13.1718 3.7574 12.0002 4.92897L6.34337 10.5858C4.39075 12.5384 4.39075 15.7043 6.34337 17.6569C8.29599 19.6095 11.4618 19.6095 13.4144 17.6569L19.0713 12L20.4855 13.4143L14.8287 19.0711C12.095 21.8048 7.66283 21.8048 4.92916 19.0711C2.19549 16.3374 2.19549 11.9053 4.92916 9.17161L10.586 3.51476C12.5386 1.56214 15.7045 1.56214 17.6571 3.51476C19.6097 5.46738 19.6097 8.63321 17.6571 10.5858L12.0002 16.2427C10.8287 17.4143 8.92916 17.4143 7.75759 16.2427C6.58601 15.0711 6.58601 13.1716 7.75759 12L13.4144 6.34319L14.8287 7.7574Z"></path>
            </svg>
          </button>

          <input
            type="text"
            className="w-[90%] h-[100%]  outline-none text-black p-[0.3rem] pl-3 bg-transparent  "
            placeholder="Type a message..."
            value={message}
            onChange={messageOnChange}
            onKeyPress={handleKeyPress}
          />
          <button
            type="submit"
            className="text-2xl bg-[#007AFF]  p-1  w-8 h-8 flex items-center justify-center hover:rotate-12 hover:scale-110 duration-300 hover:bg-[#007bffcb] transition-all rounded-full"
          >
            <BsFillSendFill className="w-5 " />
          </button>
        </div>
      </form>
      {/* filemenu */}
      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
    </>
  );
};

export default AppLayout()(Chat);
