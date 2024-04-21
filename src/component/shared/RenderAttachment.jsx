import React from "react";
import { FaFile } from "react-icons/fa";
import { transformImage } from "../../utils/features";

const RenderAttachment = ({ file, url }) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" controls className="w-[200px]" />;

    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          alt="Attachment"
          className="w-[100px] h-[120px] object-cover"
        />
      );

    case "audio":
      return <audio src={url} controls preload="none" />;

    default:
      return <FaFile />;
  }
};

export default RenderAttachment;
