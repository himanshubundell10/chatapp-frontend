import React, { memo } from "react";
import { IoIosRemove, IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false }) => {
  const { name, _id, avatar } = user;
  const { theme } = useSelector((state) => state.misc);

  return (
    <div className="flex items-center w-full gap-2">
      {/* avtar */}
      <span className="avatar w-10 h-9 rounded-full">
        <img src={avatar} />
      </span>

      <span
        className={`overflow-hidden truncate w-full ${
          theme === `light` && `text-black`
        }`}
      >
        {name}
      </span>

      <button
        className="bg-black  rounded-full w-6 h-5 flex items-center justify-center"
        onClick={() => handler(_id)}
        disabled={handlerIsLoading}
      >
        {/* {isAdded ? (
          <IoIosRemove className="w-full rounded-full h-5  bg-error" />
        ) : (
          <IoMdAdd />
        )}
        {isSearchAdded ? <FaCheck /> : <IoMdAdd />} */}

        {isAdded ? (
          <IoIosRemove className="w-full rounded-full h-5  bg-error" />
        ) : (
          <IoMdAdd />
        )}
      </button>
    </div>
  );
};

export default memo(UserItem);
