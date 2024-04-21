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
        className="flex flex-col p-1 gap-1 h-[92%] overflow-x-hidden overflow-y-auto  scrollable"
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
        className={`absolute bottom-2 w-full p-1 h-[8%]`}
        style={{ position: "relative" }}
      >
        <div className="flex justify-center items-center gap-1">
          <button onClick={handleFileOpen} className={`text-xl`}>
            <RiAttachment2 />
          </button>

          <input
            type="text"
            className="w-[90%] h-[100%] border-none outline-none text-black p-[0.3rem] pl-3 rounded-3xl bg-slate-100  "
            placeholder="Type a message..."
            value={message}
            onChange={messageOnChange}
            onKeyPress={handleKeyPress}
          />
          <button
            type="submit"
            className="text-2xl p-1 w-7 h-6 flex items-center justify-center hover:rotate-12 transition-all bg-primary rounded-full"
          >
            <BsFillSendFill className="text-xl" />
          </button>
        </div>
      </form>
      {/* filemenu */}
      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
    </>
  );
};

export default AppLayout()(Chat);
