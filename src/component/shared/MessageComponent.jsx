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
            ? "chat-header flex gap-2 items-center"
            : "chat-header flex gap-2 items-center"
        }
      >
        {sender?.name}
        <time className="text-xs opacity-50">{timeAgo}</time>
      </div>
      {content && <span className="chat-bubble">{content}</span>}

      {/* if attathment file */}
      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          return (
            <span key={index} className="chat-bubble">
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
