import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsTheme, setTheme } from "../../redux/reducer/misc";

const Theme = () => {
  const dispatch = useDispatch();
  const closeHandler = () => {
    dispatch(setIsTheme(false));
  };

  // theme work
  const { theme } = useSelector((state) => state.misc);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  return (
    <>
      <dialog open id="my_modal_5" className="modal sm:modal-middle">
        <div className="modal-box flex flex-col">
          <h3
            className={`font-bold text-lg text-center ${
              theme === `light` && `text-black`
            }`}
          >
            Select Chat Theme
          </h3>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-8 mt-6 flex-wrap "
          >
            <button
              onClick={() => dispatch(setTheme("light"))}
              className="md:w-8 md:h-8 w-4 h-4 shadow-md hover:bg-slate-100 bg-white rounded-full"
            ></button>
            <button
              onClick={() => dispatch(setTheme("dark"))}
              className="md:w-8 md:h-8  w-4 h-4 bg-black rounded-full"
            ></button>
            <button
              onClick={() => dispatch(setTheme("synthwave"))}
              className="md:w-8 md:h-8 w-4 h-4 bg-blue-950 rounded-full"
            ></button>
            <button
              onClick={() => dispatch(setTheme("valentine"))}
              className="md:w-8 md:h-8 w-4 h-4 bg-pink-400 rounded-full"
            ></button>
            <button
              onClick={() => dispatch(setTheme("aqua"))}
              className="md:w-8 md:h-8 w-4 h-4 bg-blue-400 rounded-full"
            ></button>
            <button
              onClick={() => dispatch(setTheme("coffee"))}
              className="md:w-8 md:h-8 w-4 h-4 bg-[#20161fc5] rounded-full"
            ></button>
            <button
              onClick={() => dispatch(setTheme("dim"))}
              className="md:w-8 md:h-8 w-4 h-4 bg-[#2A303C] rounded-full"
            ></button>
            <button
              onClick={() => dispatch(setTheme("black"))}
              className="md:w-8 md:h-8 w-4 h-4 bg-black rounded-full"
            ></button>
            <button
              onClick={() => dispatch(setTheme("forest"))}
              className="md:w-8 md:h-8 w-4 h-4 bg-[#171212] rounded-full"
            ></button>
            <button
              onClick={() => dispatch(setTheme("halloween"))}
              className="md:w-8 md:h-8 w-4 h-4 bg-[#212121] rounded-full"
            ></button>
            <button
              onClick={() => dispatch(setTheme("retro"))}
              className="md:w-8 md:h-8 w-4 h-4 bg-[#ECE3CA] rounded-full"
            ></button>
            <button
              onClick={() => dispatch(setTheme("luxury"))}
              className="md:w-8 md:h-8 w-4 h-4 bg-[#DCA54C] rounded-full"
            ></button>
          </motion.div>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="flex rounded-md h-12 items-center justify-center bg-red-600 pl-2 pr-2 min-h-12 hover:bg-red-500  "
              onClick={closeHandler}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Theme;
