import { motion } from "framer-motion";
import React, { memo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AvatarCard from "./AvatarCard";

const Chatitem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const { isMobile } = useSelector((state) => state.misc);
  return (
    <Link
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      className="no-underline  hover:bg-[#3596FF] rounded-md m-1 text-white"
      to={`/chat/${_id}`}
    >
      <motion.div
        initial={{ opacit: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="items-center flex pl-4 pt-2 pb-2 gap-2 pr-2 "
        style={{
          backgroundColor: sameSender ? "#3596FF" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
        }}
      >
        {/* avatar card */}
        <AvatarCard avatar={avatar} />

        <div className="flex flex-col">
          <span className="truncate text-white font-light">{name}</span>
          {newMessageAlert && (
            <span className={`${isMobile ? `text-white` : ""}`}>
              {newMessageAlert.count} New Message
            </span>
          )}
        </div>

        {isOnline && (
          <span className="w-2 h-2 rounded-full bg-green-500 absolute top-[10%] right-1 translate-y-1/2 "></span>
        )}
      </motion.div>
    </Link>
  );
};

export default memo(Chatitem);
