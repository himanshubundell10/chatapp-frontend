import { motion } from "framer-motion";
import moment from "moment";
import React, { memo } from "react";
import { fileFormat } from "../../utils/features";
import RenderAttachment from "./RenderAttachment";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).fromNow();

  return (
    // for samesender
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      className={`${sameSender ? `chat chat-end` : `chat chat-start`} `}
    >
      <div
        className={
          sameSender
            ? "chat-header flex gap-2 items-center text-black font-medium"
            : "chat-header flex gap-2 items-center text-black font-medium"
        }
      >
        {sender?.name}
        <time className="text-xs opacity-60 text-black">{timeAgo}</time>
      </div>
      {content && (
        <span
          style={{
            background: "#007AFF",
            color: sameSender ? "white" : "black",
          }}
          className="chat-bubble font-normal "
        >
          {content}
        </span>
      )}

      {/* if attathment file */}
      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          return (
            <span
              style={{ background: "#007AFF" }}
              key={index}
              className="chat-bubble"
            >
              <a href={url} target="_blank" download>
                {<RenderAttachment file={file} url={url} />}
              </a>
            </span>
          );
        })}
    </motion.div>
  );
};

export default memo(MessageComponent);
