import { ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { FaFile, FaVideo } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { MdAudioFile } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useSendAttachmentsMutation } from "../../redux/api/api";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducer/misc";

const FileMenu = ({ anchorEl, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  const dispatch = useDispatch();
  const closeFileMenu = () => dispatch(setIsFileMenu(false));
  const [sendAttachments] = useSendAttachmentsMutation();

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) return;
    if (files.length > 5)
      return toast.error(`You Can Only Send 5 ${key} At A Time`);

    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();
      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));
      // fething here
      const res = await sendAttachments(myForm);
      if (res.data) toast.success(`${key} Send Successfully`, { id: toastId });
      else toast.error(`Failed To Send ${key}`, { id: toastId });
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <>
      <Menu anchorEl={anchorEl} open={isFileMenu} onClose={closeFileMenu}>
        <div style={{ width: "10rem", color: "black" }}>
          {/* images */}
          <MenuList>
            <MenuItem onClick={selectImage}>
              <FaImage className="filter invert" />
              <ListItemText className="ml-2 filter invert">Image</ListItemText>
              <input
                className="hidden"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/gif"
                onChange={(e) => fileChangeHandler(e, "Images")}
                ref={imageRef}
              />
            </MenuItem>
            {/* for audios */}

            <MenuItem onClick={selectAudio}>
              <MdAudioFile className="filter invert" />
              <ListItemText className="ml-2 filter invert">Audio</ListItemText>
              <input
                className="hidden"
                type="file"
                multiple
                accept="audio/mpeg,audio/wav"
                onChange={(e) => fileChangeHandler(e, "Audios")}
                ref={audioRef}
              />
            </MenuItem>
            {/* for videos */}

            <MenuItem onClick={selectVideo}>
              <FaVideo className="filter invert" />
              <ListItemText className="ml-2 filter invert">Video</ListItemText>
              <input
                className="hidden"
                type="file"
                multiple
                accept="video/mp4,video/webm,video/ogg"
                onChange={(e) => fileChangeHandler(e, "Videos")}
                ref={videoRef}
              />
            </MenuItem>

            {/* for file */}

            <MenuItem onClick={selectFile}>
              <FaFile className="filter invert" />
              <ListItemText className="ml-2 filter invert">File</ListItemText>
              <input
                className="hidden"
                type="file"
                multiple
                accept="*"
                onChange={(e) => fileChangeHandler(e, "Files")}
                ref={fileRef}
              />
            </MenuItem>
          </MenuList>
        </div>
      </Menu>
    </>
  );
};

export default FileMenu;
